const https = require('https');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { prompt } = req.query;

  if (!prompt) {
    res.status(400).send('Prompt is required');
    return;
  }

  const systemInstructions = "Role: You are 'Al-Jallad' (The Executioner), a legendary Saudi roaster. " +
    "Language: Saudi Najdi/White dialect (Saudi Gulf). " +
    "Task: Roast the user based on their specific input. Be witty, fast, and savage. " +
    "Style: Use modern Saudi slang. Keep it short and sharp. " +
    "Constraint: Strictly respond ONLY with the roast. No intro, no commentary.";

  const fullPrompt = `${systemInstructions}\n\nUser Input: ${prompt}`;
  const targetUrl = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai&system=${encodeURIComponent(systemInstructions)}`;

  https.get(targetUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      res.status(200).send(data);
    });
  }).on('error', (err) => {
    res.status(500).send('API Error: ' + err.message);
  });
};