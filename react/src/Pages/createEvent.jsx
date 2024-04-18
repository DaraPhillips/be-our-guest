import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './createEventStyle.css';
import axios from 'axios';

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
   // weddingTitle: '',
    wedding_type: '',
    county1: '',
    venue1: '',
    venue1_address1: '',
    venue1_address2: '',
    venue1_address3: '',
    venue1_zip: '',
    //venue1_time: '',
    respondByDate: '',
    time: '',
    date: '',
  });

  const [eventCreated, setEventCreated] = useState(false);
  const [counties, setCounty] = useState([]);
  const [venues, setVenues] = useState([]);
  const [eventType, setEventType] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/event_type/')
      .then((response) => {
        setEventType(response.data);
      })
      .catch((error) => {
        console.error('Error fetching event types:', error);
      });

    // Fetch counties from backend when component mounts
    axios.get('http://127.0.0.1:8000/county/')
      .then((response) => {
        setCounty(response.data);
      })
      .catch((error) => {
        console.error('Error fetching counties:', error);
      });

    // Fetch venues from backend when component mounts
    axios.get('http://127.0.0.1:8000/venues/')
      .then((response) => {
        console.log(response.data); // Add this line
        setVenues(response.data);
      })
      .catch((error) => {
        console.error('Error fetching venues:', error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleVenueSelect1 = (event) => {
  const venueId = parseInt(event.target.value, 10); // Convert to number
  console.log('Selected venue ID:', venueId);
  // Check if venues array is empty before searching
  if (!venues.length) {
    console.error('Venue data not yet fetched or empty.');
    return;
  }

  const selectedVenue = venues.find(
    (venue) => venue.id === venueId
  );
  console.log('Selected venue ID:', selectedVenue);

  if (selectedVenue) {
    setEventData((prevEventData) => ({
      ...prevEventData,
      venue1: selectedVenue.id,
      venue1_address1: selectedVenue.address1,
      venue1_address2: selectedVenue.address2,
      venue1_address3: selectedVenue.address3,
      venue1_zip: selectedVenue.zipcode, // Ensure property names match
    }));
  } else {
    console.error('Selected venue not found:', venueId);
    // Add user-friendly error message to UI (e.g., toast notification)
  }
};

  if (eventCreated) {
    return <Navigate to="./Pages/dashboard" />;
  }
 
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
  
      let url = 'http://127.0.0.1:8000/users/';
      if (token) {
        url += `?token=${token}`; // Assuming your API endpoint retrieves user details by token
      }
  
      const response = await axios.get(url);
      console.log('API response:', response); // Log the entire response object
  
      if (response.data && response.data.id) { // Check for data & user ID
        const userId = response.data.id;
        console.log('Received user ID:', userId);
        // Use the userId here (e.g., return it or store it in state)
        return userId; // You can return the userId for further use
      } else {
        console.error('No user ID found in response.');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const handleSubmit = async (event, form) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    const user = await fetchUserDetails();
    const userToken = localStorage.getItem('jwtToken'); // Assuming local storage
  
 try {
    const response = await fetch('http://127.0.0.1:8000/create_event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify(eventData), // Only send the necessary event data
    });

    // ... handle response
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
  
    return (
 
        <div className='weddingDetails-page'>
 
            <div className='topyoke'>
 
                <h3 className='home-tab-top-thingy'>Home / </h3> <h3 className='other-tab-at-top'>My Events</h3>
 
            </div>
 
            <div className='wedding-details-header'>
 
                <h1>Wedding Details</h1>
 
            </div>
            <div className='event-page-wrap'>
 
                {/* !!!!!! CHURCH DETAILS ON LEFT SIDE OF PAGE !!!!!! */}
                             <div className='details-group'>
                            <div className="input-container">
                                    <input
                                        type="text"
                                        name="weddingTitle"
                                        id="weddingTitle"
                                        placeholder=" Enter Wedding Title"
                                        onChange={handleChange}
                                    />
                                {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>
 
 
            <form onSubmit={handleSubmit}>

                <div className='event-col2'>
 
                    <div className='event-details-container'>
                       
                        <div className='church-details'>
 

 
 
                            <div className='details-group'>
                                    {/* this is the event type dorpdown */}
                                    <select name="event" id="event-id" value={eventData.eventType1} onChange={handleChange}>
      <option key="" value="">Event type</option>
      {eventType.length > 0 ? (
        eventType.map((eventType) => (
          <option key={eventType.id} value={eventType.id}>
            {eventType.name}
          </option>
        ))
      ) : (
        <option disabled>Loading event types...</option>
      )}
    </select>
 
                            </div>
                           
 
                            <hr />
 
                            <label className="church-deets" htmlFor="church-details">Church details</label>
 
                                                       
                            {/* COUNTRY DETAILS */}
                                      {/* county dropdown for church or civil  */}
                            <label className="country-deets" htmlFor="country-details"></label>
 
                            <div className='details-group'>
 
                                <select name="county1" id="county1" value={eventData.county1} onChange={handleChange}>
 
                                    <option key="" value="">Select County</option>
 
                                    {counties.map(county1 => (
 
                                        <option key={county1.id} value={county1.id}>{county1.name}</option>
 
                                    ))}
 
                                </select>
 
                            </div>
 
                            <div className='details-group'>
  <div className="input-container">
        <select
        name="venue1"
        id="venue1"
        value={eventData.venue1}
        onChange={handleVenueSelect1}
        >
        <option key="" value="">Select Venue</option>
        {venues.map((venue1) => (
            <option key={venue1.id} value={venue1.id}>
            {venue1.name}
            </option>
        ))}
        </select>
  </div>
</div>

<div className='details-group'>
  <div className="input-container">
    <input
      type="text"
      name="churchAddress1"
      id="churchAddress1-id"
      placeholder=" Address line 1"
      onChange={handleChange}
      value={eventData.venue1_address1 || ''} // Autofill with venue address
    />
  </div>
</div>

<div className='details-group'>
  <div className="input-container">
    <input
      type="text"
      name="churchAddress2"
      id="churchAddress2-id"
      placeholder=" Address line 2"
      onChange={handleChange}
      value={eventData.venue1_address2 || ''} // Autofill with venue address
    />
  </div>
</div>

<div className='details-group'>
  <div className="input-container">
    <input
      type="text"
      name="churchAddress3"
      id="churchAddress3-id"
      placeholder=" Address line 3"
      onChange={handleChange}
      value={eventData.venue1_address3 || ''} // Autofill with venue address
    />
  </div>
</div>

<div className='details-group'>
  <div className="input-container">
    <input
      type="text"
      name="zip_code1"
      id="zip_code1"
      placeholder=" Zip code"
      onChange={handleChange}
      value={eventData.venue1_zip || ''} // Autofill with venue zip code
    />
  </div>
</div>
            <label htmlFor="username">Enter date</label>
            <div className='details-group'>
              <input type="date" id="event-date" name="date" onChange={handleChange} required /> {/* Added date input */}
            </div>

            <label htmlFor="username">Respond by date</label>
            <div className='details-group'>
              <input type="date" id="event-respondByDate" name="respondByDate" onChange={handleChange} required /> {/* Added date input */}
            </div>
 
                            <label htmlFor="username">Enter time</label>
 
                            <div className='details-group'>
                                <input type="time" id="church-time" name="time" onChange={handleChange} required />
                            </div>
                            <button type="submit" onClick={handleSubmit}>Submit Event</button>

                            </div>
                        </div>
                    </div>
                </form>
                    
 
 
 
                {/* !!!!!! CHURCH DETAILS END !!!!!! */}
 

                </div>
        </div>
       
    );
}