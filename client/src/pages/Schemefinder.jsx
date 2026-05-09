import React, { useState } from 'react'
import API from '../utils/api'

const SchemeFinder = () => {
  const [form, setForm] = useState({
    name: 'Applicant',
    age: '',
    gender: 'Male',
    annualIncome: '',
    casteCategory: 'General',
    district: 'Bengaluru Urban',
    occupation: 'Farmer',
    propertyOwned: false,
    familySize: 4,
    isWidow: false,
    isDisabled: false,
    isPrimaryEarnerDeceased: false,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const districts = [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
    'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
    'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
    'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Vijayanagara'
  ]

  const handleChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm({ ...form, [name]: e.target.checked })
    } else if (name === 'propertyOwned') {
      setForm({ ...form, propertyOwned: value === 'Yes' })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const findSchemes = async () => {
    if (!form.age || !form.annualIncome) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        annualIncome: Number(form.annualIncome),
        familySize: Number(form.familySize),
      }

      const response = await API.post('/schemes/check', payload)
      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.errors?.join(', ') || 'Failed to fetch schemes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1A3C6E', fontSize: '1.75rem', fontWeight: 'bold' }}>
          🏛️ Government Scheme Finder
        </h1>
        <p style={{ color: '#6B7280', marginTop: '8px' }}>
          Find all Karnataka government schemes you qualify for
        </p>
      </div>

      {/* Form */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>

          {/* Name */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>

          {/* Age */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>

          {/* Gender */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Annual Income */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Annual Income (₹)</label>
            <input
              type="number"
              name="annualIncome"
              value={form.annualIncome}
              onChange={handleChange}
              placeholder="Enter annual income"
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>

          {/* Caste Category */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Caste Category</label>
            <select name="casteCategory" value={form.casteCategory} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>District</label>
            <select name="district" value={form.district} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Occupation</label>
            <select name="occupation" value={form.occupation} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              <option>Farmer</option>
              <option>Salaried</option>
              <option>Self-employed</option>
              <option>Unemployed</option>
            </select>
          </div>

          {/* Family Size */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Family Size</label>
            <input
              type="number"
              name="familySize"
              value={form.familySize}
              onChange={handleChange}
              placeholder="Number of family members"
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>

          {/* Property Owned */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Do you own a house?</label>
            <select name="propertyOwned" value={form.propertyOwned ? 'Yes' : 'No'} onChange={handleChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {/* Is Widow */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Are you a widow?</label>
            <select name="isWidow" value={form.isWidow ? 'Yes' : 'No'} onChange={(e) => setForm({...form, isWidow: e.target.value === 'Yes'})}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {/* Is Disabled */}
          <div>
            <label style={{ fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '6px' }}>Do you have a disability?</label>
            <select name="isDisabled" value={form.isDisabled ? 'Yes' : 'No'} onChange={(e) => setForm({...form, isDisabled: e.target.value === 'Yes'})}
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

        </div>

        <button
          onClick={findSchemes}
          disabled={loading}
          style={{
            marginTop: '24px',
            backgroundColor: loading ? '#9CA3AF' : '#1A3C6E',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '6px',
            fontWeight: '600',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            width: '100%',
          }}
        >
          {loading ? 'Finding Schemes...' : '🔍 Find My Schemes'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#DC2626' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <h2 style={{ color: '#1B7A3E', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '16px' }}>
            ✅ You qualify for {result.summary?.totalEligible || 0} schemes!
          </h2>

          {result.eligibleSchemes?.map((scheme, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #1B7A3E' }}>
              <h3 style={{ color: '#1A3C6E', fontWeight: 'bold', fontSize: '1.125rem' }}>{scheme.name}</h3>
              <p style={{ color: '#4B5563', fontSize: '14px', marginTop: '8px' }}>{scheme.description}</p>

              <div style={{ backgroundColor: '#D1FAE5', borderRadius: '6px', padding: '10px', marginTop: '12px' }}>
                <strong style={{ color: '#1B7A3E' }}>Why you qualify: </strong>
                {scheme.matchedCriteria?.map((c, j) => (
                  <span key={j} style={{ color: '#1B7A3E', fontSize: '13px', display: 'block' }}>✔ {c}</span>
                ))}
              </div>

              <div style={{ marginTop: '12px' }}>
                <strong style={{ color: '#1A3C6E', fontSize: '14px' }}>Documents Needed:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {scheme.documents?.map((doc, j) => (
                    <li key={j} style={{ color: '#4B5563', fontSize: '13px', marginBottom: '4px' }}>📄 {doc}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <a href={scheme.applyLink} target="_blank" rel="noreferrer"
                  style={{ backgroundColor: '#FF6B00', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                  Apply Now →
                </a>
                <span style={{ color: '#6B7280', fontSize: '13px', alignSelf: 'center' }}>🏛️ {scheme.office}</span>
              </div>
            </div>
          ))}

          {/* Near Misses */}
          {result.nearMisses?.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ color: '#F59E0B', fontWeight: 'bold', marginBottom: '12px' }}>⚠️ Schemes You Narrowly Missed</h3>
              {result.nearMisses?.map((scheme, i) => (
                <div key={i} style={{ backgroundColor: '#FFFBEB', borderRadius: '8px', padding: '16px', marginBottom: '12px', borderLeft: '4px solid #F59E0B' }}>
                  <h4 style={{ color: '#1A3C6E', fontWeight: '600' }}>{scheme.name}</h4>
                  <p style={{ color: '#F59E0B', fontSize: '13px', marginTop: '4px' }}>❌ {scheme.toQualify}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '16px', marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>
              ⚖️ This is legal information, not legal advice. Visit the respective offices to confirm eligibility.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchemeFinder