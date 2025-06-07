
const fetch = require('node-fetch');

export default async function handler(req, res) {
  const { prompt, type, lang } = req.body;

  const content_type_map = {
    caption: "a short, catchy social media caption",
    blog: "a blog post idea",
    ad: "a persuasive ad copy",
    web: "website homepage text"
  };

  const system_instruction = `You are a helpful AI that writes ${content_type_map[type]} in ${lang === 'NP' ? 'Nepali' : 'English'}.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: system_instruction },
          { role: "user", content: prompt }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "OpenAI API error", details: err.message });
  }
}
