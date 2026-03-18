import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './Landing'
import Auth from './Auth'
import Dashboard from './Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App