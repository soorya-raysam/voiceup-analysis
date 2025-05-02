import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        
        
        <nav style={{
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "#ffffffe",
  padding: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  gap: "60px"
}}>
  <Link to="/" style={{ textDecoration: "none", color: "#d81d1d", fontWeight: "500" }}>Chats</Link>
  <Link to="/dashboard" style={{ textDecoration: "none", color: "#1d4ed8", fontWeight: "500" }}>Dashboard</Link>
</nav>


        
        <main style={{ paddingTop: "80px" }}>
  <Routes>
    <Route path="/" element={<ChatPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</main>

      </div>
    </Router>
  );
};

export default App;
