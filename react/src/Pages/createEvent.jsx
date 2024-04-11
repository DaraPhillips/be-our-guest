
import React, { useState, useEffect } from 'react';

import { Link, Navigate } from 'react-router-dom';

import './createEventStyle.css';

import axios from 'axios';

import SvgCreate from '../Icons/SvgCreate';

import SvgTime from '../Icons/SvgTime';

import SvgBellIcon from '../Icons/SvgBellIcon';

import SvgReset from '../Icons/SvgReset';
import { SvgPin } from '../Icons/SvgPin';
import { SvgCalendar } from '../Icons/SvgCalendar';
import { SvgChurch } from '../Icons/SvgChurch';

export default function CreateEvent() {

    const [eventData, setEventData] = useState({

        country: '',

        venue: '',

        address1: '',

        address2: '',

        address3: '',

        zip: '',

        respondByDate: '',

        eventType: '2',

        time: '',

        date: ''

    });

    const [eventCreated, setEventCreated] = useState(false);

    const [countries, setCountries] = useState([]);

    const [venues, setVenues] = useState([]);




    useEffect(() => {

        // Fetch countries from backend when component mounts

        axios.get('http://127.0.0.1:8000/countries/')

            .then(response => {

                setCountries(response.data);

            })

            .catch(error => {

                console.error('Error fetching countries:', error);

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
        if (eventData.country) {
            axios.get(`http://127.0.0.1:8000/venues/${eventData.country}/`)
                .then(response => {
                    setVenues(response.data);
                })
                .catch(error => {
                    console.error('Error fetching venues:', error);
                });
        }
    }, [eventData.country]);

   

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Retrieve authentication token from localStorage or wherever it's stored
            const token = localStorage.getItem('jwtToken');

            // Send POST request to create event with authentication token included in headers
            const response = await axios.post(
                'http://127.0.0.1:8000/create_event/',
                { event: eventData },
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

    const handleVenueSelect = (event) => {

        console.log("Venues:", venues); // Check if venues array is populated

        console.log("Venue selected:", event.target.value); // Check if venueId is correct

        const venueId = parseInt(event.target.value, 10); // Convert to number

        const selectedVenue = venues.find(venue => venue.venueDetailsID === venueId);

        console.log("Selected venue:", selectedVenue); // Check if selectedVenue is correct

        if (selectedVenue) {

            setEventData(prevEventData => ({

                ...prevEventData,

                venue: selectedVenue.venueDetailsID,

                address1: selectedVenue.address1,

                address2: selectedVenue.address2,

                address3: selectedVenue.address3,

                zip: selectedVenue.zipcode,

            }));

        }

    };

    if (eventCreated) {

        return <Navigate to="./Pages/dashboard" />;

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
                                <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>


                            <div className='details-group'>

                                <select name="country" id="country-id" value={eventData.country} onChange={handleChange}>

                                    <option key="" value="">Event type</option>

                                    {/* {countries.map(country => (

                                        <option key={country.countriesId} value={country.countriesId}>{country.countryName}</option>

                                    ))} */}

                                </select>

                            </div>
                            

                            <hr />

                            <label className="church-deets" htmlFor="church-details">Church details</label>

                            <div className='details-group'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="churchName"
                                    id="churchName"
                                    placeholder=" Name of church"
                                    onChange={handleChange}
                                />
                            <div className="icon">
                                        <SvgChurch />
                                    </div>
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
                                        
                                    />
                                    <div className="icon">
                                        <SvgPin />
                                    </div>
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
                                    />
                                    <div className="icon">
                                        <SvgPin />
                                    </div>
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
                                    />
                                    <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>
                            <div className='details-group'>
                            <div className="input-container">
                                    <input
                                        type="text"
                                        name="zip-code"
                                        id="zip-code"
                                        placeholder=" Zip code"
                                        onChange={handleChange}

                                    />
                                <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>

                            

                            <label htmlFor="username">Enter time</label>

                            <div className='details-group'>
                                <input type="time" id="church-time" name="church-time" onChange={handleChange} required />
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

                                <select name="country" id="country-id" value={eventData.country} onChange={handleChange}>

                                    <option key="" value="">Select County</option>

                                    {countries.map(country => (

                                        <option key={country.countriesId} value={country.countriesId}>{country.countryName}</option>

                                    ))}

                                </select>

                            </div>

                            <div className='details-group'>

                                <select name="venue" id="venue-id" value={eventData.venue} onChange={handleVenueSelect}>

                                    <option key="" value="">Select Venue</option>

                                    {venues.map((venue) => (

                                        <option key={venue.venueDetailsID} value={venue.venueDetailsID}>

                                            {venue.name}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Address fields */}

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="address1"

                                    id="address1-id"

                                    placeholder=" Address line 1"

                                    onChange={handleChange}

                                    value={eventData.address1 || ''} // Ensure value is not null

                                    readOnly

                                />
                                <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>

                          

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="address2"

                                    id="address2-id"

                                    placeholder=" Address line 2"

                                    onChange={handleChange}

                                    value={eventData.address2 || ''} // Ensure value is not null

                                    readOnly

                                />
                                <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>

                         

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="address3"

                                    id="address3-id"

                                    placeholder=" Address line 3"

                                    onChange={handleChange}

                                    value={eventData.address3 || ''} // Ensure value is not null

                                    readOnly

                                />
                                <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>

                            

                            <div className='details-group'>
                            <div className="input-container">
                                <input

                                    type="text"

                                    name="zip"

                                    id="Zip-id"

                                    placeholder=" Zip code"

                                    onChange={handleChange}

                                    value={eventData.zip || ''} // Ensure value is not null

                                    readOnly

                                />
                                <div className="icon">
                                        <SvgPin />
                                    </div>
                                </div>
                            </div>

                            

                            <label htmlFor="username">Respond by date </label>

                            <div className='details-group'>

                                <input type="date" id="respondByDate" name="respondByDate" onChange={handleChange} />

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