import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboardStyleSheet.css';
import AuthService from './AuthService';

export default function Dashboard() {
  const [likeImages, setLikeImages] = useState(['/src/images/likeBefore.png']);
  const [pinImages, setPinImages] = useState(['/src/images/pin.png']);
  const navigate = useNavigate();

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

  
  const handleLogout = () => {
  // Call your authentication service logout method
  AuthService.logout();

  // Verify that the token is cleared from local storage
  console.log("Token after logout:", localStorage.getItem('jwtToken'));

  // Redirect to the login page or perform any other actions
  navigate('/login');
};

  return (
    <div className='dashboard-page-body'>
      <div className='header-wrap-dash'>
        <h3 className="dashboard">Dashboard</h3>
        <h1 className="weddingNames">Name and Name's Wedding</h1>
        <h3 className="countdown">COUNTDOWN HERE</h3>
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
          <li className="sideBarItems" onClick={() => navigate('/createEvent')}>
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