const express = require('express');
const router = express.Router();

// A simple static resource list; extend with geolocation/counselor matching later.
router.get('/', (req, res) => {
  const resources = [
    { name: 'iCALL', description: 'Psychosocial Helpline (Tata Institute)', phone: '9152987821', url: 'https://icallcenter.org/' },
    { name: 'KIRAN', description: 'Mental Health Rehabilitation Helpline', phone: '08046110007' },
    { name: 'National Mental Health Helpline (India)', phone: '1800-599-0019' },
    { name: 'Samaritans (Intl)', description: 'Crisis support', url: 'https://www.samaritans.org/' }
  ];
  res.json(resources);
});

module.exports = router;
