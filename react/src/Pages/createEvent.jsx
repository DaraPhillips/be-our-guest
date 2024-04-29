/* comment */
/* comment */
import React, { useState, useEffect } from 'react';

import { Link, Navigate } from 'react-router-dom';

import './createEventStyle.css';

import axios from 'axios';

// import SvgCreate from '../Icons/SvgCreate';

// import SvgTime from '../Icons/SvgTime';

// import SvgBellIcon from '../Icons/SvgBellIcon';

// import SvgReset from '../Icons/SvgReset';
// import { SvgPin } from '../Icons/SvgPin';
// import { SvgCalendar } from '../Icons/SvgCalendar';
// import { SvgChurch } from '../Icons/SvgChurch';

export default function CreateEvent() {
 
    const [eventData, setEventData] = useState({
        weddingTitle: '',
        wedding_type: '',
        county1: '',
        venue2: '',
        venue1_address1: '',
        venue1_address2: '',
        venue1_address3: '',
        venue1_zip: '',
        venue_1_time: '',
        venue_1: '',
        venue2_address1: '',
        venue2_address2: '',
        venue2_address3: '',
        venue2_zip: '',
        respond_by_date: '',
        time: '',
        date: ''
        

    });
    

    const [eventCreated, setEventCreated] = useState(false);

    const [counties, setCounty] = useState([]);

    const [venues, setVenues] = useState([]);

    const [wedding_type, setEventType] = useState([]);

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




    useEffect(() => {

        axios.get('http://127.0.0.1:8000/event_type/')

        .then(response => {

            setEventType(response.data);

        })

        .catch(error => {

            console.error('Error fetching event types:', error);

        });

        // Fetch counties from backend when component mounts

        axios.get('http://127.0.0.1:8000/county/')

            .then(response => {

                setCounty(response.data);

            })

            .catch(error => {

                console.error('Error fetching counties:', error);

            });

        // Fetch venues from backend when component mounts

        axios.get('http://127.0.0.1:8000/venues/')

            .then(response => {

                console.log(response.data); // Add this line

                setVenues(response.data);

            })

            .catch(error => {

                console.error('Error fetching venues:', error);

            });

    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        if (eventData.county1) {
          const countyId = parseInt(eventData.county1, 10); // Convert county1 to number
          axios.get(`http://127.0.0.1:8000/venues/${countyId}/`)
            .then((response) => {
              setVenues(response.data);
            })
            .catch((error) => {
              console.error('Error fetching venues:', error);
            });
        }
      }, [eventData.county1]);


      useEffect(() => {
        if (eventData.county2) {
          const countyId = parseInt(eventData.county2, 10); // Convert county1 to number
          axios.get(`http://127.0.0.1:8000/venues/${countyId}/`)
            .then((response) => {
              setVenues(response.data);
            })
            .catch((error) => {
              console.error('Error fetching venues:', error);
            });
        }
      }, [eventData.county2]);

   

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Retrieve authentication token from localStorage or wherever it's stored
            const token = localStorage.getItem('jwtToken');
            const host_user = await fetchUserDetails();

            // Send POST request to create event with authentication token included in headers
            const response = await axios.post(
                'http://127.0.0.1:8000/create_event/',
                { event: eventData,host_user},
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
                    }
                }
            );

            console.log('Event created successfully:', response.data);
            setEventCreated(true);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };


    // Event handler for input changes

    const handleChange = (event) => {

        const { name, value } = event.target;

        setEventData(prevData => ({

            ...prevData,

            [name]: value

        }));

    };
    const handleVenueSelect1 = (event) => {
        const venueId = parseInt(event.target.value, 10); // Convert to number
      
        // Find the selected venue from the venues array
        const selectedVenue = venues.find((venue) => venue.id === venueId);
      
        if (selectedVenue) {
          setEventData((prevEventData) => ({
            ...prevEventData,
            venue2: selectedVenue.id,
            venue1_address1: selectedVenue.address1,
            venue1_address2: selectedVenue.address2,
            venue1_address3: selectedVenue.address3,
            venue1_zip: selectedVenue.zipcode, // Ensure property names match
          }));
        } else {
          console.error('Selected venue not found:', venueId);
        }
      };


    const handleVenueSelect2 = (event) => {

 

        const venueId = parseInt(event.target.value, 10); // Convert to number

        const selectedVenue = venues.find(venue=> venue.id === venueId);

        console.log("Selected venue:", selectedVenue); // Check if selectedVenue is correct

        if (selectedVenue) {

            setEventData(prevEventData => ({
                ...prevEventData,
                venue_1: selectedVenue.id,
                venue2_address1: selectedVenue.address1,
                venue2_address2: selectedVenue.address2,
                venue2_address3: selectedVenue.address3,
                venue2_zip: selectedVenue.zipcode, // Ensure this property matches the property in the venue object
            }));
            

        }

    };

    

    if (eventCreated) {

        return <Navigate to="/dashboard" />;

    }

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




                <div className='event-col2'>

                    <div className='event-details-container'>
                        
                        <div className='church-details'>

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


                            <div className='details-group'>
                                    {/* this is the event type dorpdown */}
                                <select name="wedding_type" id="event-id" value={eventData.wedding_type} onChange={handleChange}>

                                    <option key="" value="">Event type</option>

                                     {wedding_type.map(wedding_type => (

                                        <option key={wedding_type.id} value={wedding_type.id}>{wedding_type.name}</option>

                                    ))}

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
                                      {/* venue dorpdown for church or civil  */}
                                <select name="venue2" id="venue2" value={eventData.venue2} onChange={handleVenueSelect1}>

                                    <option key="" value="">Select Venue</option>

                                    {venues.map((venue2) => (

                                        <option key={venue2.id} value={venue2.id}>

                                            {venue2.name}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            <div className='details-group'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="churchName"
                                    id="churchName"
                                    placeholder=" Name of church"
                                    onChange={handleChange}
                                />
                            {/* <div className="icon">
                                        <SvgChurch />
                                    </div> */}
                                </div>
                            </div>
                            <div className='details-group'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_address1"
                                        id="churchAddress1-id"
                                        placeholder=" Address line 1"
                                         onChange={handleChange}
                                        value={eventData.venue1_address1 || ''} // Ensure value is not null
                                        readOnly
                                        
                                    />
                                    {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>

                            <div className='details-group'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_address2"
                                        id="churchAddress2-id"
                                        placeholder=" Address line 2"
                                        onChange={handleChange}
                                        value={eventData.venue1_address2 || ''} // Ensure value is not null
                                        readOnly
                                    />
                                    {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>
                            <div className='details-group'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_address3"
                                        id="churchAddress3-id"
                                        placeholder=" Address line 3"
                                        onChange={handleChange}
                                        value={eventData.venue1_address3 || ''} // Ensure value is not null
                                        readOnly
                                    />
                                    {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>
                            <div className='details-group'>
                            <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_zip"
                                        id="venue1_zip"
                                        placeholder=" Zip code"
                                        onChange={handleChange}
                                        value={eventData.venue1_zip || ''} // Ensure value is not null
                                        readOnly
                                        

                                    />
                                {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>

                            

                            <label htmlFor="username">Enter time</label>

                            <div className='details-group'>
                                <input type="time" id="venue_1_time" name="venue_1_time" onChange={handleChange} required />
                            </div>

                        </div>

                    </div>

                </div>



                {/* !!!!!! CHURCH DETAILS END !!!!!! */}


                {/* !!!!!! VENUE DETAILS ON RIGHT SIDE OF PAGE !!!!!! */}



                <div className='event-col2'>

                    <div className='event-details-container'>

                        <form className='host-form' onSubmit={handleSubmit}>


                            {/* VENUE DETAILS */}

                            <label className="Venue-deets" htmlFor="venue-details">Venue details</label>

                            
                            {/* COUNTRY DETAILS */}

                            <label className="country-deets" htmlFor="country-details"></label>

                            <div className='details-group'>

                                <select name="county2" id="county2-id" value={eventData.county2} onChange={handleChange}>

                                    <option key="" value="">Select County</option>

                                    {counties.map(county2 => (

                                        <option key={county2.id} value={county2.id}>{county2.name}</option>

                                    ))}

                                </select>

                            </div>

                            <div className='details-group'>

                                <select name="venue_1" id="venue_1-id" value={eventData.venue_1} onChange={handleVenueSelect2}>

                                    <option key="" value="">Select Venue</option>

                                    {venues.map((venue_1) => (

                                        <option key={venue_1.id} value={venue_1.id}>

                                            {venue_1.name}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Address fields */}

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="venue2_address1"

                                    id="venue2_address1-id"

                                    placeholder=" Address line 1"

                                    onChange={handleChange}

                                    value={eventData.venue2_address1 || ''} // Ensure value is not null

                                    readOnly

                                />
                                {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>

                          

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="venue2_address2"

                                    id="venue2_address2"

                                    placeholder=" Address line 2"

                                    onChange={handleChange}

                                    value={eventData.venue2_address2 || ''} // Ensure value is not null

                                    readOnly

                                />
                                {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>

                         

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="venue2_address3"

                                    id="venue2_address3"

                                    placeholder=" Address line 3"

                                    onChange={handleChange}

                                    value={eventData.venue2_address3 || ''} // Ensure value is not null

                                    readOnly

                                />
                                {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>

                            

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="venue2_zip"

                                    id="venue2_zip"

                                    placeholder=" Zip code"

                                    onChange={handleChange}

                                    value={eventData.venue2_zip || ''} // Ensure value is not null

                                    readOnly

                                />
                                {/* <div className="icon">
                                        <SvgPin />
                                    </div> */}
                                </div>
                            </div>

                            

                            <label htmlFor="username">Respond by date </label>

                            <div className='details-group'>

                                <input type="date" id="respond_by_date" name="respond_by_date" onChange={handleChange} />

                            </div>

                            <label htmlFor="username">Enter wedding time</label>

                            <div className='details-group'>

                                <input type="time" id="time" name="time" onChange={handleChange} required />

                            </div>

                            <label htmlFor="username">Enter wedding date  </label>

                            <div className='details-group'>

                                <input type="date" id="date" name="date" onChange={handleChange} />

                            </div>

                            

                            <div className='event-details-buttoncontainer'>

                                <button className='createEvent-button' type="submit">Add event  </button>

                            </div>

                        </form>

                    </div>

                </div>







            </div>
        </div>
    );

}



