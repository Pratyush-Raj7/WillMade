import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import RentalAnalyzer from './pages/RentalAnalyzer'
import SchemeFinder from './pages/SchemeFinder'
import KnowYourRights from './pages/KnowYourRights'
import PropertyAnalyzer from './pages/PropertyAnalyzer'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rental" element={<RentalAnalyzer />} />
            <Route path="/schemes" element={<SchemeFinder />} />
            <Route path="/rights" element={<KnowYourRights />} />
            <Route path="/property" element={<PropertyAnalyzer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App