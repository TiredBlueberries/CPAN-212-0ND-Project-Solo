import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState({ message: '', field: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ message: '', field: '' });

    try {
      const endpoint = isRegistering ? '/register' : '/login';
      const body = isRegistering ? formData : {
        email: formData.email,
        password: formData.password
      };

      const response = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'Authentication failed',
          field: data.field || '',
          details: data.details
        };
      }

      localStorage.setItem('token', data.token);
      onLogin();
      navigate('/');
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.details) {
        // Handle Mongoose validation errors
        errorMessage = Object.values(err.details)
          .map(e => e.message)
          .join(', ');
      }

      setError({
        message: errorMessage,
        field: err.field
      });
      
      console.error('Authentication error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      
      {error.message && (
        <div className={`error-message ${error.field ? 'field-error' : ''}`}>
          {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className={error.field === 'firstName' ? 'error-field' : ''}
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className={error.field === 'lastName' ? 'error-field' : ''}
            />
          </>
        )}
        
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={error.field === 'email' ? 'error-field' : ''}
        />
        
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={error.field === 'password' ? 'error-field' : ''}
        />

        <button type="submit">
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering 
            ? 'Already have an account? Login'
            : 'Create new account'}
        </button>
      </form>
    </div>
  );
};

export default Auth;