export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const prompt = `You are an expert product listing assistant for a Vietnamese LEGO/3D-printed figurine e-commerce store called Legato.vn.

Analyze this product image and return a JSON object with the following fields:
{
  "nameVi": "Vietnamese product name (short, catchy, in Vietnamese)",
  "nameEn": "English product name (short, catchy)",
  "descriptionVi": "Vietnamese product description, 2-3 sentences highlighting the character or design, suitable for LEGO or 3D figurine fans",
  "descriptionEn": "English product description, 2-3 sentences",
  "category": "One of: Classic, Superheroes, Sci-Fi, Fantasy, Anime",
  "materials": "Most appropriate material type, e.g: PLA, PETG, ABS",
  "estimatedPrice": 890000,
  "dimensions": "One of: 300% (21cm), 400% (28cm), 1000% (70cm) or empty string"
}

Rules:
- Identify if it is a superhero (Marvel or DC), sci-fi (Star Wars or Cyberpunk), fantasy (medieval or magic), classic LEGO, or anime character
- All text values must be UTF-8 encoded Vietnamese where appropriate
- Return ONLY valid JSON, no markdown code blocks, no extra text`;

    const geminiPayload = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } }
        ]
      }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('Gemini API error:', err);
      return res.status(502).json({ error: 'Gemini API error' });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(422).json({ error: 'Could not parse AI response', raw: rawText });
    }

    return res.status(200).json({ result: parsed });
  } catch (error) {
    console.error('Error in ai-describe:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
