const { buildHealthSummary, buildHealthProfile } = require('./healthAnalytics');
const { buildNutritionTargets } = require('./nutritionTargets');

const buildChatContext = ({ userName, profile, goals, preferences, records }) => {
  const summary = buildHealthSummary({ profile, goals, preferences, records });
  const bodyProfile = buildHealthProfile({ profile, goals, records });
  const nutrition = buildNutritionTargets({ profile });

  const recentMeals = records.slice(0, 5).map((record) => {
    const tags = record.tags.length > 0 ? `（${record.tags.join('、')}）` : '';
    return `${record.date} ${record.meal}：${record.name}${tags}`;
  });

  const focusParts = bodyProfile.bodyImpacts
    .filter((part) => part.status === 'attention' || part.status === 'mild')
    .slice(0, 3)
    .map((part) => `${part.label}：${part.reason}`);

  return {
    userName: userName || '小伙伴',
    profile,
    goals,
    preferences,
    nutrition,
    weekSummary: summary.weekSummary,
    mainRiskTags: summary.mainRiskTags,
    recentMeals,
    focusParts,
    todayTasks: bodyProfile.todayTasks,
    nextWeekGoals: summary.nextWeekGoals.map((goal) => goal.title),
  };
};

const buildSystemPrompt = (context) => {
  const lines = [
    '你是「小膳青」，知膳 FoodSense 的饮食健康助手。语气温暖、简洁、可执行，避免医疗诊断措辞。',
    `用户昵称：${context.userName}`,
    `健康目标：${context.goals.join('、') || context.profile.goal || '未设置'}`,
    `饮食风格：${context.profile.dietStyle || '未设置'}；今日感觉：${context.profile.mood || '未设置'}`,
    `饮食偏好：${context.preferences.join('、') || '未设置'}`,
    `每日建议摄入：热量约 ${context.nutrition.calories} kcal，蛋白质 ${context.nutrition.protein}g，碳水 ${context.nutrition.carbs}g，脂肪 ${context.nutrition.fat}g`,
    `本周小结：${context.weekSummary.title}。${context.weekSummary.description}`,
    `本周主要风险：${context.mainRiskTags.join('、') || '暂无'}`,
    `近期饮食：${context.recentMeals.join('；') || '暂无记录'}`,
    `身体关注点：${context.focusParts.join('；') || '暂无明显关注点'}`,
    `今日建议任务：${context.todayTasks.join('；')}`,
    '回答时结合以上信息，给出个性化饮食建议；若数据不足，鼓励用户记录饮食。',
  ];
  return lines.join('\n');
};

const pickRuleReply = (message, context) => {
  const text = String(message || '').trim();
  const lower = text.toLowerCase();

  if (!text) {
    return '你可以告诉我今天吃了什么、想吃什么，或者问我该怎么调整饮食。';
  }

  if (/你好|嗨|hello|hi/.test(lower)) {
    const goal = context.goals[0] || context.profile.goal || '健康饮食';
    return `嗨 ${context.userName}，我是小膳青。看到你在关注「${goal}」，本周${context.weekSummary.title}。今天想聊饮食、目标，还是某道菜能不能吃？`;
  }

  if (/目标|计划|减脂|增肌|瘦身|塑形/.test(text)) {
    const goals = context.goals.length > 0 ? context.goals.join('、') : context.profile.goal || '均衡饮食';
    const next = context.nextWeekGoals.slice(0, 2).join('、') || '继续保持记录';
    return `你当前的健康目标是「${goals}」。结合最近记录，我建议这周优先：${next}。需要的话我可以帮你拆成今天能执行的小动作。`;
  }

  if (/风险|高盐|高糖|高脂|油炸|红烧|糖醋/.test(text)) {
    const risks = context.mainRiskTags.join('、') || '暂未出现明显高频风险';
    return `根据你最近 7 天的记录，主要风险是：${risks}。这不代表不能吃，而是提醒你可以少一点、换做法。比如清蒸代替红烧、主菜搭配绿叶菜。`;
  }

  if (/今天|今晚|午餐|晚餐|早餐|吃什么|推荐/.test(text)) {
    const mood = context.profile.mood || '清爽轻盈';
    const style = context.profile.dietStyle || '清淡';
    const focus = context.focusParts[0] || '保持均衡、少油少盐';
    return `结合你今天「${mood}」的感觉和「${style}」偏好，我建议优先清淡、好消化的组合。当前值得关注的是：${focus}。如果想吃具体菜，可以拍照记录，我帮你一起看。`;
  }

  if (/热量|卡路里|kcal|摄入|超标/.test(text)) {
    return `按你的资料估算，今天建议摄入约 ${context.nutrition.calories} kcal（蛋白质 ${context.nutrition.protein}g、碳水 ${context.nutrition.carbs}g、脂肪 ${context.nutrition.fat}g）。${context.nutrition.note}。你可以把今天已记录的餐次告诉我，我帮你看是否合适。`;
  }

  if (/任务|怎么做|建议/.test(text)) {
    return `今天可以先做这 3 件事：${context.todayTasks.join('；')}。都是结合你近期饮食和身体关注点整理的，完成 1-2 条就已经很好。`;
  }

  if (/胃|肠|消化|心脏|皮肤|肌肉|骨骼|头/.test(text)) {
    const focus = context.focusParts.join('；') || '记录还不够多，建议先补 2-3 餐饮食记录';
    return `从你的身体地图来看：${focus}。饮食调整不必激进，先从下一餐的小改变开始会更舒服。`;
  }

  if (context.recentMeals.length === 0) {
    return `我还不太了解你最近的饮食。你可以先记录 1-2 餐，或在聊天里告诉我今天吃了什么。我会结合你的目标「${context.profile.goal || '健康饮食'}」给你更具体的建议。`;
  }

  const latestMeal = context.recentMeals[0];
  return `我记住了。结合你最近吃过 ${latestMeal}，以及本周${context.weekSummary.title}，建议你下一餐优先清淡、少酱汁，并补一份蔬菜或优质蛋白。你也可以继续描述具体菜品，我帮你看怎么搭配更稳。`;
};

const { getLlmConfig, buildLlmHeaders } = require('./llmConfig');

const callLlm = async ({ systemPrompt, history, message }) => {
  const config = getLlmConfig();
  if (!config) return null;

  const { apiKey, baseUrl, model } = config;

  const payload = {
    model,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history.map((item) => ({ role: item.role, content: item.text })),
      { role: 'user', content: message },
    ],
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: buildLlmHeaders(apiKey, baseUrl),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
};

const generateAssistantReply = async ({ message, history, context }) => {
  const systemPrompt = buildSystemPrompt(context);

  try {
    const llmReply = await callLlm({ systemPrompt, history, message });
    if (llmReply) return llmReply;
  } catch (error) {
    console.error('LLM chat fallback to rules:', error.message);
  }

  return pickRuleReply(message, context);
};

const buildWelcomeMessage = (context) => {
  const goal = context.goals[0] || context.profile.goal || '健康饮食';
  if (context.recentMeals.length === 0) {
    return `嗨 ${context.userName}，我是小膳青。你已设定「${goal}」为目标，我先根据你的资料陪你聊饮食。记录几餐后，我会结合你的实际摄入给出更具体的建议。`;
  }

  return `嗨 ${context.userName}，我是小膳青。你正在关注「${goal}」，本周${context.weekSummary.title}。主要风险有：${context.mainRiskTags.join('、') || '暂不明显'}。想聊今天吃什么、怎么调整，都可以告诉我。`;
};

module.exports = {
  buildChatContext,
  buildWelcomeMessage,
  generateAssistantReply,
};
