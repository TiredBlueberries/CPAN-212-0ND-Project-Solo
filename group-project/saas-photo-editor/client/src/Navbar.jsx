import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout(); // Trigger parent state update
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/">Canvas</Link>
      <Link to="/gallery">Gallery</Link>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;