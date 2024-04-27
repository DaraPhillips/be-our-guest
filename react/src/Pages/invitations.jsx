import { SvgInvYes } from '../Icons/SvgInvYes';
import { SvgInvNo } from '../Icons/SvgInvNo';
import { SvgChat } from '../Icons/SvgChat';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './invitationsStyle.css';
import axios from 'axios'; 
export default function Invite() {
    const [boxes, setBoxes] = useState([
        {
            backgroundColor: 'trgb(213, 217, 225)',
            locationStatus: '',  // Just used for Invite Accept / Decline
            backgroundImage: '/src/images/paul-unsplash.jpg'
        },
        {
            backgroundColor: 'rgb(213, 217, 225)',
            locationStatus: '',  // Just used for Invite Accept / Decline
            backgroundImage: '/src/images/createEventBackgroundImg.png'
        },
        {
            backgroundColor: 'rgb(213, 217, 225)',
            locationStatus: '',  // Just used for Invite Accept / Decline
            backgroundImage: '/src/images/homeBackground.jpg'
        },
        {
            backgroundColor: 'rgb(213, 217, 225)',
            locationStatus: '',  // Just used for Invite Accept / Decline
            backgroundImage: '/src/images/sharday.jpg'
        },
        {
            backgroundColor: 'rgb(213, 217, 225)',
            locationStatus: '',  // Just used for Invite Accept / Decline
            backgroundImage: '/src/images/rings.jpg'
        },
        // Add more boxes here if needed
    ]);
 
    const toggleStatus = (index, newStatus) => {
        setBoxes(prevBoxes => {
            const updatedBoxes = [...prevBoxes];
            const currentStatus = updatedBoxes[index].locationStatus;
            const updatedStatus = currentStatus === newStatus ? '' : newStatus;
            updatedBoxes[index] = {
                ...updatedBoxes[index],
                backgroundColor: updatedStatus === 'ACCEPTED' ? 'rgba(144, 238, 144, 0.5)' : (updatedStatus === 'DECLINED' ? 'rgba(255, 192, 203, 0.5)' : 'rgb(213, 217, 225)'),
                locationStatus: updatedStatus
            };
 
            // Move the box to the start of the queue if it is accepted
            if (updatedStatus === 'ACCEPTED') {
                const acceptedBox = updatedBoxes.splice(index, 1)[0];
                updatedBoxes.unshift(acceptedBox);
            }
 
            return updatedBoxes;
        });
    };
 
    return (
        <div className='invitations-page'>
            <div className='breadcrumb-container'>
                <Link to="/dashboard" className='dash-breadcrumb'>Dashboard / </Link>
                <h3 className='currentPage-breadcrumb'> My Invitations </h3>
            </div>
 
            <div className='top-boxes'>
                {boxes.map((box, index) => (
                    <div key={index} className='card' style={{ backgroundColor: box.backgroundColor }}>
                        <img src={box.backgroundImage} alt="Card Image" className="card-image" />
                        <h2 className="card-title">Wedding Title</h2>
                        <div className='description'>
                            <p className="card-description">Status: {box.locationStatus}</p>
                            <p className="card-description">Location:</p>
                            <p className="card-description">Date:</p>
                        </div>
                        <div className="inv-icons">
                            <div className="inv-icon" onClick={() => toggleStatus(index, 'ACCEPTED')}>
                                <SvgInvYes />
                            </div>
                            <div className="inv-icon">
                                <Link to="/rsvpPage" className="inv-button-link">
                                    <SvgChat />
                                </Link>
                            </div>
                            <div className="inv-icon" onClick={() => toggleStatus(index, 'DECLINED')}>
                                <SvgInvNo />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}