const { SCHEMES } = require("./routes/schemes");

// Dummy user (you can change values to test different cases)
const user = {
  district: "Raichur",
  annualIncome: 90000,
  propertyOwned: false,
  casteCategory: "SC",
  occupation: "Farmer",
  age: 40,
  gender: "Male",
  familySize: 4,
  isWidow: false,
  isDisabled: false,
  isPrimaryEarnerDeceased: false
};

console.log("🔍 Testing Scheme Engine...\n");

SCHEMES.forEach((scheme, index) => {
  const result = scheme.check(user);

  console.log(`\n${index + 1}. ${scheme.name}`);
  console.log("Eligible:", result.eligible ? "✅ YES" : "❌ NO");

  console.log("Matched Criteria:");
  result.matchedCriteria.forEach(c => console.log("  ✔", c));

  if (result.missedCriteria.length > 0) {
    console.log("Missed Criteria:");
    result.missedCriteria.forEach(c => console.log("  ❌", c));
  }
});