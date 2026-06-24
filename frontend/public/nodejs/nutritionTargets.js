const parseAgeYears = (ageText) => {
  const value = String(ageText || '').trim();
  if (!value) return 30;
  if (value.includes('18')) return 22;
  if (value.includes('26')) return 30;
  if (value.includes('36')) return 43;
  if (value.includes('50')) return 55;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
};

const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(String(value || '').trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const estimateBodyMetrics = (gender) => {
  const normalized = String(gender || '').trim();
  if (normalized === '男') {
    return { heightCm: 175, weightKg: 72 };
  }
  if (normalized === '女') {
    return { heightCm: 162, weightKg: 58 };
  }
  return { heightCm: 168, weightKg: 65 };
};

const calculateBmr = ({ gender, ageYears, heightCm, weightKg }) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const normalized = String(gender || '').trim();
  if (normalized === '男') return base + 5;
  if (normalized === '女') return base - 161;
  return base - 78;
};

const goalMultiplier = (goal) => {
  const value = String(goal || '');
  if (value.includes('减脂') || value.includes('瘦身')) return 0.85;
  if (value.includes('增肌') || value.includes('塑形')) return 1.1;
  if (value.includes('肠胃')) return 0.95;
  return 1;
};

const proteinPerKg = (goal) => {
  const value = String(goal || '');
  if (value.includes('增肌') || value.includes('塑形')) return 1.8;
  if (value.includes('减脂') || value.includes('瘦身')) return 1.4;
  return 1.2;
};

const buildNote = ({ goal, dietStyle, usedEstimates }) => {
  const parts = [];
  if (goal) parts.push(`健康目标「${goal}」`);
  if (dietStyle) parts.push(`饮食风格「${dietStyle}」`);
  if (usedEstimates) parts.push('身高体重为估算值，可在「我的」补充后更精准');
  return parts.length > 0 ? `基于${parts.join('、')}计算` : '基于默认体型估算';
};

const buildNutritionTargets = ({ profile }) => {
  const gender = profile?.gender || '';
  const goal = profile?.goal || '';
  const dietStyle = profile?.dietStyle || '';
  const ageYears = parseAgeYears(profile?.age);
  const defaults = estimateBodyMetrics(gender);
  const heightCm = parseNumber(profile?.height, defaults.heightCm);
  const weightKg = parseNumber(profile?.weight, defaults.weightKg);
  const usedEstimates = !profile?.height || !profile?.weight;

  const bmr = Math.round(calculateBmr({ gender, ageYears, heightCm, weightKg }));
  const activityFactor = 1.35;
  const tdee = Math.round(bmr * activityFactor);
  const calories = Math.round(tdee * goalMultiplier(goal));

  const protein = Math.round(weightKg * proteinPerKg(goal));
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), 80);

  return {
    calories,
    carbs,
    protein,
    fat,
    bmr,
    tdee,
    heightCm,
    weightKg,
    ageYears,
    source: usedEstimates ? 'estimated' : 'profile',
    note: buildNote({ goal, dietStyle, usedEstimates }),
  };
};

module.exports = {
  buildNutritionTargets,
};
