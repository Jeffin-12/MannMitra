const express = require('express');
const router = express.Router();
const { generateReply } = require('../lib/palm');
const { assessText, isHighRisk } = require('../lib/sentiment');

// POST /api/chat/message
// body: { sessionId, message, language }
router.post('/message', async (req, res) => {
  const { sessionId, message, language } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  // Assess risk
  const riskScore = assessText(message);
  const highRisk = isHighRisk(riskScore);

  // Create a prompt that guides the generative AI to be empathetic, culturally sensitive, and safe.
  const prompt = `
You are MannMitra, an empathetic mental wellness companion for Indian youth.
Behavior: Always be non-judgmental, culturally sensitive, concise, and supportive.
If user indicates high risk (self-harm/suicidal thoughts), prioritize safety: acknowledge feelings, ask if they are safe right now, provide local helpline options, and encourage contacting emergency services or trusted person.
Language: ${language || 'English'}
User: ${message}
Respond briefly and empathetically.
  `;

  const reply = await generateReply(prompt, language);

  // store anonymized log
  try {
    await req.db.read();
    const session = req.db.data.sessions.find(s => s.id === sessionId);
    const logItem = {
      time: Date.now(),
      incoming: message.replace(/[\n\r]+/g,' ').slice(0,1000), // basic sanitization
      outgoing: reply.slice(0,2000),
      riskScore
    };
    if (session) {
      session.logs = session.logs || [];
      session.logs.push(logItem);
    } else {
      // create ephemeral session if not found
      req.db.data.sessions.push({ id: sessionId || 'unknown', createdAt: Date.now(), logs: [logItem]});
    }
    await req.db.write();
  } catch (e) {
    console.warn('DB write failed', e.message);
  }

  // If high risk, include escalation hint (no PII)
  if (highRisk) {
    const helplines = [
      { country: 'India', number: '9152987821 (iCall)' },
      { country: 'India', number: '08046110007 (Kiran)' },
      { country: 'India', number: 'National Helpline: 1800-599-0019' }
    ];
    return res.json({ reply, risk: 'high', riskScore, helplines });
  } else {
    return res.json({ reply, risk: 'low', riskScore });
  }
});

module.exports = router;
