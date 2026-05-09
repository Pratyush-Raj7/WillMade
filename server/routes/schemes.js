// routes/schemes.js
const express = require("express");
const router = express.Router();
const { KARNATAKA_DISTRICTS, RURAL_DISTRICTS } = require("../data/karnataka_districts");
const generateSchemesPDF = require("../utils/generateSchemesPDF"); // ← ADD THIS LINE

// ─────────────────────────────────────────────────────────────
// SCHEME DEFINITIONS
// ─────────────────────────────────────────────────────────────

const SCHEMES = [

  {
    id: "ashraya",
    name: "Ashraya Housing Scheme (Karnataka)",
    category: "Housing",
    description: "Free housing for BPL families in Karnataka who do not own a home.",
    check(u) {
      const matched = [], missed = [];
      u.district && KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      u.annualIncome <= 120000
        ? matched.push("Annual income ≤ ₹1,20,000 (BPL)")
        : missed.push("Annual income must be ≤ ₹1,20,000");
      !u.propertyOwned
        ? matched.push("Does not own a house")
        : missed.push("Must not own any house or property");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "BPL Ration Card", "Income Certificate", "Caste Certificate", "Passport-size photo"],
    applyLink: "https://ashraya.karnataka.gov.in",
    office: "Local Gram Panchayat (Rural) / DUDA office (Urban)"
  },

  {
    id: "pmay_urban",
    name: "PMAY Urban (Pradhan Mantri Awas Yojana — Urban)",
    category: "Housing",
    description: "Central government housing subsidy for urban families without a pucca house.",
    check(u) {
      const matched = [], missed = [];
      const isUrban = !RURAL_DISTRICTS.includes(u.district);
      isUrban
        ? matched.push("Resides in urban area")
        : missed.push("Must reside in an urban / town area");
      !u.propertyOwned
        ? matched.push("Does not own a pucca house")
        : missed.push("Must not own a pucca house anywhere in India");
      let slabMsg = "";
      if (u.annualIncome <= 300000)       slabMsg = "EWS category (income ≤ ₹3 LPA)";
      else if (u.annualIncome <= 600000)  slabMsg = "LIG category (income ≤ ₹6 LPA)";
      else if (u.annualIncome <= 1200000) slabMsg = "MIG-I category (income ≤ ₹12 LPA)";
      else if (u.annualIncome <= 1800000) slabMsg = "MIG-II category (income ≤ ₹18 LPA)";
      if (slabMsg) matched.push(slabMsg);
      else missed.push("Annual income must be ≤ ₹18 LPA to qualify for any slab");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Income Certificate", "Bank Account Details", "Self-declaration of no pucca house", "Caste Certificate (if applicable)"],
    applyLink: "https://pmaymis.gov.in",
    office: "Urban Local Body (Municipality / Corporation)"
  },

  {
    id: "pmay_rural",
    name: "PMAY Rural (Pradhan Mantri Awas Yojana — Gramin)",
    category: "Housing",
    description: "Central government housing assistance for rural BPL households.",
    check(u) {
      const matched = [], missed = [];
      RURAL_DISTRICTS.includes(u.district)
        ? matched.push("Resides in rural / semi-rural district")
        : missed.push("Must reside in a rural district");
      u.annualIncome <= 200000
        ? matched.push("Annual income ≤ ₹2 LPA")
        : missed.push("Annual income must be ≤ ₹2 LPA");
      !u.propertyOwned
        ? matched.push("Does not own a pucca house")
        : missed.push("Must not own a pucca house");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "BPL Certificate", "SECC Data Reference", "Bank Passbook", "Job Card (if MGNREGA member)"],
    applyLink: "https://pmayg.nic.in",
    office: "Block Development Office (BDO) / Gram Panchayat"
  },

  {
    id: "rghc_scst",
    name: "Rajiv Gandhi Housing Corporation (SC/ST)",
    category: "Housing",
    description: "Subsidised housing specifically for SC/ST communities in Karnataka.",
    check(u) {
      const matched = [], missed = [];
      ["SC", "ST"].includes(u.casteCategory)
        ? matched.push(`Belongs to ${u.casteCategory} community`)
        : missed.push("Must belong to SC or ST community");
      KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      !u.propertyOwned
        ? matched.push("Does not own a house")
        : missed.push("Must not own any residential property");
      u.annualIncome <= 200000
        ? matched.push("Annual income ≤ ₹2 LPA")
        : missed.push("Annual income must be ≤ ₹2 LPA");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Caste Certificate (SC/ST)", "Income Certificate", "BPL Card", "Residence Proof"],
    applyLink: "https://rghcl.karnataka.gov.in",
    office: "Rajiv Gandhi Housing Corporation District Office"
  },

  {
    id: "pm_kisan",
    name: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    description: "₹6,000/year direct benefit transfer to small and marginal farmers.",
    check(u) {
      const matched = [], missed = [];
      u.occupation === "Farmer"
        ? matched.push("Occupation is Farmer")
        : missed.push("Must be a farmer by occupation");
      u.propertyOwned
        ? matched.push("Owns agricultural land")
        : missed.push("Must own agricultural land");
      matched.push("Not in excluded category");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Land Records / Patta", "Bank Account Details", "Mobile Number linked to Aadhaar"],
    applyLink: "https://pmkisan.gov.in",
    office: "Local Agriculture Department Office / CSC Centre"
  },

  {
    id: "widow_pension",
    name: "Widow Pension Scheme (Karnataka)",
    category: "Social Security",
    description: "Monthly pension for widowed women below poverty line in Karnataka.",
    check(u) {
      const matched = [], missed = [];
      u.gender === "Female"
        ? matched.push("Gender is Female")
        : missed.push("Must be Female");
      u.isWidow
        ? matched.push("Is a widow")
        : missed.push("Must be a widow");
      u.annualIncome <= 200000
        ? matched.push("Annual income ≤ ₹2 LPA")
        : missed.push("Annual income must be ≤ ₹2 LPA");
      KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Husband's Death Certificate", "Income Certificate", "Residence Proof", "Bank Passbook"],
    applyLink: "https://ssp.postkarnataka.gov.in",
    office: "Taluk Social Welfare Office"
  },

  {
    id: "disability_pension",
    name: "Disability Pension Scheme (Karnataka)",
    category: "Social Security",
    description: "Monthly pension for persons with disabilities below poverty line.",
    check(u) {
      const matched = [], missed = [];
      u.isDisabled
        ? matched.push("Has a disability")
        : missed.push("Must have a certified disability");
      u.annualIncome <= 200000
        ? matched.push("Annual income ≤ ₹2 LPA")
        : missed.push("Annual income must be ≤ ₹2 LPA");
      KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Disability Certificate (40%+ from CMO)", "Income Certificate", "Bank Passbook"],
    applyLink: "https://ssp.postkarnataka.gov.in",
    office: "Taluk Social Welfare Office / District SADAREM Office"
  },

  {
    id: "sandhya_suraksha",
    name: "Sandhya Suraksha Yojane (Old Age Pension)",
    category: "Social Security",
    description: "Monthly pension for senior citizens aged 60+ below poverty line in Karnataka.",
    check(u) {
      const matched = [], missed = [];
      u.age >= 60
        ? matched.push(`Age is ${u.age} (≥ 60 years)`)
        : missed.push("Must be 60 years or older");
      u.annualIncome <= 200000
        ? matched.push("Annual income ≤ ₹2 LPA")
        : missed.push("Annual income must be ≤ ₹2 LPA");
      KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Age/Birth Proof", "Income Certificate", "Residence Proof", "Bank Passbook"],
    applyLink: "https://ssp.postkarnataka.gov.in",
    office: "Gram Panchayat / Ward Office / Taluk Office"
  },

  {
    id: "ration_card",
    name: "Ration Card — BPL / APL (Karnataka)",
    category: "Food Security",
    description: "Subsidised food grains under PDS. BPL for very poor, APL for others.",
    check(u) {
      const matched = [], missed = [];
      KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      if (u.annualIncome <= 120000)       matched.push("Qualifies for BPL Ration Card (income ≤ ₹1.2 LPA)");
      else if (u.annualIncome <= 300000)  matched.push("Qualifies for APL Ration Card (income ≤ ₹3 LPA)");
      else                                missed.push("Income too high for BPL/APL ration card");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card (all family members)", "Income Certificate", "Residence Proof", "Family Photo", "Existing Ration Card (if transferring)"],
    applyLink: "https://ahara.kar.nic.in",
    office: "Taluk Food & Civil Supplies Office"
  },

  {
    id: "nfbs",
    name: "National Family Benefit Scheme (NFBS)",
    category: "Social Security",
    description: "One-time ₹20,000 assistance to BPL families on death of primary breadwinner.",
    check(u) {
      const matched = [], missed = [];
      u.annualIncome <= 120000
        ? matched.push("BPL family (income ≤ ₹1.2 LPA)")
        : missed.push("Must be a BPL family (income ≤ ₹1.2 LPA)");
      u.isPrimaryEarnerDeceased
        ? matched.push("Primary breadwinner is deceased")
        : missed.push("Primary breadwinner of family must be deceased");
      const age = u.primaryEarnerAgeAtDeath ?? u.age;
      (age >= 18 && age <= 64)
        ? matched.push("Breadwinner was aged 18–64 at time of death")
        : missed.push("Deceased breadwinner must have been aged between 18 and 64");
      KARNATAKA_DISTRICTS.includes(u.district)
        ? matched.push("Karnataka resident")
        : missed.push("Must be a Karnataka resident");
      return { eligible: missed.length === 0, matchedCriteria: matched, missedCriteria: missed };
    },
    docs: ["Aadhaar Card", "Death Certificate of Breadwinner", "BPL Certificate", "Age Proof of Deceased", "Bank Passbook"],
    applyLink: "https://socialsecurity.karnataka.gov.in",
    office: "Taluk Social Welfare Office"
  }
];

// ─────────────────────────────────────────────────────────────
// INPUT VALIDATION
// ─────────────────────────────────────────────────────────────

function validateInput(body) {
  const errors = [];
  const { name, age, gender, district, annualIncome, casteCategory, occupation, propertyOwned, familySize } = body;

  if (!name || typeof name !== "string")                              errors.push("name is required");
  if (age === undefined || isNaN(age) || age < 1 || age > 120)       errors.push("age must be a number between 1 and 120");
  if (!["Male", "Female", "Other"].includes(gender))                 errors.push("gender must be Male, Female, or Other");
  if (!district || !KARNATAKA_DISTRICTS.includes(district))          errors.push("district must be one of Karnataka's 31 districts");
  if (annualIncome === undefined || isNaN(annualIncome) || annualIncome < 0) errors.push("annualIncome must be a non-negative number");
  if (!["General", "OBC", "SC", "ST"].includes(casteCategory))       errors.push("casteCategory must be General, OBC, SC, or ST");
  if (!["Farmer", "Salaried", "Self-employed", "Unemployed"].includes(occupation)) errors.push("occupation must be Farmer, Salaried, Self-employed, or Unemployed");
  if (typeof propertyOwned !== "boolean")                            errors.push("propertyOwned must be true or false");
  if (familySize === undefined || isNaN(familySize) || familySize < 1) errors.push("familySize must be a positive number");

  return errors;
}

// ─────────────────────────────────────────────────────────────
// SHARED HELPER — runs the engine, returns { eligible, nearMisses }
// ─────────────────────────────────────────────────────────────

function runEngine(user) {
  const eligible = [], nearMisses = [];

  for (const scheme of SCHEMES) {
    const result = scheme.check(user);
    if (result.eligible) {
      eligible.push({
        id: scheme.id,
        name: scheme.name,
        category: scheme.category,
        description: scheme.description,
        matchedCriteria: result.matchedCriteria,
        documents: scheme.docs,
        applyLink: scheme.applyLink,
        office: scheme.office,
      });
    } else if (result.missedCriteria.length === 1) {
      nearMisses.push({
        id: scheme.id,
        name: scheme.name,
        category: scheme.category,
        matchedCriteria: result.matchedCriteria,
        toQualify: result.missedCriteria[0],
      });
    }
  }
  return { eligible, nearMisses };
}

// ─────────────────────────────────────────────────────────────
// SHARED HELPER — parses + casts req.body
// ─────────────────────────────────────────────────────────────

function parseUser(body) {
  return {
    ...body,
    age: Number(body.age),
    annualIncome: Number(body.annualIncome),
    familySize: Number(body.familySize),
    isWidow: body.isWidow ?? false,
    isDisabled: body.isDisabled ?? false,
    isPrimaryEarnerDeceased: body.isPrimaryEarnerDeceased ?? false,
    primaryEarnerAgeAtDeath: body.primaryEarnerAgeAtDeath ? Number(body.primaryEarnerAgeAtDeath) : null,
  };
}

// ─────────────────────────────────────────────────────────────
// POST /api/schemes/check  →  JSON response
// ─────────────────────────────────────────────────────────────

router.post("/check", (req, res) => {
  const errors = validateInput(req.body);
  if (errors.length > 0) return res.status(400).json({ success: false, errors });

  const user = parseUser(req.body);
  const { eligible, nearMisses } = runEngine(user);

  return res.status(200).json({
    success: true,
    applicant: { name: user.name, age: user.age, district: user.district },
    summary: {
      totalChecked: SCHEMES.length,
      totalEligible: eligible.length,
      totalNearMisses: nearMisses.length,
    },
    eligibleSchemes: eligible,
    nearMisses,
  });
});

// ─────────────────────────────────────────────────────────────
// POST /api/schemes/report  →  PDF download
// ─────────────────────────────────────────────────────────────

router.post("/report", (req, res) => {
  const errors = validateInput(req.body);
  if (errors.length > 0) return res.status(400).json({ success: false, errors });

  const user = parseUser(req.body);
  const { eligible, nearMisses } = runEngine(user);

  const reportData = {
    applicant: { name: user.name, age: user.age, district: user.district },
    summary: {
      totalChecked: SCHEMES.length,
      totalEligible: eligible.length,
      totalNearMisses: nearMisses.length,
    },
    eligibleSchemes: eligible,
    nearMisses,
  };
  try {
    generateSchemesPDF(reportData, res);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, error: "Failed to generate PDF" });
  }
});

module.exports = { router, SCHEMES };