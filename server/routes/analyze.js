const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const upload = require('../middleware/upload');

// Retry helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateWithRetry = async (model, prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      if (error.message.includes('429') && i < retries - 1) {
        console.log(`Rate limited. Waiting 40 seconds before retry ${i + 1}...`);
        await sleep(40000);
      } else {
        throw error;
      }
    }
  }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildPrompt = (agreementText, language = 'english') => {
  return `You are a Karnataka legal expert specializing in tenant rights and rental law.

Analyze the following rental agreement strictly under the Karnataka Rent Act 1999 and return ONLY a valid JSON response. No extra text, no markdown, no explanation outside the JSON.

Language for explanations: ${language}

Karnataka Rent Act 1999 Key Rules to check:
- Security deposit must NOT exceed 10 months rent
- Eviction notice must be minimum 1 month
- Landlord CANNOT cut water or electricity supply
- Rent increase only permitted at time of renewal
- Lock-in period must be agreed by both parties
- Tenant has right to receipt for every payment
- Landlord must maintain structural repairs

Return this exact JSON structure:
{
  "overall_score": <number 0-100, where 100 is fully tenant-safe>,
  "summary": "<2 sentence plain language summary>",
  "critical_count": <number>,
  "warning_count": <number>,
  "safe_count": <number>,
  "clauses": [
    {
      "id": <number>,
      "clause_text": "<original clause text>",
      "risk_level": "<critical|warning|safe>",
      "explanation": "<plain language explanation in ${language}>",
      "karnataka_law": "<which section of Karnataka Rent Act 1999 applies, or null>",
      "fair_version": "<what this clause should say to be fair to tenant, or null if already fair>"
    }
  ]
}

Rental Agreement to analyze:
${agreementText}`;
};

// Route 1: Analyze pasted text
router.post('/analyze-rental/text', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide the rental agreement text.' });
    }

    if (text.trim().length < 20) {
      return res.status(400).json({ error: 'This does not look like a complete agreement. Please paste the full document.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // ✅ changed
    const prompt = buildPrompt(text, language || 'english');
    const result = await generateWithRetry(model, prompt); // ✅ using retry now
    const rawText = result.response.text();

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ error: 'Analysis failed. Please try again.', details: 'Could not parse AI response' });
    }

    res.json({ success: true, data: parsed });

  } catch (error) {
    console.error('Gemini API error:', error.message);
    if (error.status === 429) {
      return res.status(429).json({ error: 'Too many requests. Please try again in 30 seconds.' });
    }
    res.status(500).json({ error: 'Analysis failed. Please try again.', details: error.message });
  }
});

// Route 2: Analyze uploaded image
router.post('/analyze-rental/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file.' });
    }

    const { language } = req.body;
    const file = req.file;
    const base64Data = file.buffer.toString('base64');
    const mimeType = file.mimetype;

    if (mimeType === 'application/pdf') {
      return res.status(400).json({ error: 'PDF support coming soon. Please upload an image instead.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // ✅ consistent
    const prompt = buildPrompt('[Extract and analyze the rental agreement from this image]', language || 'english');

    const result = await generateWithRetry(model, [prompt, { inlineData: { mimeType, data: base64Data } }]); // ✅ using retry
    const rawText = result.response.text();

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({ error: 'Could not analyze the image. Please ensure it is a clear photo of the agreement.' });
    }

    res.json({ success: true, data: parsed });

  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

module.exports = router;