import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const features = [
  {
    icon: '🏠',
    titleKey: 'nav.rental',
    description: 'Upload your rental agreement and instantly identify illegal clauses under Karnataka Rent Act 1999.',
    path: '/rental',
    borderColor: '#3B82F6'
  },
  {
    icon: '🏛️',
    titleKey: 'nav.schemes',
    description: 'Find all Karnataka government schemes you qualify for based on your profile.',
    path: '/schemes',
    borderColor: '#FF6B00'
  },
  {
    icon: '⚖️',
    titleKey: 'nav.rights',
    description: 'Step-by-step legal action plans for tenants, farmers, and citizens.',
    path: '/rights',
    borderColor: '#1B7A3E'
  },
  {
    icon: '📄',
    titleKey: 'nav.property',
    description: 'Analyze property documents for fraud, missing details, and scheme eligibility.',
    path: '/property',
    borderColor: '#7C3AED'
  },
]

const stats = [
  { number: '70%', label: 'Families have no valid will' },
  { number: '1 in 3', label: 'Tenants sign unfair agreements' },
  { number: '₹10,000', label: 'Avg lawyer fee saved per family' },
]

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <div style={{backgroundColor: '#1A3C6E', color: 'white', padding: '64px 24px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', textAlign: 'center'}}>
          <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px'}}>
            {t('home.hero')}
          </h1>
          <p style={{color: '#93C5FD', fontSize: '1.125rem', marginBottom: '32px'}}>
            {t('home.subhero')}
          </p>
          <button
            onClick={() => navigate('/rights')}
            style={{
              backgroundColor: '#FF6B00',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '6px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {t('home.cta')} →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '24px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center'}}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{color: '#1A3C6E', fontSize: '1.875rem', fontWeight: 'bold'}}>{stat.number}</div>
              <div style={{color: '#6B7280', fontSize: '0.875rem', marginTop: '4px'}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{maxWidth: '1024px', margin: '0 auto', padding: '48px 24px'}}>
        <h2 style={{color: '#1A3C6E', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px'}}>
          How Can We Help You Today?
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
          {features.map((feature, i) => (
            <div
              key={i}
              onClick={() => navigate(feature.path)}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '24px',
                borderLeft: `4px solid ${feature.borderColor}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
            >
              <div style={{fontSize: '2.5rem', marginBottom: '12px'}}>{feature.icon}</div>
              <h3 style={{color: '#1A3C6E', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '8px'}}>
                {t(feature.titleKey)}
              </h3>
              <p style={{color: '#4B5563', fontSize: '0.875rem'}}>{feature.description}</p>
              <div style={{color: '#FF6B00', fontWeight: '500', fontSize: '0.875rem', marginTop: '16px'}}>
                Get Started →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Aid Banner */}
      <div style={{backgroundColor: '#EFF6FF', borderTop: '1px solid #DBEAFE', padding: '32px 24px'}}>
        <div style={{maxWidth: '896px', margin: '0 auto', textAlign: 'center'}}>
          <h3 style={{color: '#1A3C6E', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '8px'}}>
            Need More Help?
          </h3>
          <p style={{color: '#4B5563', fontSize: '0.875rem', marginBottom: '16px'}}>
            Our tool provides guidance but cannot replace a lawyer.
            Free legal aid is available for all Karnataka residents.
          </p>
          <div style={{display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap'}}>
            <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '12px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', textAlign: 'center'}}>
              <div style={{fontWeight: 'bold', color: '#1A3C6E'}}>NALSA Helpline</div>
              <div style={{color: '#FF6B00', fontWeight: 'bold', fontSize: '1.25rem'}}>15100</div>
            </div>
            <div style={{backgroundColor: 'white', borderRadius: '8px', padding: '12px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', textAlign: 'center'}}>
              <div style={{fontWeight: 'bold', color: '#1A3C6E'}}>Karnataka SLSA</div>
              <div style={{color: '#FF6B00', fontWeight: 'bold', fontSize: '1.25rem'}}>080-22113111</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home