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

const VALID_KARNATAKA_SRO = [
  "Bengaluru North", "Bengaluru South", "Bengaluru East", "Bengaluru West",
  "Bengaluru Central", "Mysuru", "Mangaluru", "Hubballi", "Dharwad",
  "Belagavi", "Kalaburagi", "Ballari", "Davanagere", "Shivamogga",
  "Tumakuru", "Raichur", "Bidar", "Vijayapura", "Bagalkot", "Gadag",
  "Haveri", "Uttara Kannada", "Udupi", "Dakshina Kannada", "Kodagu",
  "Hassan", "Chikkamagaluru", "Chitradurga", "Kolar", "Chikkaballapur",
  "Ramanagara", "Mandya", "Chamarajanagar", "Koppal", "Yadgir",
  "Vijayanagara", "Bengaluru Rural"
];

const buildPropertyPrompt = () => {
  return `You are a Karnataka property law and document verification expert.

Analyze this property document and return ONLY a valid JSON response. No extra text, no markdown, no explanation outside the JSON.

STEP 1 — EXTRACT these details (use null if not found):
- Owner name, Seller name, Buyer name
- Property address
- Survey number, Khata number
- Land area (with unit as written)
- Land area converted (give in Sq.ft, SqM, Acres, and Guntas)
- Market value declared (in rupees)
- Registration date
- Sub-Registrar office name
- Stamp duty paid (in rupees)
- Document type (Sale Deed / Gift Deed / Lease Deed / Power of Attorney / other)
- Witness 1 name, Witness 2 name

STEP 2 — COMPLETENESS CHECK (flag each as present / missing / unclear):
- Survey / Khata number
- Seller Aadhaar or PAN reference
- Encumbrance Certificate reference
- Two witness signatures
- Sub-Registrar stamp and seal
- Four-sided boundary description (North / South / East / West)
- Party photographs attached
- Seller signature
- Buyer signature

STEP 3 — FRAUD DETECTION:
- Stamp paper value vs deal value (flag if stamp paper seems too low)
- Stamp paper date vs execution date (flag if stamp paper date is AFTER execution date)
- SRO office validity (does the Sub-Registrar office name look like a Karnataka SRO?)
- Round number area (flag if land area is suspiciously perfect like exactly 1000, 2400, 5000 sqft)
- Undervaluation (flag if declared value seems unusually low for the area)
- Document consistency (flag font inconsistencies or suspicious corrections)

STEP 4 — SCHEME ELIGIBILITY HINTS:
- PMAY hint (if property value suggests EWS/LIG category)
- Ashraya hint (if property appears to be basic housing)
- PM Kisan hint (if document suggests agricultural land)

Return EXACTLY this JSON:
{
  "document_type": "<type>",
  "health_score": <0-100>,
  "summary": "<2 sentence summary>",
  "extracted_details": {
    "owner_name": "<or null>",
    "seller_name": "<or null>",
    "buyer_name": "<or null>",
    "property_address": "<or null>",
    "survey_number": "<or null>",
    "khata_number": "<or null>",
    "land_area_original": "<value with unit or null>",
    "land_area_converted": {
      "sqft": "<or null>",
      "sqm": "<or null>",
      "acres": "<or null>",
      "guntas": "<or null>"
    },
    "market_value_declared": "<in rupees or null>",
    "registration_date": "<or null>",
    "sro_office": "<or null>",
    "stamp_duty_paid": "<in rupees or null>",
    "witness_1": "<or null>",
    "witness_2": "<or null>"
  },
  "completeness_checks": [
    {
      "item": "<item name>",
      "status": "<present|missing|unclear>",
      "note": "<short explanation>"
    }
  ],
  "fraud_flags": [
    {
      "check": "<check name>",
      "status": "<passed|warning|critical>",
      "explanation": "<plain English explanation>"
    }
  ],
  "scheme_hints": [
    {
      "scheme": "<scheme name>",
      "hint": "<eligible|possibly eligible|not eligible>",
      "reason": "<one line reason>"
    }
  ],
  "passed_count": <number>,
  "warning_count": <number>,
  "critical_count": <number>
}`;
};

router.post('/analyze-property', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a property document (JPG, PNG, or PDF).' });
    }

    const file = req.file;
    const mimeType = file.mimetype;
    const base64Data = file.buffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await generateWithRetry(model, [
      { text: buildPropertyPrompt() },
      { inlineData: { mimeType, data: base64Data } }
    ]);

    const rawText = result.response.text();

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({
        error: 'Could not analyze the document. Please ensure it is a clear image.',
        details: 'Could not parse AI response'
      });
    }

    // Post-process: validate SRO against Karnataka list
    if (parsed.extracted_details?.sro_office) {
      const sroName = parsed.extracted_details.sro_office;
      const isValidSRO = VALID_KARNATAKA_SRO.some(s =>
        sroName.toLowerCase().includes(s.toLowerCase())
      );
      if (!isValidSRO) {
        parsed.fraud_flags.push({
          check: 'SRO Office Validity',
          status: 'warning',
          explanation: `"${sroName}" does not match any known Karnataka Sub-Registrar Office. Please verify.`
        });
      }
    }

    res.json({ success: true, data: parsed });

  } catch (error) {
    console.error('Property analysis error:', error.message);
    if (error.status === 429) {
      return res.status(429).json({ error: 'Too many requests. Please try again in 30 seconds.' });
    }
    res.status(500).json({ error: 'Analysis failed. Please try again.', details: error.message });
  }
});

module.exports = router;