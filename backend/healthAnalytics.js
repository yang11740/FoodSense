const RISK_TAGS = {
  salt: ['高盐'],
  fat: ['高脂', '高热量', '油炸'],
  sugar: ['高糖'],
  fiber: ['高纤维', '清淡'],
};

const BODY_PART_FOODS = {
  head: ['鸡蛋', '蓝莓', '核桃', '全谷物'],
  heart: ['鱼类', '坚果', '橄榄油', '深绿色蔬菜'],
  gut: ['西兰花', '燕麦', '苹果', '豆类'],
  bone: ['牛奶', '豆腐', '小鱼干', '芝麻酱'],
  muscle: ['鸡胸肉', '鸡蛋', '鱼肉', '豆制品'],
  skin: ['番茄', '橙子', '牛油果', '三文鱼'],
};

const BODY_PART_IMPACTS = {
  head: '可能影响专注力、疲劳感和餐后困倦程度。',
  heart: '可能增加身体水肿感，也会让心血管负担更高。',
  gut: '可能影响饱腹感、消化节律和餐后舒适度。',
  bone: '长期数据不足时，系统难以判断骨骼支持是否充足。',
  muscle: '有助于维持饱腹感、基础代谢和运动恢复。',
  skin: '可能影响皮肤状态、油脂平衡和抗氧化支持。',
};

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const parseJsonArray = (value) => {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (_err) {
    return [];
  }
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseRecord = (row) => ({
  id: row.id,
  date: row.date,
  meal: row.meal,
  name: row.name,
  calories: Number(row.calories) || 0,
  carbs: Number(row.carbs) || 0,
  protein: Number(row.protein) || 0,
  fat: Number(row.fat) || 0,
  ingredients: parseJsonArray(row.ingredients),
  cookingTechnique: row.cookingTechnique,
  cookingMethod: row.cookingMethod,
  recommendation: row.recommendation,
  summary: row.summary,
  reasons: parseJsonArray(row.reasons),
  tags: parseJsonArray(row.tags),
});

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const recordsBetween = (records, startKey, endKey) =>
  records.filter((record) => record.date >= startKey && record.date <= endKey);

const isRiskMeal = (record) =>
  record.recommendation === 'caution' ||
  record.recommendation === 'not-recommended' ||
  record.tags.some((tag) => [...RISK_TAGS.salt, ...RISK_TAGS.fat, ...RISK_TAGS.sugar].includes(tag));

const countTagMatches = (records, tagList) =>
  records.reduce((total, record) => total + (record.tags.some((tag) => tagList.includes(tag)) ? 1 : 0), 0);

const countTechniqueMatches = (records, techniques) =>
  records.reduce(
    (total, record) => total + (techniques.some((item) => record.cookingTechnique.includes(item) || record.cookingMethod.includes(item)) ? 1 : 0),
    0
  );

const computeBalanceScore = (records) => {
  if (records.length === 0) return 0;
  const score = records.reduce((total, record) => {
    if (record.recommendation === 'recommended') return total + 100;
    if (record.recommendation === 'caution') return total + 55;
    if (record.recommendation === 'not-recommended') return total + 25;
    return total + 50;
  }, 0);
  return Math.round(score / records.length);
};

const computeStreakDays = (records, today = new Date()) => {
  const dated = new Set(records.map((record) => record.date));
  let streak = 0;
  let cursor = startOfDay(today);

  while (dated.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

const formatPercentChange = (current, previous) => {
  if (previous === 0 && current === 0) return { value: 0, label: '持平' };
  if (previous === 0) return { value: 100, label: '新增记录' };
  const delta = Math.round(((previous - current) / previous) * 100);
  if (delta > 0) return { value: delta, label: `下降 ${delta}%` };
  if (delta < 0) return { value: Math.abs(delta), label: `上升 ${Math.abs(delta)}%` };
  return { value: 0, label: '持平' };
};

const formatBalanceChange = (current, previous) => {
  const delta = current - previous;
  if (delta > 0) return { value: delta, label: `提升 ${delta}%` };
  if (delta < 0) return { value: Math.abs(delta), label: `下降 ${Math.abs(delta)}%` };
  return { value: 0, label: '持平' };
};

const buildMainRiskTags = (records) => {
  const counts = [
    { label: '高盐', value: countTagMatches(records, RISK_TAGS.salt) },
    { label: '高脂', value: countTagMatches(records, RISK_TAGS.fat) },
    { label: '高糖', value: countTagMatches(records, RISK_TAGS.sugar) },
  ].filter((item) => item.value > 0);

  return counts.map((item) => `${item.label} ${item.value} 次`);
};

const buildWeekSummary = ({ thisWeek, lastWeek, profile, goals, preferences }) => {
  const thisWeekRisk = thisWeek.filter(isRiskMeal).length;
  const lastWeekRisk = lastWeek.filter(isRiskMeal).length;
  const friedCount = countTechniqueMatches(thisWeek, ['炸', '油炸', '红烧', '糖醋']);
  const recommendedCount = thisWeek.filter((record) => record.recommendation === 'recommended').length;
  const goal = profile?.goal || goals[0] || '健康饮食';
  const dietStyle = profile?.dietStyle || preferences[0] || '均衡饮食';

  if (thisWeek.length === 0) {
    return {
      title: '本周还没有饮食记录',
      description: `先记录 2-3 餐，小膳青才能结合你的「${goal}」目标给出更贴合的周报。`,
    };
  }

  let title = '本周饮食整体较平稳';
  if (thisWeekRisk < lastWeekRisk) {
    title = `风险餐减少了 ${lastWeekRisk - thisWeekRisk} 次，节奏更稳了`;
  } else if (recommendedCount >= Math.ceil(thisWeek.length * 0.6)) {
    title = '清淡推荐餐占比较高，整体方向不错';
  } else if (thisWeekRisk > lastWeekRisk) {
    title = '本周风险餐略多，下周可以稍微收一收';
  }

  const suggestions = [];
  if (friedCount >= 2) {
    suggestions.push(`你偏好「${dietStyle}」，建议把红烧、糖醋、炸物控制在每周 2 次以内`);
  }
  if (countTagMatches(thisWeek, RISK_TAGS.salt) >= 2) {
    suggestions.push('晚餐可以优先清蒸或凉拌，减少重口味酱汁');
  }
  if (goal.includes('减脂') || goal.includes('瘦身')) {
    suggestions.push('继续控制高热量菜品，主食换成杂粮会更利于目标');
  } else if (goal.includes('增肌')) {
    suggestions.push('保持优质蛋白摄入，训练日可以适当增加一份蛋白');
  } else if (goal.includes('肠胃')) {
    suggestions.push('多吃温热、易消化食物，少油炸和过甜菜品');
  } else {
    suggestions.push('保持记录习惯，系统会持续根据你的饮食调整建议');
  }

  return {
    title,
    description: suggestions.slice(0, 2).join('；') + '。',
  };
};

const buildReminders = ({ thisWeek, profile, goals, topRiskLabel }) => {
  const goal = profile?.goal || goals[0] || '健康饮食';
  const dietStyle = profile?.dietStyle || '均衡饮食';
  const reminders = [
    {
      type: 'diet',
      title: '午餐小提醒',
      time: '每日 12:00',
      note:
        topRiskLabel === '高盐'
          ? '今天优先清蒸或凉拌，少放酱汁和腌料。'
          : topRiskLabel === '高脂'
            ? '午餐少选油炸和浓汁红烧，搭配一份绿叶菜。'
            : topRiskLabel === '高糖'
              ? '甜口菜可以尝几口，主食尽量选粗粮。'
              : `按你的「${dietStyle}」偏好，午餐尽量七分饱、少油少盐。`,
    },
    {
      type: 'review',
      title: '复盘今日摄入',
      time: '每日 20:30',
      note:
        thisWeek.length === 0
          ? '今晚记得补一条饮食记录，方便生成你的健康周报。'
          : `围绕「${goal}」看看今天热量和三大营养素是否明显超出目标。`,
    },
  ];

  if (goal.includes('血压') || goal.includes('心血管') || countTagMatches(thisWeek, RISK_TAGS.salt) >= 2) {
    reminders.unshift({
      type: 'medication',
      title: '低盐饮食提醒',
      time: '每日 08:00',
      note: '早餐也尽量少酱菜和腌制品，帮助控制钠摄入。',
    });
  }

  return reminders;
};

const buildNextWeekGoals = ({ thisWeek, profile, goals }) => {
  const goal = profile?.goal || goals[0] || '健康饮食';
  const friedCount = countTechniqueMatches(thisWeek, ['炸', '油炸']);
  const saltCount = countTagMatches(thisWeek, RISK_TAGS.salt);
  const sugarCount = countTagMatches(thisWeek, RISK_TAGS.sugar);
  const veggieFriendly = thisWeek.filter((record) =>
    record.tags.some((tag) => ['清淡', '高纤维'].includes(tag)) ||
    record.ingredients.some((item) => ['西兰花', '菠菜', '生菜', '青菜', '蔬菜'].some((keyword) => item.includes(keyword)))
  ).length;

  const targets = [
    {
      title: '少油炸',
      note: `本周 ${friedCount} 次，目标 2 次以内`,
      progress: Math.max(20, Math.min(100, 100 - friedCount * 20)),
    },
    {
      title: '多蔬菜',
      note: veggieFriendly > 0 ? '晚餐补一份绿叶菜' : '每天至少一份深色蔬菜',
      progress: Math.max(25, Math.min(100, 40 + veggieFriendly * 15)),
    },
    {
      title: goal.includes('减脂') ? '控热量' : goal.includes('增肌') ? '补蛋白' : '控甜口',
      note:
        goal.includes('增肌')
          ? '每餐保证优质蛋白来源'
          : sugarCount > 0
            ? '糖醋类换成清炒或蒸煮'
            : `围绕「${goal}」稳定三餐`,
      progress: Math.max(30, Math.min(100, 80 - sugarCount * 15 - saltCount * 5)),
    },
  ];

  return targets;
};

const evaluateBodyPart = (partId, { recentRecords, allRecords, profile }) => {
  const recent7 = recentRecords;
  const recordCount = allRecords.length;
  const avgProtein =
    recent7.length > 0 ? recent7.reduce((sum, record) => sum + record.protein, 0) / recent7.length : 0;
  const breakfastCount = recent7.filter((record) => record.meal === '早餐').length;

  const statusFor = (score) => {
    if (recordCount < 3) return 'unknown';
    if (score >= 2) return 'attention';
    if (score === 1) return 'mild';
    return 'good';
  };

  switch (partId) {
    case 'head': {
      const sugary = countTagMatches(recent7, RISK_TAGS.sugar);
      const status = recordCount < 3 || breakfastCount === 0 ? 'unknown' : statusFor(sugary >= 2 ? 2 : sugary === 1 ? 1 : 0);
      return {
        id: 'head',
        label: '头部',
        status,
        reason:
          status === 'unknown'
            ? '饮食记录还不够多，暂时无法判断能量波动对精神状态的影响。'
            : sugary >= 2
              ? '近期甜口和高糖菜品偏多，可能影响专注力和餐后困倦感。'
              : breakfastCount === 0
                ? '最近早餐记录较少，能量供应节奏不够稳定。'
                : '近期能量摄入节奏较稳定，精神状态支持不错。',
        impact: BODY_PART_IMPACTS.head,
        foods: BODY_PART_FOODS.head,
        task: status === 'unknown' ? '今天记录一顿早餐，补充精神状态线索。' : '早餐增加全谷物或优质蛋白。',
      };
    }
    case 'heart': {
      const saltCount = countTagMatches(recent7, RISK_TAGS.salt);
      const status = recordCount < 3 ? 'unknown' : statusFor(saltCount >= 3 ? 2 : saltCount >= 1 ? 1 : 0);
      return {
        id: 'heart',
        label: '心脏',
        status,
        reason:
          status === 'unknown'
            ? '记录不足，暂时无法评估钠摄入对心血管负担的影响。'
            : saltCount >= 3
              ? '近期钠摄入偏高，重口味食物较多。'
              : saltCount >= 1
                ? '偶尔出现高盐菜品，建议继续控制酱汁和腌料。'
                : '近期钠摄入控制较好，心血管负担相对平稳。',
        impact: BODY_PART_IMPACTS.heart,
        foods: BODY_PART_FOODS.heart,
        task: saltCount > 0 ? '今天少放酱菜或浓汁酱汁。' : '继续保持清淡烹饪方式。',
      };
    }
    case 'gut': {
      const fiberFriendly = recent7.filter((record) =>
        record.tags.some((tag) => RISK_TAGS.fiber.includes(tag)) ||
        record.recommendation === 'recommended'
      ).length;
      const fried = countTechniqueMatches(recent7, ['炸', '油炸']);
      const status =
        recordCount < 3 ? 'unknown' : statusFor(fried >= 2 || fiberFriendly < Math.ceil(recent7.length * 0.4) ? 2 : fiberFriendly < Math.ceil(recent7.length * 0.6) ? 1 : 0);
      return {
        id: 'gut',
        label: '胃肠',
        status,
        reason:
          status === 'unknown'
            ? '还需要更多饮食记录来判断膳食纤维和消化负担。'
            : fried >= 2
              ? '油炸和重口味菜品偏多，胃肠负担偏高。'
              : fiberFriendly < Math.ceil(recent7.length * 0.5)
                ? '近 7 天膳食纤维摄入偏低，蔬菜和全谷物不足。'
                : '近期饮食结构较温和，胃肠舒适度不错。',
        impact: BODY_PART_IMPACTS.gut,
        foods: BODY_PART_FOODS.gut,
        task: '晚餐增加一份深色蔬菜。',
      };
    }
    case 'bone': {
      const calciumFoods = recent7.filter((record) =>
        record.ingredients.some((item) => ['牛奶', '豆腐', '芝麻', '鱼', '虾皮'].some((keyword) => item.includes(keyword)))
      ).length;
      const status =
        recordCount < 3 ? 'unknown' : statusFor(avgProtein < 15 && calciumFoods === 0 ? 2 : avgProtein < 20 || calciumFoods === 0 ? 1 : 0);
      return {
        id: 'bone',
        label: '骨骼',
        status,
        reason:
          status === 'unknown'
            ? '暂时缺少稳定的蛋白质、钙和维生素 D 摄入记录。'
            : calciumFoods === 0
              ? '近期较少出现奶制品或豆制品，骨骼支持可能不足。'
              : avgProtein < 20
                ? '蛋白质摄入略低，建议补充优质蛋白和钙源食物。'
                : '蛋白质和钙源食物摄入较稳定。',
        impact: BODY_PART_IMPACTS.bone,
        foods: BODY_PART_FOODS.bone,
        task: '今天补充一份奶制品或豆制品。',
      };
    }
    case 'muscle': {
      const status =
        recordCount < 3 ? 'unknown' : statusFor(avgProtein < 12 ? 2 : avgProtein < 18 ? 1 : 0);
      const goalHint = profile?.goal?.includes('增肌') ? '增肌' : '维持';
      return {
        id: 'muscle',
        label: '肌肉',
        status,
        reason:
          status === 'unknown'
            ? '蛋白质摄入数据还不够，暂时无法判断肌肉支持情况。'
            : avgProtein >= 20
              ? '近期蛋白质来源较稳定，整体摄入结构较均衡。'
              : avgProtein >= 15
                ? `蛋白质摄入尚可，按「${goalHint}」目标可再稳一点。`
                : '蛋白质摄入偏低，可能影响饱腹感和恢复。',
        impact: BODY_PART_IMPACTS.muscle,
        foods: BODY_PART_FOODS.muscle,
        task: '今天保证一餐有优质蛋白。',
      };
    }
    case 'skin': {
      const antioxidant = recent7.filter((record) =>
        record.ingredients.some((item) => ['番茄', '橙', '莓', '菠菜', '胡萝卜', '鱼'].some((keyword) => item.includes(keyword)))
      ).length;
      const status =
        recordCount < 3 ? 'unknown' : statusFor(antioxidant === 0 ? 2 : antioxidant === 1 ? 1 : 0);
      return {
        id: 'skin',
        label: '皮肤',
        status,
        reason:
          status === 'unknown'
            ? '蔬果和优质脂肪摄入记录不足，暂时无法评估皮肤支持。'
            : antioxidant >= 2
              ? '蔬果和优质脂肪摄入较稳定，抗氧化支持不错。'
              : antioxidant === 1
                ? '蔬果和优质脂肪摄入不够稳定。'
                : '近期较少出现富含抗氧化物的食材。',
        impact: BODY_PART_IMPACTS.skin,
        foods: BODY_PART_FOODS.skin,
        task: '今天加一份水果或番茄类蔬菜。',
      };
    }
    default:
      return null;
  }
};

const buildTodayTasks = (bodyImpacts, profile, goals) => {
  const tasks = bodyImpacts
    .filter((part) => part.status === 'attention' || part.status === 'mild')
    .slice(0, 2)
    .map((part) => part.task);

  if (tasks.length < 3 && profile?.goal) {
    tasks.push(`围绕「${profile.goal || goals[0]}」再记录一餐`);
  }

  while (tasks.length < 3) {
    tasks.push('补充一条饮食记录，让小膳青更懂你');
  }

  return tasks.slice(0, 3);
};

const buildHealthSummary = ({ records, profile, goals, preferences }) => {
  const today = startOfDay(new Date());
  const thisWeekStart = toDateKey(addDays(today, -6));
  const lastWeekStart = toDateKey(addDays(today, -13));
  const lastWeekEnd = toDateKey(addDays(today, -7));
  const todayKey = toDateKey(today);

  const thisWeek = recordsBetween(records, thisWeekStart, todayKey);
  const lastWeek = recordsBetween(records, lastWeekStart, lastWeekEnd);
  const weekSummary = buildWeekSummary({ thisWeek, lastWeek, profile, goals, preferences });

  const summaryStats = [
    { value: String(records.length), label: '识别记录', tone: 'bg-[#F0FBEF] text-[#15803D]' },
    { value: String(computeStreakDays(records, today)), label: '连续记录', tone: 'bg-[#EFF7FF] text-[#2563EB]' },
    { value: String(thisWeek.filter(isRiskMeal).length), label: '风险提醒', tone: 'bg-[#FFF7E6] text-[#B7791F]' },
  ];

  const riskTrendData = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const key = toDateKey(date);
    const dayRecords = records.filter((record) => record.date === key);
    return {
      date: WEEKDAY_LABELS[date.getDay()],
      risk: dayRecords.filter(isRiskMeal).length,
    };
  });

  const intakeTrendData = Array.from({ length: 4 }, (_, index) => {
    const weekEnd = addDays(today, -index * 7);
    const weekStart = addDays(weekEnd, -6);
    const weekRecords = recordsBetween(records, toDateKey(weekStart), toDateKey(weekEnd));
    return {
      date: `第 ${4 - index} 周`,
      value: computeBalanceScore(weekRecords),
    };
  }).reverse();

  const thisWeekRisk = thisWeek.filter(isRiskMeal).length;
  const lastWeekRisk = lastWeek.filter(isRiskMeal).length;
  const riskChange = formatPercentChange(thisWeekRisk, lastWeekRisk);
  const balanceChange = formatBalanceChange(computeBalanceScore(thisWeek), computeBalanceScore(lastWeek));

  const mainRiskTags = buildMainRiskTags(thisWeek);
  const topRiskLabel =
    [
      { label: '高盐', value: countTagMatches(thisWeek, RISK_TAGS.salt) },
      { label: '高脂', value: countTagMatches(thisWeek, RISK_TAGS.fat) },
      { label: '高糖', value: countTagMatches(thisWeek, RISK_TAGS.sugar) },
    ].sort((a, b) => b.value - a.value)[0]?.label || '';

  return {
    weekSummary,
    summaryStats,
    riskTrendData,
    intakeTrendData,
    weeklyMetrics: {
      riskChangeLabel: riskChange.label,
      riskTrend:
        riskChange.label === '新增记录' || riskChange.label === '持平'
          ? 'flat'
          : riskChange.value > 0
            ? 'down'
            : 'up',
      balanceChangeLabel: balanceChange.label,
      balanceTrend:
        balanceChange.label === '持平' || lastWeek.length === 0
          ? 'flat'
          : balanceChange.value > 0
            ? 'up'
            : 'down',
    },
    weeklyReport:
      thisWeek.length === 0
        ? '本周还没有可分析的饮食记录。先记录几餐，周报会自动根据你的实际摄入生成。'
        : `本周共记录 ${thisWeek.length} 餐，其中推荐餐 ${thisWeek.filter((record) => record.recommendation === 'recommended').length} 餐。${
            mainRiskTags.length > 0 ? `主要风险来自：${mainRiskTags.join('、')}。` : '暂未出现明显高频风险标签。'
          }`,
    mainRiskTags: mainRiskTags.length > 0 ? mainRiskTags : ['本周暂无显著风险标签'],
    reminders: buildReminders({ thisWeek, profile, goals, topRiskLabel }),
    nextWeekGoals: buildNextWeekGoals({ thisWeek, profile, goals }),
    hasEnoughData: records.length >= 3,
  };
};

const buildHealthProfile = ({ records, profile, goals }) => {
  const today = startOfDay(new Date());
  const recentStart = toDateKey(addDays(today, -6));
  const recentRecords = recordsBetween(records, recentStart, toDateKey(today));
  const bodyImpacts = ['head', 'heart', 'gut', 'bone', 'muscle', 'skin']
    .map((partId) => evaluateBodyPart(partId, { recentRecords, allRecords: records, profile }))
    .filter(Boolean);

  const missingRecords = Math.max(3 - records.length, 0);
  const profileLevel = records.length >= 8 ? 'L2' : 'L1';
  const attentionCount = bodyImpacts.filter((part) => part.status === 'attention').length;
  const overallStatus =
    records.length === 0 ? '数据不足' : missingRecords > 0 ? '需关注' : attentionCount > 0 ? '需关注' : '状态良好';

  return {
    bodyImpacts,
    todayTasks: buildTodayTasks(bodyImpacts, profile, goals),
    overallStatus,
    profileLevel,
    missingRecords,
    hasEnoughData: records.length >= 3,
  };
};

const loadUserHealthContext = (db, email, callback) => {
  db.get(
    `SELECT u.id, u.name, p.goal, p.age, p.gender, p.dietStyle, p.mood, p.height, p.weight
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.email = ?`,
    [email],
    (userErr, userRow) => {
      if (userErr) {
        callback(userErr);
        return;
      }

      if (!userRow) {
        callback(null, null);
        return;
      }

      db.all(
        `SELECT r.* FROM recipe_records r WHERE r.user_id = ? ORDER BY r.date DESC, r.created_at DESC`,
        [userRow.id],
        (recipeErr, recipeRows) => {
          if (recipeErr) {
            callback(recipeErr);
            return;
          }

          db.all(
            'SELECT goal FROM user_goals WHERE user_id = ? ORDER BY created_at ASC, id ASC',
            [userRow.id],
            (goalErr, goalRows) => {
              if (goalErr) {
                callback(goalErr);
                return;
              }

              db.all(
                'SELECT preference FROM user_preferences WHERE user_id = ? ORDER BY created_at ASC, id ASC',
                [userRow.id],
                (prefErr, prefRows) => {
                  if (prefErr) {
                    callback(prefErr);
                    return;
                  }

                  callback(null, {
                    userId: userRow.id,
                    userName: userRow.name || '',
                    profile: {
                      goal: userRow.goal || '',
                      age: userRow.age || '',
                      gender: userRow.gender || '',
                      dietStyle: userRow.dietStyle || '',
                      mood: userRow.mood || '',
                      height: userRow.height || '',
                      weight: userRow.weight || '',
                    },
                    goals: goalRows.map((row) => row.goal),
                    preferences: prefRows.map((row) => row.preference),
                    records: (recipeRows || []).map(parseRecord),
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = {
  buildHealthSummary,
  buildHealthProfile,
  loadUserHealthContext,
};
