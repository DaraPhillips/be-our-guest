import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // State to track whether to display login button
  const [buttonText, setButtonText] = useState('Log in');

  useEffect(() => {
    // Update the button text based on the current route
    if (location.pathname === '/login') {
      setButtonText('Sign up');
    } else if (location.pathname === '/signUp') {
      setButtonText('Log in');
    } else if (location.pathname === '/create_event') {
      setButtonText('Dashboard');
    } else {
      setButtonText('Log in');
    }
  }, [location.pathname]);

  const handleButtonClick = () => {
    // Update the button text dynamically based on the current route
    if (location.pathname === '/login') {
      navigate('/signUp');
      console.log('Custom sign-up button clicked');
    } else if (location.pathname === '/signUp') {
      navigate('/login');
      console.log('Custom login button clicked');
    } else if (location.pathname === '/create_event') {
      navigate('/dashboard');  // Navigate to '/dashboard' on 'createEvent' button click
      console.log('Custom dashboard button clicked');
    } else {
      navigate('/login');
      console.log('Default login button clicked');
    }
  };

  return (
    <nav className="nav">
      {/* Logo */}
      <Link to="/" className="site-title">
        <img src="/src/images/beOurGuestLogo.png" alt="Logo" className="navbar-logo" />
      </Link>

      {/* Navigation Links */}
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
      </ul>

      {/* Conditional rendering for different routes */}
      <div>
        <button
          className={`loginBtn ${location.pathname === '/create_event' ? 'createEventButton' : ''}`}
          onClick={handleButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </nav>
  );
}