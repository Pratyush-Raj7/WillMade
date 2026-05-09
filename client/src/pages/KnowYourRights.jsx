import React, { useState } from 'react'

const tree = {
  start: {
    question: 'Who are you?',
    subtitle: 'Select your role to get personalized legal guidance',
    options: [
      { label: 'I am a Tenant', emoji: '🏠', next: 'tenant', color: '#3B82F6' },
      { label: 'I am a Property Owner', emoji: '🏡', next: 'owner', color: '#8B5CF6' },
      { label: 'I am a Farmer', emoji: '🌾', next: 'farmer', color: '#10B981' },
      { label: 'I am a General Citizen', emoji: '👤', next: 'citizen', color: '#F59E0B' },
    ]
  },
  tenant: {
    question: 'What is your situation?',
    subtitle: 'Choose the issue that best describes your problem',
    options: [
      { label: 'Landlord cut water/electricity', emoji: '💧', next: 'utility_cut', color: '#EF4444' },
      { label: 'Deposit not returned', emoji: '💰', next: 'deposit', color: '#F59E0B' },
      { label: 'Forced eviction / no notice', emoji: '🚪', next: 'eviction', color: '#EF4444' },
      { label: 'Illegal rent increase', emoji: '📈', next: 'rent_hike', color: '#F59E0B' },
    ]
  },
  owner: {
    question: 'What do you need help with?',
    subtitle: 'Select the area where you need legal assistance',
    options: [
      { label: 'Write a Will', emoji: '📝', next: 'will', color: '#8B5CF6' },
      { label: 'Property dispute with family', emoji: '⚖️', next: 'dispute', color: '#EF4444' },
      { label: 'Want to sell property', emoji: '🏠', next: 'sell', color: '#10B981' },
    ]
  },
  farmer: {
    question: 'What do you need help with?',
    subtitle: 'Select the area where you need legal assistance',
    options: [
      { label: 'Check PM Kisan eligibility', emoji: '🌾', next: 'pmkisan', color: '#10B981' },
      { label: 'Land record dispute', emoji: '📋', next: 'land_dispute', color: '#F59E0B' },
      { label: 'Government land acquisition', emoji: '🏗️', next: 'acquisition', color: '#EF4444' },
    ]
  },
  citizen: {
    question: 'What do you need help with?',
    subtitle: 'Select the area where you need legal assistance',
    options: [
      { label: 'Scheme application rejected', emoji: '❌', next: 'rejected', color: '#EF4444' },
      { label: 'Find schemes I qualify for', emoji: '🔍', next: 'find_schemes', color: '#3B82F6' },
      { label: 'Need free legal help', emoji: '⚖️', next: 'free_legal', color: '#10B981' },
    ]
  },
  utility_cut: {
    action: true,
    title: 'Landlord Cut Water / Electricity',
    urgency: 'HIGH',
    right: 'Under Karnataka Rent Control Act, landlords cannot cut essential services like water or electricity to force eviction. This is illegal and punishable.',
    steps: [
      'Document everything with photos/videos and note the date and time',
      'Send a written notice (WhatsApp + registered post) to your landlord',
      'File a complaint at the local police station under IPC Section 503',
      'Approach the Rent Control Court in your district for urgent relief',
    ],
    contacts: ['BESCOM Helpline: 1912', 'Police Emergency: 100', 'Consumer Helpline: 1800-11-4000']
  },
  deposit: {
    action: true,
    title: 'Security Deposit Not Returned',
    urgency: 'MEDIUM',
    right: 'Your landlord must return the security deposit within 30 days of vacating. Withholding it without valid reason is illegal.',
    steps: [
      'Send a formal written demand notice via registered post',
      'Keep all receipts, rent agreements and move-out proof',
      'File a case in Consumer Forum or Civil Court for recovery',
      'Claim interest on delayed return as well',
    ],
    contacts: ['Legal Aid: 15100', 'Consumer Helpline: 1800-11-4000']
  },
  eviction: {
    action: true,
    title: 'Forced Eviction / No Notice',
    urgency: 'HIGH',
    right: 'No landlord can evict a tenant without a minimum 1-month written notice and valid legal grounds under Karnataka Rent Control Act.',
    steps: [
      'Do NOT vacate under pressure — you have legal protection',
      'Document all threats, calls, or messages from the landlord',
      'File a complaint at the local police station immediately',
      'Approach Rent Control Court for a stay order',
    ],
    contacts: ['Police Emergency: 100', 'Legal Aid: 15100', 'Rent Control Court: Visit district court']
  },
  rent_hike: {
    action: true,
    title: 'Illegal Rent Increase',
    urgency: 'MEDIUM',
    right: 'Rent increases must follow the agreed escalation clause in the rental agreement. Any hike beyond 10% per year without prior notice is challengeable.',
    steps: [
      'Review your rental agreement for the escalation clause',
      'Send a written objection to the landlord',
      'File a petition in the Rent Control Court',
      'Withhold only the excess amount, pay agreed rent on time',
    ],
    contacts: ['Legal Aid: 15100', 'Rent Control Court: Visit district court']
  },
}

