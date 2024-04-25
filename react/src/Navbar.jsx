import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserInitial from './Pages/UserInitialCircle';
import SvgBellIcon from './Icons/SvgBellIcon';
import './Pages/navbar.css';
import axios from 'axios'; // Import axios here

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState(null);

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

  useEffect(() => {
  const fetchUserInitial = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
  
      let url = 'http://127.0.0.1:8000/users/';
      if (token) {
        url += `?token=${token}`;
      }
  
      const response = await axios.get(url);
      const user = response.data;
      console.log('Received users:', user); // Log the users data
  
      if (user) { // Check if user data exists
        const { first_name } = user;
        const initial = first_name.charAt(0).toUpperCase();
        setUserInitial(initial);
        console.log('User initial:', initial);
      } else {
        console.error('No user data found in response.');
      }
    } catch (error) {
      console.error('Error fetching user initial:', error);
    }
  };
  fetchUserInitial();
}, []);

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
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <Link to="/home" class="nav-link" aria-current="page">Home</Link>
                </li>
                <li class="nav-item">
                  <Link to="/about" class="nav-link">About</Link>
                </li>
                <li class="nav-item">
                  <Link to="/features" class="nav-link">Features</Link>
                </li>
                <li class="nav-item">
                  <Link to="/gallery" class="nav-link">Pricing</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Additional buttons for the dashboard navbar */}
      {location.pathname === '/dashboard' && (
        <div className="dashboard-buttons">
          <button className="profileCircle" onClick={() => console.log('Profile button clicked')}>
          {userInitial || (
            <span>?</span>  // Display "NA" for cases where user data is missing
          )
          }</button>
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
          <button className="btn btn-primary" onClick={handleButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;