import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import SvgEmail from '../Icons/EmailIcon';
import SvgPassword from '../Icons/Password';
import SvgClosedEye from '../Icons/SvgClosedEye';
import SvgEye from '../Icons/SvgEye';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      // Send POST request to login endpoint
        const response = await axios.post('http://127.0.0.1:8000/login_with_validation/', formData);

        console.log('Login successful:', response.data);

        // Store the token in local storage
        const token = response.data.token;
        localStorage.setItem('jwtToken', token);
        console.log('Token stored in local storage:', token);

      // Set loggedIn to true after successful login
      setLoggedIn(true);
    } catch (error) {
      console.error('Error logging in:', error);

      // Handle login error, display error message to user
      setLoginError('Invalid Email and Password combination. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // If loggedIn is true, redirect to create_event page
  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login-form">
      <div className="form-container">
        <p className="title">Log in</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-email"></label>
            <div className="input-container">
              <div className="icon"><SvgEmail /></div>
              <input type="text" name="email" id="login-email" placeholder="Email" onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="login-password"></label>
            <div className="input-container">
              <div className="icon"><SvgPassword /></div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="login-password"
                placeholder="Password"
                onChange={handleChange}
              />
              {/* Eye icon for password visibility toggle */}
              <div className="icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <SvgEye /> : <SvgClosedEye />}
              </div>
            </div>
            <div className="forgot">
              <a rel="noopener noreferrer" href="#">
                Forgot your Password?
              </a>
            </div>
          </div>
          {loading ? (
            <div className="loading-spinner">
              {/* Add your loading indicator here */}
            </div>
          ) : (
            <>
              {loginError && <p className="error-message">{loginError}</p>}
              <button type="submit" className="sign" id="login-button">
                Log in
              </button>
            </>
          )}
        </form>
        <p className="signup">
          Not a member?{' '}
          <Link to="/signUp" className="">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}