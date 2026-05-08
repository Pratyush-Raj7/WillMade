# WillMade

**Free Legal Self-Help for Every Indian Family**

## 1. The Problem We Are Solving

Most families in India have no way to access basic legal help without paying a lawyer. A consultation in any major city costs between ₹1,000 and ₹5,000 per hour — money most households cannot spare. The result is a legal vacuum that affects everyday life.

### Three Things That Go Wrong Every Day

1. **A family has property but no will**: When someone passes away, siblings and children fight in court for years. The courts decide who gets what.
2. **A tenant signs a rental agreement**: Hidden clauses allow the landlord to keep the deposit, raise rent at will, or evict the tenant with no notice.
3. **A family applies for a government scheme**: The application is rejected because they filled in the wrong form or attached the wrong document.

**Root Cause**: The legal system was not designed for people who cannot afford a lawyer. Information exists, but it lives behind consultation fees, complex language, and English-only websites.

## 2. What WillMade Does

WillMade is a free website that gives ordinary people the tools to handle four of the most common legal needs — without needing a lawyer, without needing to understand legal language, and without paying anything.

- **Document Builder**: Answer a few questions about your family and assets to generate a complete, ready-to-print legal document (will, rental agreement, or affidavit).
- **Contract Checker**: Upload a rental agreement or contract as a PDF. The AI reads every clause and highlights unfair terms, their severity, and suggests fairer alternatives.
- **Scheme Finder**: Fill in a short profile to discover government schemes you qualify for, with direct links to apply.
- **Language & Voice Support**: Works in all 22 official languages with voice input capabilities for users more comfortable speaking than typing.

## 3. Target Users

1. **The Middle-Class Property Owner (e.g., Age 45-65)**: Wants to create a legally valid will securely and easily.
2. **The Urban Renter (e.g., Age 23-35)**: Wants to ensure their rental agreement does not have hidden, predatory clauses.
3. **The Welfare-Eligible Family (e.g., Age 30-55)**: Wants to discover and successfully apply for government support schemes.

## 4. Technical Stack

### Frontend: The Engagement Layer

- **Framework**: React 18/19 via Vite.
- **Styling**: Tailwind CSS (with custom Indian-centric design tokens).
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **State Management**: TanStack Query (React Query) and Zustand.
- **Internationalization**: i18next (English, Hindi, Tamil, Telugu, Kannada, Bengali, etc.).

### Backend & Intelligence: The Reasoning Layer

- **Runtime**: Node.js (LTS) with Express / Fastify.
- **AI Engine**: Claude 3.5 Sonnet (via Anthropic SDK) for contract law reasoning.
- **Speech-to-Text**: Bhashini API (Digital India) for regional Indian dialects.
- **Document Analysis**: pdf-parse + Docling.

### Data & Infrastructure: The Integrity Layer

- **Database**: PostgreSQL (via Supabase) with JSONB columns.
- **ORM**: Prisma.
- **Welfare Data Source**: myScheme API.
- **Document Generation**: pdf-lib / React-PDF (client-side generation).
- **Hosting**: Vercel (Frontend/Edge) and Railway (Backend).

## 5. What the Platform Will Not Do

- **Give legal advice**: WillMade provides templates and flags issues, but cannot replace a real lawyer for complex situations.
- **Guarantee court outcomes**: Documents follow standard formats, but courts interpret them independently.
- **Store user documents permanently**: Documents are generated and downloaded directly to the user's device for privacy.
- **File documents with courts**: Users must take the final step of registering or filing documents themselves.
- **Make eligibility decisions**: We suggest likely scheme matches, but the government determines final eligibility.

## 6. How to Run Locally

_(Instructions for starting the project will be added as the codebase is implemented)_
