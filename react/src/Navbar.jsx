import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserInitial from './Pages/UserInitialCircle';
import SvgBellIcon from './Icons/SvgBellIcon';
import './Pages/navbar.css';

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
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="#">Navbar</a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
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
          <button className="btn btn-primary" onClick={handleButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;