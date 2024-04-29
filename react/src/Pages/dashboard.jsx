import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboardStyleSheet.css';
import AuthService from './AuthService';
import axios from 'axios';

export default function Dashboard() {
  const [likeImages, setLikeImages] = useState(['/src/images/likeBefore.png']);
  const [pinImages, setPinImages] = useState(['/src/images/pin.png']);
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('Days - Hours - Minutes - Seconds'); // Display time remaining until event starts
  const [weddingTitle, setWeddingTitle] = useState('Wedding Title');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await fetchUserId();
        const eventUrl = `http://127.0.0.1:8000/get_event_date/${userId}/`;
        const response = await axios.get(eventUrl);
        const eventData = response.data;
        
        // Log eventData
        console.log('Event Data:', eventData);
    
        // Check if eventData is an array and contains at least one element
        if (!Array.isArray(eventData) || eventData.length === 0) {
          console.error('Event data is either not an array or is empty.');
          return;
        }
    
        // Access the first element of the array and check if it has the date field
        const firstEvent = eventData[0];
        if (!firstEvent.date) {
          console.error('Event date not found in the response data.');
          return;
        }
    
        // Parse date string to Date object
        const eventDateString = firstEvent.date;
        console.log('Event Date String:', eventDateString);
        const eventDateParts = eventDateString.split('-');
        const eventDate = new Date(eventDateParts[0], eventDateParts[1] - 1, eventDateParts[2]); // Month is 0-indexed
    
        // Log eventDate
        console.log('Event Date:', eventDate);
    
        setEventDate(eventDate);

        // Fetch wedding title
        const titleResponse = await axios.get(`http://127.0.0.1:8000/get_event_title/${userId}/`);
        const titleData = titleResponse.data;
        if (titleData.length > 0) {
          const weddingTitle = titleData[0].weddingTitle; 
          setWeddingTitle(weddingTitle);
        } else {
          console.error('No wedding title found for the user.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      let url = 'http://127.0.0.1:8000/users/';
      if (token) {
        url += `?token=${token}`;
      }
      const response = await axios.get(url);
      if (response.data) {
        const userId = response.data.id;
        return userId;
      } else {
        console.error('No user data found in response.');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const toggleLikeImage = (index) => {
    const newImages = [...likeImages];
    newImages[index] =
      newImages[index] === '/src/images/likeBefore.png'
        ? '/src/images/like-onclick.png'
        : '/src/images/likeBefore.png';
    setLikeImages(newImages);
  };

  const togglePinImage = (index) => {
    const newImages = [...pinImages];
    newImages[index] =
      newImages[index] === '/src/images/pin.png'
        ? '/src/images/pin-onclick.png'
        : '/src/images/pin.png';
    setPinImages(newImages);
  };

  useEffect(() => {
    if (eventDate) {
      const intervalId = setInterval(() => {
        const now = new Date();
        const difference = eventDate.getTime() - now.getTime(); // Get time in milliseconds
        console.log('Event Date:', eventDate);
        console.log('Now:', now);
        console.log('Difference:', difference);
        if (difference <= 0) {
          clearInterval(intervalId);
          setTimeRemaining('Event has started!');
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          console.log('Time Remaining:', `${days}d ${hours}h ${minutes}m ${seconds}s`);
          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [eventDate]);

  const handleLogout = () => {
    AuthService.logout();
    console.log("Token after logout:", localStorage.getItem('jwtToken'));
    navigate('/login');
  };

  return (
    <div className='dashboard-page-body'>
      <div className='header-wrap-dash'>
        <h3 className="dashboard">Dashboard</h3>
        <h1 className="weddingNames">{weddingTitle}</h1> {/* Render wedding title here */}
          <div>
              <p>{timeRemaining}</p>
          </div>

      </div>

      <div className='dash-sidebar'>
        <ul className="side_bar">
          {/* Use navigate function onClick instead of Link */}
          <li className="myDashboard">
            <img className='dashSprite-imageslist' src='/src/images/dashboard.svg' />
            My Dashboards
            <img className='dropdownIcon' src='/src/images/dropdown.svg' />
          </li>
          <li className="sideBarItems" onClick={() => navigate('/createEvent')}>
            <img className='dashSprite-imageslist' src='/src/images/editMyEvent.svg' />
            My Event
          </li>
          <li className="sideBarItems" onClick={() => navigate('/addGuestList')}>
            <img className='dashSprite-imageslist' src='/src/images/guestList.svg' />
            My Guest List
          </li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/invites.svg' />My Invitations</li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/profile.svg' />My Profile</li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/chat.svg' />Chat</li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/post.svg' />Post</li>
        </ul>
        <hr />
        <ul>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/tablePlan.svg' />Table Plan</li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/menu.svg' />Menu</li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/info.svg' />About</li>
          <li className="sideBarItems"><img className='dashSprite-imageslist' src='/src/images/help.svg' />Help</li>
        </ul>
        <ul >
           <li className='dashlogout' onClick={handleLogout}>
          <img className='dashSprite-imageslist' src='/src/images/logout.svg' />
          Log out
        </li>
        </ul>
      </div>

      <div className='dash-mainbox'>
        <div className='dash-createEvent'>
          <h3 className="createEvent">Create an Event</h3>
          <div className='createEvent-box-wrapper'>
            <div className='createEventBox1' onClick={() => navigate('/createEvent')}>
  <button className='createEvent-Button1'>
    <img src='/src/images/addEvent.svg' />
  </button>
</div>
</div>
</div>

        <div className='dash-recentPosts'>
          <h3 className="posts">Recent Posts</h3>
          <hr className='commentdash-line' />
        </div>

        <div className='dash-recentPosts' style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {likeImages.map((likeImage, index) => (
            <div className='commentbox-dash' key={index}>
              <div className='dash-commentboxSprites'>
                <img className='dashcomment-likeBefore' src={likeImages} onClick={() => toggleLikeImage(index)} />
                <img className='dashcomment-pin' src={pinImages[index]} onClick={() => togglePinImage(index)} />
              </div>
              <div className='dash-commentSection'>
                <input type='text' className='commentBox' placeholder='Comment'></input>
                <button className='sendButton-dash'>Send</button>
              </div>
            </div>
          ))}
          <hr className='commentdash-line' />
          {likeImages.map((likeImage, index) => (
            <div className='commentbox-dash' key={index}>
              <div className='dash-commentboxSprites'>
                <img className='dashcomment-likeBefore' src={likeImages} onClick={() => toggleLikeImage(index)} />
                <img className='dashcomment-pin' src={pinImages[index]} onClick={() => togglePinImage(index)} />
              </div>
              <div className='dash-commentSection'>
                <input type='text' className='commentBox' placeholder='Comment'></input>
                <button className='sendButton-dash'>Send</button>
              </div>
            </div>
          ))}
          <hr className='commentdash-line' />
          {likeImages.map((likeImage, index) => (
            <div className='commentbox-dash' key={index}>
              <div className='dash-commentboxSprites'>
                <img className='dashcomment-likeBefore' src={likeImages} onClick={() => toggleLikeImage(index)} />
                <img className='dashcomment-pin' src={pinImages[index]} onClick={() => togglePinImage(index)} />
              </div>
              <div className='dash-commentSection'>
                <input type='text' className='commentBox' placeholder='Comment'></input>
                <button className='sendButton-dash'>Send</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}