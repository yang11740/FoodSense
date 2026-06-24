const getApiKey = () =>
  process.env.LLM_API_KEY ||
  process.env.ZHIPU_API_KEY ||
  process.env.OPENAI_API_KEY;

const getBaseUrl = () =>
  (process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4').replace(
    /\/$/,
    ''
  );

const buildLlmHeaders = (apiKey, baseUrl = getBaseUrl()) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  if (baseUrl.includes('openrouter.ai')) {
    const referer = process.env.OPENROUTER_HTTP_REFERER || process.env.LLM_HTTP_REFERER;
    const title = process.env.OPENROUTER_APP_NAME || process.env.LLM_APP_NAME || 'FoodSense';
    if (referer) headers['HTTP-Referer'] = referer;
    if (title) headers['X-Title'] = title;
  }

  return headers;
};

const getLlmConfig = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const baseUrl = getBaseUrl();
  return {
    apiKey,
    baseUrl,
    model: process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'glm-4-flash',
  };
};

const getVisionConfig = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const baseUrl = getBaseUrl();
  return {
    apiKey,
    baseUrl,
    model:
      process.env.VISION_MODEL ||
      process.env.LLM_VISION_MODEL ||
      'glm-4v-flash',
  };
};

module.exports = {
  getLlmConfig,
  getVisionConfig,
  buildLlmHeaders,
};
