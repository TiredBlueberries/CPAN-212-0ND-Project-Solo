import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Editor from './Editor';
import Auth from './Auth';
import Gallery from './Gallery';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const navigate = useNavigate();

  // Sync authentication state across tabs
  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Listen for storage changes
    window.addEventListener('storage', checkAuthState);
    
    // Initial check
    checkAuthState();

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', checkAuthState);
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar 
        isAuthenticated={isAuthenticated}
        onLogout={() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/login');
        }}
      />
      
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Auth 
                onLogin={() => {
                  setIsAuthenticated(true);
                  navigate('/');
                }}
              />
            )
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Editor />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/gallery" 
          element={
            isAuthenticated ? (
              <Gallery />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;