const urgencyConfig = {
  HIGH:   { bg: '#FEE2E2', border: '#FCA5A5', text: '#DC2626', icon: '🔴', label: 'High Urgency — Act within 48 hours' },
  MEDIUM: { bg: '#FEF3C7', border: '#FCD34D', text: '#D97706', icon: '🟡', label: 'Medium Urgency — Act within 1 week' },
  LOW:    { bg: '#D1FAE5', border: '#6EE7B7', text: '#065F46', icon: '🟢', label: 'Low Urgency — Plan your next steps' },
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
    padding: '40px 16px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    maxWidth: '680px',
    margin: '0 auto',
    background: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.10)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #1E3A5F 0%, #2D5F8A 100%)',
    padding: '32px 36px',
    color: '#fff',
  },
  headerTitle: {
    fontSize: '26px',
    fontWeight: '700',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  headerSub: {
    fontSize: '13px',
    opacity: 0.75,
    marginTop: '4px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '16px',
    flexWrap: 'wrap',
  },
  crumb: {
    fontSize: '11px',
    background: 'rgba(255,255,255,0.15)',
    padding: '3px 10px',
    borderRadius: '20px',
    color: '#fff',
  },
  crumbArrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '11px',
  },
  body: {
    padding: '32px 36px',
  },
  question: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E3A5F',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '24px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  optionBtn: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#F9FAFB',
    border: `2px solid #E5E7EB`,
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1F2937',
  }),
  optionEmoji: (color) => ({
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  }),
  urgencyBadge: (urgency) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: urgencyConfig[urgency]?.bg,
    border: `1px solid ${urgencyConfig[urgency]?.border}`,
    borderRadius: '10px',
    color: urgencyConfig[urgency]?.text,
    fontWeight: '600',
    fontSize: '13px',
    marginBottom: '20px',
  }),
  rightBox: {
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#1E40AF',
    lineHeight: '1.6',
  },
  rightBoxTitle: {
    fontWeight: '700',
    marginBottom: '6px',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#1D4ED8',
  },
  stepsTitle: {
    fontWeight: '700',
    fontSize: '15px',
    color: '#1E3A5F',
    marginBottom: '12px',
  },
  step: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
  },
  stepNum: {
    minWidth: '26px',
    height: '26px',
    borderRadius: '50%',
    background: '#1E3A5F',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '1px',
  },
  contactsBox: {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    padding: '16px',
    marginTop: '20px',
  },
  contactsTitle: {
    fontWeight: '700',
    fontSize: '13px',
    color: '#374151',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contact: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#1E3A5F',
    fontWeight: '500',
    marginBottom: '6px',
  },
  footer: {
    display: 'flex',
    gap: '10px',
    marginTop: '28px',
    flexWrap: 'wrap',
  },
  btnBack: {
    padding: '10px 20px',
    background: '#F3F4F6',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  btnRestart: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
  },
  btnLegal: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #1E3A5F, #2D5F8A)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
}

const KnowYourRights = () => {
  const [history, setHistory] = useState(['start'])
  const [hovered, setHovered] = useState(null)
  const current = tree[history[history.length - 1]]

  const goTo = (next) => {
    if (tree[next]) setHistory([...history, next])
  }
  const goBack = () => history.length > 1 && setHistory(history.slice(0, -1))
  const restart = () => setHistory(['start'])

  // Build breadcrumb labels
  const crumbLabels = { start: 'Home', tenant: 'Tenant', owner: 'Owner', farmer: 'Farmer', citizen: 'Citizen' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* ── HEADER ── */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>⚖️ Know Your Rights</h1>
          <p style={styles.headerSub}>Free legal guidance for Karnataka residents</p>

          {/* Breadcrumb */}
          <div style={styles.breadcrumb}>
            {history.map((key, i) => (
              <React.Fragment key={i}>
                <span style={styles.crumb}>
                  {crumbLabels[key] || tree[key]?.title || key.replace(/_/g, ' ')}
                </span>
                {i < history.length - 1 && <span style={styles.crumbArrow}>›</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={styles.body}>

          {!current?.action ? (
            <>
              <h2 style={styles.question}>{current?.question}</h2>
              <p style={styles.subtitle}>{current?.subtitle}</p>

              <div style={styles.optionsGrid}>
                {current?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(opt.next)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      ...styles.optionBtn(opt.color),
                      borderColor: hovered === i ? opt.color : '#E5E7EB',
                      background: hovered === i ? `${opt.color}08` : '#F9FAFB',
                      transform: hovered === i ? 'translateY(-2px)' : 'none',
                      boxShadow: hovered === i ? `0 4px 12px ${opt.color}30` : 'none',
                    }}
                  >
                    <span style={styles.optionEmoji(opt.color)}>{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

              {history.length > 1 && (
                <div style={styles.footer}>
                  <button style={styles.btnBack} onClick={goBack}>← Back</button>
                  <button style={styles.btnRestart} onClick={restart}>↺ Restart</button>
                </div>
              )}
            </>

          ) : (
            <>
              {/* Urgency badge */}
              <div style={styles.urgencyBadge(current.urgency)}>
                <span>{urgencyConfig[current.urgency]?.icon}</span>
                <span>{urgencyConfig[current.urgency]?.label}</span>
              </div>

              {/* Your right */}
              <div style={styles.rightBox}>
                <div style={styles.rightBoxTitle}>📌 Your Legal Right</div>
                {current.right}
              </div>

              {/* Steps */}
              <div style={styles.stepsTitle}>✅ Steps to Take</div>
              {current.steps.map((step, i) => (
                <div key={i} style={styles.step}>
                  <span style={styles.stepNum}>{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}

              {/* Contacts */}
              <div style={styles.contactsBox}>
                <div style={styles.contactsTitle}>📞 Important Contacts</div>
                {current.contacts.map((c, i) => (
                  <div key={i} style={styles.contact}>
                    <span>•</span> {c}
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div style={styles.footer}>
                <button style={styles.btnBack} onClick={goBack}>← Back</button>
                <button style={styles.btnRestart} onClick={restart}>↺ Restart</button>
                <a
                  href="https://nalsa.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.btnLegal}
                >
                  🏛️ Get Free Legal Help
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowYourRights