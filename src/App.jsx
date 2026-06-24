import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ResearcherPage from './pages/ResearcherPage'
import DirectorPage from './pages/DirectorPage'
import Home from './pages/Home'

const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('rl_user') || 'null')
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/chercheur" element={<PrivateRoute roles={[ 'chercheur' ]}><ResearcherPage /></PrivateRoute>} />
      <Route path="/directeur" element={<PrivateRoute roles={[ 'directeur' ]}><DirectorPage /></PrivateRoute>} />
    </Routes>
  )
}

export default App
