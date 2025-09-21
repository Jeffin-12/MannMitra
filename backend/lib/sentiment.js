// A very simple heuristic scoring using negative/positive keywords.
// For production, replace with a proper ML model or cloud sentiment API.

const negativeWords = ['suicide','kill myself','die','worthless','hopeless','alone','depressed','overwhelmed','cant','can\'t','helpless','panic','panic attack','anxiety'];
const positiveWords = ['ok','fine','better','good','helped','happy','relieved','grateful','calm'];

function assessText(text) {
  const t = (text || '').toLowerCase();
  let score = 0;
  negativeWords.forEach(w => { if (t.includes(w)) score -= 2; });
  positiveWords.forEach(w => { if (t.includes(w)) score += 1; });

  // punishing very short cries for help
  if (t.length < 20 && score < 0) score -= 1;

  // clip
  if (score > 5) score = 5;
  if (score < -10) score = -10;
  return score;
}

function isHighRisk(score) {
  // threshold for escalation
  return score <= -6;
}

module.exports = { assessText, isHighRisk };
