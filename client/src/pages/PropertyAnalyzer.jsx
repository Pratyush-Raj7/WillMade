import React, { useState, useEffect } from 'react'
import API from '../utils/api'

const PropertyAnalyzer = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]

    if (!selected) return

    if (!selected.type.startsWith('image/')) {
      setError('Only image files (JPG/PNG) are allowed')
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setFile(selected)
    setError(null)

    const objectUrl = URL.createObjectURL(selected)
    setPreview(objectUrl)
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const analyze = async () => {
    if (!file) {
      setError('Please upload a property document image')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await API.post('/analyze-property', formData, { // ✅ fixed
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setResult(response.data?.data || response.data)

    } catch (err) {
      console.error(err)
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

  const getStatusIcon = (status) => {
    if (status === 'present' || status === 'passed') return '✅'
    if (status === 'warning') return '⚠️'
    if (status === 'missing' || status === 'critical') return '🚨'
    return '❓'
  }

  return (
    <div style={{maxWidth: '896px', margin: '0 auto', padding: '48px 24px'}}>

      {/* Header */}
      <div style={{marginBottom: '32px'}}>
        <h1 style={{color: '#1A3C6E', fontSize: '1.75rem', fontWeight: 'bold'}}>
          📄 Property Document Analyzer
        </h1>
        <p style={{color: '#6B7280', marginTop: '8px'}}>
          Upload your property document for fraud detection and completeness check
        </p>
      </div>

      {/* Upload */}
      <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px'}}>
        <label style={{fontWeight: '600', color: '#1A3C6E', display: 'block', marginBottom: '12px'}}>
          Upload Property Document (JPG or PNG)
        </label>

        <div
          style={{border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#F9FAFB'}}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{maxHeight: '200px', borderRadius: '6px'}} />
          ) : (
            <div>
              <p style={{fontSize: '2rem'}}>📁</p>
              <p style={{color: '#6B7280'}}>Click to upload JPG or PNG (Max 5MB)</p>
            </div>
          )}
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{display: 'none'}}
        />

        {file && (
          <p style={{color: '#1B7A3E', marginTop: '8px', fontSize: '14px'}}>
            ✅ {file.name}
          </p>
        )}

        <button
          onClick={analyze}
          disabled={loading || !file}
          style={{
            marginTop: '16px',
            backgroundColor: loading || !file ? '#9CA3AF' : '#1A3C6E',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '6px',
            fontWeight: '600',
            border: 'none',
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            fontSize: '15px'
          }}
        >
          {loading ? 'Analyzing...' : '🔍 Analyze Document'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#DC2626'}}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: '16px'}}>🔍</div>
          <p style={{color: '#1A3C6E', fontWeight: '600'}}>Analyzing your document...</p>
          <p style={{color: '#6B7280', fontSize: '14px', marginTop: '8px'}}>Checking for fraud, completeness and scheme eligibility</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>

          {/* Score Card */}
          <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px', textAlign: 'center'}}>
            <h2 style={{color: '#1A3C6E', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '8px'}}>
              Document Health Score
            </h2>
            <p style={{color: '#6B7280', fontSize: '14px', marginBottom: '16px'}}>
              {result.document_type} — {result.summary}
            </p>
            <div style={{fontSize: '4rem', fontWeight: 'bold', color: getScoreColor(result.health_score)}}>
              {result.health_score}
            </div>
            <div style={{color: '#6B7280', marginBottom: '16px'}}>/100</div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
              <div style={{backgroundColor: '#D1FAE5', color: '#1B7A3E', padding: '8px 16px', borderRadius: '999px', fontWeight: '600', fontSize: '14px'}}>
                ✅ Passed: {result.passed_count}
              </div>
              <div style={{backgroundColor: '#FEF3C7', color: '#F59E0B', padding: '8px 16px', borderRadius: '999px', fontWeight: '600', fontSize: '14px'}}>
                ⚠️ Warnings: {result.warning_count}
              </div>
              <div style={{backgroundColor: '#FEE2E2', color: '#DC2626', padding: '8px 16px', borderRadius: '999px', fontWeight: '600', fontSize: '14px'}}>
                🚨 Critical: {result.critical_count}
              </div>
            </div>
          </div>

          {/* Extracted Details */}
          {result.extracted_details && (
            <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{color: '#1A3C6E', fontWeight: 'bold', marginBottom: '16px'}}>📋 Extracted Details</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {Object.entries(result.extracted_details).map(([key, value]) => (
                  typeof value !== 'object' && (
                    <div key={key} style={{borderBottom: '1px solid #F3F4F6', paddingBottom: '8px'}}>
                      <span style={{color: '#6B7280', fontSize: '12px', textTransform: 'uppercase'}}>{key.replace(/_/g, ' ')}</span>
                      <p style={{color: '#1A1A1A', fontSize: '14px', fontWeight: '500'}}>{value || 'Not found'}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Completeness Checks */}
          {result.completeness_checks && (
            <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{color: '#1A3C6E', fontWeight: 'bold', marginBottom: '16px'}}>📝 Completeness Checks</h3>
              {result.completeness_checks.map((check, i) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6'}}>
                  <span style={{color: '#333', fontSize: '14px'}}>{check.item}</span>
                  <div style={{textAlign: 'right'}}>
                    <span>{getStatusIcon(check.status)}</span>
                    <span style={{color: '#6B7280', fontSize: '13px', marginLeft: '8px'}}>{check.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fraud Flags */}
          {result.fraud_flags && (
            <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{color: '#1A3C6E', fontWeight: 'bold', marginBottom: '16px'}}>🔍 Fraud Detection</h3>
              {result.fraud_flags.map((flag, i) => (
                <div key={i} style={{
                  borderLeft: `4px solid ${flag.status === 'passed' ? '#1B7A3E' : flag.status === 'warning' ? '#F59E0B' : '#DC2626'}`,
                  padding: '10px 16px',
                  marginBottom: '8px',
                  backgroundColor: flag.status === 'passed' ? '#F0FDF4' : flag.status === 'warning' ? '#FFFBEB' : '#FEF2F2',
                  borderRadius: '6px'
                }}>
                  <strong style={{fontSize: '14px'}}>{flag.check}</strong>
                  <p style={{color: '#4B5563', fontSize: '13px', marginTop: '4px'}}>{flag.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Scheme Hints */}
          {result.scheme_hints && result.scheme_hints.length > 0 && (
            <div style={{backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{color: '#1A3C6E', fontWeight: 'bold', marginBottom: '16px'}}>🏛️ Scheme Eligibility Hints</h3>
              {result.scheme_hints.map((hint, i) => (
                <div key={i} style={{marginBottom: '8px'}}>
                  <strong style={{fontSize: '14px'}}>{hint.scheme}</strong>
                  <span style={{
                    marginLeft: '8px',
                    backgroundColor: hint.hint === 'eligible' ? '#D1FAE5' : '#FEF3C7',
                    color: hint.hint === 'eligible' ? '#1B7A3E' : '#92400E',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '12px'
                  }}>{hint.hint}</span>
                  <p style={{color: '#6B7280', fontSize: '13px', marginTop: '4px'}}>{hint.reason}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default PropertyAnalyzer