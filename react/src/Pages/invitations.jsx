import { SvgInvYes } from '../Icons/SvgInvYes';
import { SvgInvNo } from '../Icons/SvgInvNo';
import { SvgChat } from '../Icons/SvgChat';
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './invitationsStyle.css';
 
 
 
export default function CreateEvent() {
 
    const [boxes, setBoxes] = useState([
        {
            backgroundColor: 'transparent',
            locationStatus: '',  //Just used for Invite Accept / Decline
            backgroundImage: '/src/images/homeLoggedInBackground.jpg' // Background image for the first box
        },
        {
            backgroundColor: 'transparent',
            locationStatus: '',
            backgroundImage: '/src/images/homeBackground.jpg' // Background image for the seoond box
        },
        {
            backgroundColor: 'transparent',
            locationStatus: '',
            backgroundImage: '/src/images/signUpImage.jpg' // Background image for the third box
        },
        {
            backgroundColor: 'transparent',
            locationStatus: '',
            backgroundImage: '/src/images/createEventBackgroundImg.png'
        },
        {
            backgroundColor: 'transparent',
            locationStatus: '',
            backgroundImage: '/src/images/createEventBackgroundImg.png'
        },
        {
            backgroundColor: 'transparent',
            locationStatus: '',
            backgroundImage: '/src/images/createEventBackgroundImg.png'
        },
       
        {
            backgroundColor: 'transparent',
            locationStatus: '',
            backgroundImage: '/src/images/createEventBackgroundImg.png'
        },
       
       
       
       
       
 
    ]);
 
    // Function to handle accepting invitation for a specific box
    const handleAcceptClick = (index) => {
        setBoxes(prevBoxes => {
            const updatedBoxes = [...prevBoxes];
            updatedBoxes[index] = {
                ...updatedBoxes[index],
                backgroundColor: 'rgba(144, 238, 144, 0.5)',
                locationStatus: 'INVITE ACCEPTED!'
            };
            return updatedBoxes;
        });
    };
 
    // Function to handle declining invitation for a specific box
    const handleDeclineClick = (index) => {
        setBoxes(prevBoxes => {
            const updatedBoxes = [...prevBoxes];
            updatedBoxes[index] = {
                ...updatedBoxes[index],
                backgroundColor: 'rgba(255, 192, 203, 0.5)',
                locationStatus: 'INVITE DECLINED!'
            };
            return updatedBoxes;
        });
    };
 
    return (
        <div className='invitations-page'>
            <div className='topyoke'>
                <Link to="/dashboard" className='home-tab-top-thingy'>Dashboard / </Link>
                <h3 className='home-tab-top-thingy'> My Invitations / </h3>
 
                <h3 className='other-tab-at-top'> Page 1</h3>
            </div>
 
            <div className='wedding-details-header'>
 
                <h1>My Invitations</h1>
            </div>
 
 
            <div className='top-boxes'>
                {boxes.slice(0, 4).map((box, index) => (
                    <div key={index} className='my-invBox'>
                        <div className='inv-button-img' style={{ backgroundImage: `url(${box.backgroundImage})` }}>
                            <div className='inv-button' style={{ backgroundColor: box.backgroundColor }}>
                                <ul>
                                    <li><h4 className='inv-wedding-title'>Wedding Title</h4></li>
                                    <li><h4 className='inv-location'>Location</h4></li>
                                    <li><h4 className='inv-AccDec'>{box.locationStatus}</h4></li>
                                    <li><h5 className='inv-atlocation'>@Location</h5></li>
                                    <li><h5 className='inv-date'>Date</h5></li>
                                </ul>
                                <div className="inv-icons">
                                    <div className="inv-icon" onClick={() => handleAcceptClick(index)}>
                                        <SvgInvYes />
                                    </div>
                                    <div className="inv-icon">
                                        <Link to="/rsvpPage" className="inv-button-link">
                                            <SvgChat />
                                        </Link>
                                    </div>
                                    <div className="inv-icon" onClick={() => handleDeclineClick(index)}>
                                        <SvgInvNo />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
 
            {/* BOTTOM ROW */}
           
                <div className='second-row'>
                    {boxes.slice(4).map((box, index) => (
                        <div key={index + 5} className='my-invBox'>
                            {/* Render the fifth box or subsequent boxes here */}
                            <div className='inv-button-img' style={{ backgroundImage: `url(${box.backgroundImage})` }}>
                                <div className='inv-button' style={{ backgroundColor: box.backgroundColor }}>
                                    <ul>
                                        <li><h4 className='inv-wedding-title'>Wedding Title</h4></li>
                                        <li><h4 className='inv-location'>Location</h4></li>
                                        <li><h4 className='inv-location'>{box.locationStatus}</h4></li>
                                        <li><h5 className='inv-atlocation'>@Location</h5></li>
                                        <li><h5 className='inv-date'>Date</h5></li>
                                    </ul>
                                    <div className="inv-icons">
                                        <div className="inv-icon" onClick={() => handleAcceptClick(index + 4)}>
                                            <SvgInvYes />
                                        </div>
                                        <div className="inv-icon">
                                            <Link to="/rsvpPage" className="inv-button-link">
                                                <SvgChat />
                                            </Link>
                                        </div>
                                        <div className="inv-icon" onClick={() => handleDeclineClick(index + 4)}>
                                            <SvgInvNo />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    );
}