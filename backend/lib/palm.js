const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PAI_MODEL = process.env.PAI_MODEL || 'text-bison@001';

if (!GOOGLE_API_KEY) {
  console.warn('Warning: GOOGLE_API_KEY not set. PaLM calls will fail until configured.');
}

async function generateReply(prompt, language = 'en') {
  // Simple call format to Google Generative Language REST API
  // Note: endpoint and shape may vary by release. Update per your account docs.
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${encodeURIComponent(PAI_MODEL)}:generate?key=${GOOGLE_API_KEY}`;

  const body = {
    prompt: {
      text: prompt
    },
    temperature: 0.7,
    maxOutputTokens: 512
  };

  try {
    const resp = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });
    // Response shape depends on API; adjust as necessary
    const output = resp.data?.candidates?.[0]?.output || resp.data?.content || JSON.stringify(resp.data);
    return output;
  } catch (err) {
    console.error('PaLM API error', err?.response?.data || err.message);
    // Fallback empathetic reply
    return "I'm having trouble reaching the AI engine right now — I'm here to listen. Can you tell me more about what's on your mind?";
  }
}

module.exports = { generateReply };
