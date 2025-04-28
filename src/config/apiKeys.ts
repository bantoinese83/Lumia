export const API_KEYS = {
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || '',
  GEMINI_VISION_API_KEY: process.env.REACT_APP_GEMINI_VISION_API_KEY || '',
  GEMINI_DOC_API_KEY: process.env.REACT_APP_GEMINI_DOC_API_KEY || '',
};

export const validateApiKeys = () => {
  const missingKeys = Object.entries(API_KEYS)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required API keys: ${missingKeys.join(', ')}`);
  }
}; 