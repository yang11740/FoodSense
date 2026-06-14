const { getVisionConfig, buildLlmHeaders } = require('./llmConfig');
const { buildChatContext } = require('./chatAssistant');
const { buildNutritionTargets } = require('./nutritionTargets');

const COOKING_TECHNIQUES = ['蒸', '煮', '炖', '煲', '炒', '爆炒', '红烧', '卤', '凉拌', '油炸'];
const RECOMMENDATIONS = ['recommended', 'caution', 'not-recommended'];

const modeInstructions = {
  food: '识别图片中的中式菜品，估算一份可食用分量的营养信息，并结合用户资料给出是否适合今天吃。',
  'nutrition-label': '读取图片中的营养成分表或配料表，尽量还原热量与三大营养素，并判断对用户是否友好。',
  'takeout-order': '读取外卖订单截图中的菜品信息，按主菜估算营养与风险，给出是否适合今天吃。',
};

const buildAnalysisPrompt = (context, mode) => {
  const nutrition = buildNutritionTargets({ profile: context.profile });
  const modeText = modeInstructions[mode] || modeInstructions.food;

  const goal = context.goals.join('、') || context.profile.goal || '健康饮食';

  return `${modeText} 用户目标：${goal}，建议每日 ${nutrition.calories} kcal。

只输出 JSON，不要 markdown，字段：
{
  "detected": true或false,
  "foodName": "菜品名称；若看不清或没有食物则写 未识别到食物",
  "recommendation": "recommended 或 caution 或 not-recommended",
  "riskTags": ["高盐", "高脂"],
  "calories": 整数,
  "carbs": 整数,
  "protein": 整数,
  "fat": 整数,
  "ingredients": ["主要食材1", "主要食材2"],
  "cookingTechnique": "必须从 ${COOKING_TECHNIQUES.join('/')} 中选一个",
  "cookingMethod": "简要烹饪方式",
  "summary": "一句话总结是否适合用户今天吃",
  "reasons": ["原因1", "原因2"]
}

要求：
1. 能辨认出食物时 detected 必须为 true，给出最可能的中餐菜名并估算营养；只有画面无食物、全黑、或完全看不清时才 detected=false 且 foodName=未识别到食物
2. 不确定具体菜名时可用大类（如「绿叶蔬菜」「面食」「炒菜」），recommendation 用 caution
3. detected=false 时营养值全部填 0，riskTags 和 reasons 留空数组
4. recommendation 结合用户健康目标，不要一律推荐
5. 营养值为单份估算，数值用整数
6. cookingTechnique 只能是枚举中的一个`;
};

const repairJsonText = (text) =>
  String(text || '')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/([{,]\s*)'([^']*)'(\s*:)/g, '$1"$2"$3')
    .replace(/:\s*'([^']*)'/g, ': "$1"');

const tryParseJsonObject = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('模型未返回有效 JSON');
  }
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return JSON.parse(repairJsonText(slice));
  }
};

const extractJsonObject = (text) => {
  const raw = String(text || '').trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : raw;
  try {
    return tryParseJsonObject(candidate);
  } catch (error) {
    console.error('Vision model JSON parse failed:', candidate.slice(0, 500));
    throw new Error('识别结果解析失败，请换一张更清晰的照片重试。');
  }
};

const normalizeRecommendation = (value) => {
  const normalized = String(value || '').trim();
  return RECOMMENDATIONS.includes(normalized) ? normalized : 'caution';
};

const normalizeCookingTechnique = (value) => {
  const normalized = String(value || '').trim();
  if (COOKING_TECHNIQUES.includes(normalized)) return normalized;
  const matched = COOKING_TECHNIQUES.find((item) => normalized.includes(item));
  return matched || '炒';
};

const NO_FOOD_NAMES = new Set(['未识别到食物', '未识别菜品', '无法识别', '无', '未知']);

const isNoFoodResult = (parsed) => {
  const detected = parsed.detected;
  const foodName = String(parsed.foodName || '').trim();
  if (detected === false || detected === 'false') return true;
  return NO_FOOD_NAMES.has(foodName);
};

const assertFoodDetected = (parsed) => {
  if (isNoFoodResult(parsed)) {
    throw new Error('照片中未识别到食物，请对准菜品后重新拍摄。');
  }
};

const normalizeAnalysisResult = (parsed) => ({
  foodName: String(parsed.foodName || '未识别菜品').trim(),
  recommendation: normalizeRecommendation(parsed.recommendation),
  riskTags: Array.isArray(parsed.riskTags) ? parsed.riskTags.map((tag) => String(tag).trim()).filter(Boolean) : [],
  calories: Math.max(0, Math.round(Number(parsed.calories) || 0)),
  carbs: Math.max(0, Math.round(Number(parsed.carbs) || 0)),
  protein: Math.max(0, Math.round(Number(parsed.protein) || 0)),
  fat: Math.max(0, Math.round(Number(parsed.fat) || 0)),
  ingredients: Array.isArray(parsed.ingredients)
    ? parsed.ingredients.map((item) => String(item).trim()).filter(Boolean)
    : [],
  cookingTechnique: normalizeCookingTechnique(parsed.cookingTechnique),
  cookingMethod: String(parsed.cookingMethod || '').trim() || '未识别',
  summary: String(parsed.summary || '').trim() || '已根据图片完成初步分析。',
  reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((item) => String(item).trim()).filter(Boolean) : [],
});

const buildFallbackAnalysisText = () =>
  JSON.stringify({
    detected: true,
    foodName: '红烧牛肉面',
    recommendation: 'caution',
    riskTags: ['高盐', '高热量'],
    calories: 680,
    carbs: 86,
    protein: 28,
    fat: 24,
    ingredients: ['牛肉', '面条', '红烧汤底', '青菜', '葱花'],
    cookingTechnique: '红烧',
    cookingMethod: '牛肉红烧后搭配面条和汤底，口味较浓',
    summary: '红烧牛肉面能提供较强饱腹感，但汤底盐分和整体热量偏高，建议适量食用。',
    reasons: ['面条带来较高碳水摄入，适合控制份量', '红烧汤底通常盐分较高，建议少喝汤'],
  });

const callVisionModel = async ({ imageDataUrl, prompt }) => {
  const config = getVisionConfig();
  if (!config) {
    console.warn('未配置 LLM_API_KEY，已使用红烧牛肉面模拟识别结果。');
    return buildFallbackAnalysisText();
  }

  const { apiKey, baseUrl, model } = config;

  const payload = {
    model,
    temperature: 0.2,
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageDataUrl,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: buildLlmHeaders(apiKey, baseUrl),
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(45000),
  });

  if (!response.ok) {
    throw new Error(`视觉模型请求失败: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
};

const analyzeFoodImage = async ({ imageDataUrl, mode = 'food', userContext }) => {
  if (!imageDataUrl || !String(imageDataUrl).startsWith('data:image/')) {
    throw new Error('无效的图片数据');
  }

  const context = buildChatContext({
    userName: userContext.userName,
    profile: userContext.profile,
    goals: userContext.goals,
    preferences: userContext.preferences,
    records: userContext.records,
  });

  const prompt = buildAnalysisPrompt(context, mode);
  const raw = await callVisionModel({ imageDataUrl, prompt });
  const parsed = extractJsonObject(raw);
  assertFoodDetected(parsed);
  return normalizeAnalysisResult(parsed);
};

module.exports = {
  analyzeFoodImage,
};
