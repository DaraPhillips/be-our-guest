import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserInitial from './Pages/UserInitialCircle';
import SvgBellIcon from './Icons/SvgBellIcon';

const Navbar = () => {
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
      {location.pathname !== '/dashboard' && (
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
      )}

      {/* Additional buttons for the dashboard navbar */}
      {location.pathname === '/dashboard' && (
        <div className="dashboard-buttons">
          <button className="profileCircle" onClick={() => console.log('Profile button clicked')}>
            {/* User's initial component */}
            A
          </button>
          <button className="notifications" onClick={() => console.log('Notifications button clicked')}>
            {/* Notifications icon or text */}
            <SvgBellIcon/>
          </button>
        </div>
      )}

      {/* Conditional rendering for different routes */}
      <div>
        {location.pathname === '/create_event' ? (
          <button className="createEventButton" onClick={handleButtonClick}>
            {buttonText}
          </button>
        ) : location.pathname !== '/dashboard' && (
          <button className="loginBtn" onClick={handleButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;