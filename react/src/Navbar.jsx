import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import SvgBellIcon from './Icons/SvgBellIcon';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to track whether to display login button
  const [buttonText, setButtonText] = useState('Log in');
  const [userInitial, setUserInitial] = useState('');
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  useEffect(() => {
    setIsLoading(true); // Set loading to true initially
  
    const fetchUserInitial = async () => {
      try {
        const token = localStorage.getItem('jwtToken');

        let url = 'http://127.0.0.1:8000/users/';
        if (token) {
          url += `?token=${token}`;
        }

        const response = await axios.get(url);
        console.log('API response:', response); // Log the entire response object
        const user = response.data;
        console.log('Received users:', user); // Log the users data

        if (user) { // Check if user data exists
          const { firstName } = user; // Destructure firstName property
          const initial = firstName.charAt(0).toUpperCase();
          setUserInitial(initial);
          console.log('User initial:', initial);
          setShouldRefresh(true); // Set refresh flag after fetching
        } else {
          console.error('No user data found in response.');
        }
      } catch (error) {
        console.error('Error fetching user initial:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };
  
    fetchUserInitial();
  }, []);

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

      {/* Additional buttons for the dashboard navbar */}
      {location.pathname === '/dashboard' && (
        <div className="dashboard-buttons">
        <button className="profileCircle" onClick={() => console.log('Profile button clicked')}>
          {/* Display user's initial or loading indicator */}
          {userInitial && ( // Render only if userInitial has a value
            <span>{userInitial}</span>
          )}
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
