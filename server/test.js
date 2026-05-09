// test.js — add these to your existing test file

const axios = require("axios");
const BASE = "http://localhost:5000/api/schemes/check";

async function run(label, payload) {
  try {
    const { data } = await axios.post(BASE, payload);
    console.log(`\n✅ [${label}]`);
    console.log(`   Eligible for ${data.summary.totalEligible} scheme(s): ${data.eligibleSchemes.map(s => s.name).join(", ") || "None"}`);
    console.log(`   Near misses: ${data.nearMisses.map(s => `${s.name} → ${s.toQualify}`).join(" | ") || "None"}`);
  } catch (err) {
    console.error(`\n❌ [${label}] Error:`, err.response?.data || err.message);
  }
}

(async () => {
  // Case 1: SC farmer, no land — should miss PM Kisan, qualify for RGHC + others
  await run("SC Farmer No Land", {
    name: "Raju", age: 40, gender: "Male",
    district: "Raichur", annualIncome: 90000,
    casteCategory: "SC", occupation: "Farmer",
    propertyOwned: false, familySize: 4,
  });

  // Case 2: 62-year-old widow, BPL — should get Sandhya Suraksha + Widow Pension + Ashraya
  await run("62yo Widow BPL", {
    name: "Lakshmi", age: 62, gender: "Female",
    district: "Mysuru", annualIncome: 80000,
    casteCategory: "General", occupation: "Unemployed",
    propertyOwned: false, familySize: 2,
    isWidow: true,
  });

  // Case 3: Urban salaried, 7LPA — should qualify only PMAY Urban MIG-I
  await run("Urban Salaried 7LPA", {
    name: "Anil", age: 35, gender: "Male",
    district: "Bengaluru Urban", annualIncome: 700000,
    casteCategory: "General", occupation: "Salaried",
    propertyOwned: false, familySize: 3,
  });

  // Case 4: General, 5LPA, owns property — should miss all housing schemes
  await run("General with Property 5LPA", {
    name: "Suresh", age: 45, gender: "Male",
    district: "Dharwad", annualIncome: 500000,
    casteCategory: "General", occupation: "Salaried",
    propertyOwned: true, familySize: 4,
  });

  // Case 5: Disabled BPL person — should get Disability Pension + Ration Card
  await run("Disabled BPL", {
    name: "Kavitha", age: 30, gender: "Female",
    district: "Vijayapura", annualIncome: 60000,
    casteCategory: "OBC", occupation: "Unemployed",
    propertyOwned: false, familySize: 3,
    isDisabled: true,
  });

  // Case 6: NFBS — BPL family, breadwinner died aged 45
  await run("NFBS Eligible Family", {
    name: "Meena", age: 38, gender: "Female",
    district: "Kalaburagi", annualIncome: 100000,
    casteCategory: "ST", occupation: "Unemployed",
    propertyOwned: false, familySize: 5,
    isPrimaryEarnerDeceased: true, primaryEarnerAgeAtDeath: 45,
  });

  // Case 7: Bad input — should return 400
  await run("Invalid Input (missing fields)", {
    name: "Test", age: -5, gender: "Unknown",
    district: "Mars", annualIncome: -100,
  });
})();