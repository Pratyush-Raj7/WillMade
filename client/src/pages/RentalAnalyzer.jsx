import React, { useState } from 'react'
import API from '../utils/api'

const RentalAnalyzer = () => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyze = async () => {
    if (text.trim().length < 100) {
      setError('Please paste a complete rental agreement (minimum 100 characters)')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await API.post('/analyze-rental/text', {
        text,
        language: 'english',
      })
      setResult(response.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#1B7A3E'
    if (score >= 40) return '#F59E0B'
    return '#DC2626'
  }

  const getRiskLabel = (score) => {
    if (score >= 70) return 'LOW RISK ✅'
    if (score >= 40) return 'MEDIUM RISK ⚠️'
    return 'HIGH RISK 🔴'
  }

  return (
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1A3C6E', fontSize: '1.75rem', fontWeight: 'bold' }}>
          🏠 Rental Agreement Analyzer
        </h1>
        <p style={{ color: '#6B7280', marginTop: '8px' }}>
          Analyzed under Karnataka Rent Act 1999
        </p>
      </div>

      {/* Input Section */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <label
          style={{
            fontWeight: '600',
            color: '#1A3C6E',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          Paste Your Rental Agreement Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your rental agreement here..."
          style={{
            width: '100%',
            height: '200px',
            padding: '12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
          }}
        >
          <span style={{ color: '#9CA3AF', fontSize: '13px' }}>
            {text.length} characters
          </span>
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9CA3AF' : '#1A3C6E',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '6px',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px',
            }}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Agreement'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#DC2626',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚖️</div>
          <p style={{ color: '#1A3C6E', fontWeight: '600' }}>
            Analyzing your agreement...
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
            Checking against Karnataka Rent Act 1999
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          {/* Score Card */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: '#1A3C6E',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                marginBottom: '16px',
              }}
            >
              Agreement Risk Score
            </h2>
            <div
              style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: getScoreColor(result.overall_score),
              }}
            >
              {result.overall_score}
            </div>
            <div
              style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '8px' }}
            >
              /100
            </div>
            <div
              style={{
                color: getScoreColor(result.overall_score),
                fontWeight: '600',
                fontSize: '1.125rem',
                marginBottom: '16px',
              }}
            >
              {getRiskLabel(result.overall_score)}
            </div>
            <p style={{ color: '#4B5563', fontSize: '14px', marginBottom: '24px' }}>
              {result.summary}
            </p>

            {/* Counts */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                🔴 Critical: {result.critical_count}
              </div>
              <div
                style={{
                  backgroundColor: '#FEF3C7',
                  color: '#F59E0B',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                🟡 Warning: {result.warning_count}
              </div>
              <div
                style={{
                  backgroundColor: '#D1FAE5',
                  color: '#1B7A3E',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                🟢 Safe: {result.safe_count}
              </div>
            </div>
          </div>

          {/* Clause Breakdown */}
          <h3
            style={{
              color: '#1A3C6E',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              marginBottom: '16px',
            }}
          >
            Clause by Clause Breakdown
          </h3>
          {Array.isArray(result.clauses) &&
            result.clauses.map((clause, i) => <ClauseCard key={i} clause={clause} />)}

          {/* Footer Actions */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              padding: '24px',
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <a
              href="https://nalsa.gov.in"
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: '#1B7A3E',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            >
              📞 Get Free Legal Help — NALSA (15100)
            </a>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>
              ⚖️ This is legal information, not legal advice. Consult a lawyer for
              your specific situation.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const ClauseCard = ({ clause }) => {
  const [expanded, setExpanded] = useState(false)

  const colors = {
    critical: { border: '#DC2626', bg: '#FEF2F2', badge: '#FEE2E2', text: '#DC2626' },
    warning: { border: '#F59E0B', bg: '#FFFBEB', badge: '#FEF3C7', text: '#F59E0B' },
    safe: { border: '#1B7A3E', bg: '#F0FDF4', badge: '#D1FAE5', text: '#1B7A3E' },
  }

  const c = colors[clause.risk_level] || colors.safe

  return (
    <div
      style={{
        backgroundColor: c.bg,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <span
            style={{
              backgroundColor: c.badge,
              color: c.text,
              padding: '2px 10px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '600',
              marginRight: '8px',
              textTransform: 'uppercase',
            }}
          >
            {clause.risk_level}
          </span>
          <span style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '500' }}>
            {clause.clause_text?.substring(0, 80)}...
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            fontSize: '18px',
            marginLeft: '8px',
          }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ color: '#1A1A1A', fontSize: '14px', marginBottom: '8px' }}>
            <strong>Full Clause:</strong> {clause.clause_text}
          </p>
          <p style={{ color: '#4B5563', fontSize: '14px', marginBottom: '8px' }}>
            <strong>Explanation:</strong> {clause.explanation}
          </p>
          {clause.karnataka_law && (
            <p style={{ color: '#1A3C6E', fontSize: '13px', marginBottom: '8px' }}>
              📋 <strong>Law:</strong> {clause.karnataka_law}
            </p>
          )}
          {clause.fair_version && (
            <div
              style={{
                backgroundColor: '#D1FAE5',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#1B7A3E',
              }}
            >
              ✅ <strong>Fair Version:</strong> {clause.fair_version}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RentalAnalyzer