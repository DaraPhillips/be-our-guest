import { SvgInvYes } from '../Icons/SvgInvYes';
import { SvgInvNo } from '../Icons/SvgInvNo';
import { SvgChat } from '../Icons/SvgChat';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './invitationsStyle.css';
import axios from 'axios';
 
export default function Invite() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [venues, setVenues] = useState([]);

    const filteredVenues1 = venues.filter(venue => venue.id === events.id);
    // const filteredVenues2 = venues.filter(venue => venue.id === eventData.venue2);
 
    const fetchAllVenues = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/venues/');
          const venues = response.data;
          setVenues(venues);
        } catch (error) {
          console.error('Error fetching venues:', error);
        }
      };
     
      useEffect(() => {
        fetchAllVenues();
      }, []);

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

    const fetchUserId = async () => {
 
        try {
   
          const token = localStorage.getItem('jwtToken');
   
     
   
          let url = 'http://127.0.0.1:8000/users/';
   
          if (token) {
   
            url += `?token=${token}`; // Assuming the API endpoint filters by token
   
          }
   
     
   
          const response = await axios.get(url);
   
          console.log('API response:', response); // Log the entire response object (optional)
   
     
   
          if (response.data) { // Check if there's data in the response
   
            const userId = response.data.id;
   
            console.log('User ID log:', response.data); // Log the user ID (optional)
   
            return userId; // Return the user ID
   
          } else {
   
            console.error('No user data found in response.'); // Handle cases where no data is found
   
          }
   
        } catch (error) {
   
          console.error('Error fetching user ID:', error); // Handle errors during API call
   
        }
   
      };
   
      useEffect(() => {
        const fetchUserIdAndEvents = async () => {
            try {
                // Fetch the user ID
                const userId = await fetchUserId();
                if (!userId) {
                    setError('User ID not found');
                    setLoading(false);
                    return;
                }
                // Use the fetched user ID to fetch events
                const response = await axios.get(`http://127.0.0.1:8000/get_user_events/${userId}/`);
                setEvents(response.data.events);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchUserIdAndEvents();
    }, []);
    useEffect(() => {
        // Map over the events array and update the boxes state with event details
        setBoxes(events.map(event => {
            console.log('Event:', event); // Log the event object
            console.log('Filtered venue:', event.filteredVenues1); // Log the filteredVenues1 object
            console.log('Venue name:', filteredVenues1[0]?.name); // Log the venue name
            return {
                backgroundColor: 'rgb(213, 217, 225)',
                locationStatus: '',  
                backgroundImage: '/src/images/homeBackground.jpg',
                title: event.name,
                date: event.date,
                respondByDate: event.respond_by_date,
                venue: {
                    name: event.filteredVenues1?.name,
                    address: `${event.filteredVenues1?.address1}, ${event.filteredVenues1?.address2}, ${event.filteredVenues1?.address3}`,
                    zipcode: event.filteredVenues1?.zipcode,
                    county: event.filteredVenues1?.county
                },
                venue1Time: event.venue_1_time,
                venue2Time: event.venue_2_time,
                venue3Time: event.venue_3_time,
                isAttending: event.is_attending
            };
        }));
    }, [events]);
 
    const toggleStatus = async (index, newStatus) => {
        try {
            // Update the local state first
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
    
            // Get the event ID based on the index
            const eventId = events[index].id;
    
            // Send the updated status to the backend API
            await axios.put(`http://127.0.0.1:8000/update_invitation_status/${eventId}/`, {
                is_attending: newStatus === 'ACCEPTED' ? 1 : 0 // Set is_attending to 1 if ACCEPTED, 0 if DECLINED
            });
        } catch (error) {
            console.error('Error updating invitation status:', error);
            // If there's an error, revert the local state back to the original state
            setBoxes(prevBoxes => {
                const updatedBoxes = [...prevBoxes];
                updatedBoxes[index] = {
                    ...updatedBoxes[index],
                    locationStatus: '',
                    backgroundColor: 'rgb(213, 217, 225)'
                };
                return updatedBoxes;
            });
        }
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
                        <h2 className="card-title">{box.title}</h2>
                        <div className='description'>
                            <p className="card-description">Status: {box.locationStatus}</p>
                            {/* <p className="card-description">Location:{box.venue.name}</p> */}
                            <p className="card-description">Date:{box.date}</p>
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