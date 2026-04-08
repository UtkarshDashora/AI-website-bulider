import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import Editor from './pages/Editor'
import LivePreview from './pages/LivePreview'
import PricingPage from './pages/Pricing'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import { useSelector } from 'react-redux'
import { useGetCurrentUser } from './hooks/useGetCurrentUser'

export const serverUrl = "http://localhost:5000"

function App() {
  useGetCurrentUser()
  const { userData } = useSelector((state) => state.user)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/dashboard" 
          element={userData ? <Dashboard /> : <Home />} 
        />
        <Route 
          path="/generate" 
          element={userData ? <Generate /> : <Home />} 
        />
        <Route 
          path="/editor/:id" 
          element={userData ? <Editor /> : <Home />} 
        />
        <Route 
          path="/live/:id" 
          element={<LivePreview />} 
        />
        <Route 
          path="/pricing" 
          element={<PricingPage />} 
        />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </Router>
  )
}

export default App