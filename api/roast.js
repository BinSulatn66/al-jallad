module.exports = async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  const systemInstructions = "Role: You are 'Al-Jallad' (The Executioner), a legendary Saudi roaster. " +
    "Language: Saudi Najdi/White dialect (Saudi Gulf). " +
    "Task: Roast the user based on their specific input. Be witty, fast, and savage. " +
    "Style: Use modern Saudi slang. Keep it short and sharp. " +
    "Context: You are the King of Roasting. If they say something stupid, tear it down. If they act cool, humble them. " +
    "Constraint: Strictly respond ONLY with the roast. No intro, no commentary.";

  try {
    // Using the current Pollinations OpenAI-compatible endpoint
    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: prompt }
        ],
        model: 'openai',
        seed: Math.floor(Math.random() * 1000000)
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pollinations API Error:', errorText);
      return res.status(response.status).send("يا شين السرج على البقرة.. جرب ثانية.");
    }

    const data = await response.json();
    const roast = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(roast || "ما لقيت رد يناسب وجهك.");
  } catch (error) {
    console.error('Serverless Function Error:', error);
    res.status(500).send("حتى السيرفر طفش من وجهك.. جرب ثانية.");
  }
};
