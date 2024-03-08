import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './createEventStyle.css';
import axios from 'axios';
import SvgVenue from '../Icons/SvgVenue';
import SvgCreate  from '../Icons/SvgCreate';
import SvgTime from '../Icons/SvgTime';
import SvgBellIcon from '../Icons/SvgBellIcon';
import SvgReset from '../Icons/SvgReset';

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

    useEffect(() => {
        // Fetch countries from backend when component mounts
        axios.get('http://127.0.0.1:8000/countries/')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []); // Empty dependency array to run only once on mount

    // Event handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send POST request to create event
            const response = await axios.post('http://127.0.0.1:8000/create_event/', { event: eventData });
            console.log('Event created successfully:', response.data);
            // Optionally redirect to dashboard or show a success message
            setEventCreated(true);
        } catch (error) {
            console.error('Error creating event:', error);
            // Optionally show an error message
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

    if (eventCreated) {
        return <Navigate to="./Pages/HomeLoggedIn" />;
    }

    return (
        <div className='weddingDetails-page'>
            <div className='topyoke'>
                <h3 className='home-tab-top-thingy'>Home / </h3> <h3 className='other-tab-at-top'>My Events</h3>
            </div>
            <div className='wedding-details-header'>
                <h1>Wedding Details</h1>
            </div>
            <div className='event-col1'>
                <div className='event-details-container'>
                    <form className='host-form' onSubmit={handleSubmit}>
                        {/* VENUE DETAILS */}
                        <label className="Venue-deets" htmlFor="venue-details">Venue details</label>
                        <div className='details-group'>
                            <select name="country" id="country-id" value={eventData.country} onChange={handleChange}>
                                <option key="" value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.countriesId} value={country.countriesId}>{country.countryName}</option>
                                ))}
                            </select>
                        </div>

                        <div className='details-group'>
                            <input type="text" name="venue" id="venue-id" placeholder=" Venue" onChange={handleChange} />
                        </div>

                        <div className='details-group'>
                            <input type="text" name="address1" id="address1-id" placeholder=" Address line 1" onChange={handleChange} />
                        </div>

                        <div className='details-group'>
                            <input type="text" name="address2" id="address2-id" placeholder=" Address line 2" onChange={handleChange} />
                        </div>

                        <div className='details-group'>
                            <input type="text" name="address3" id="address3-id" placeholder=" Address line 3" onChange={handleChange} />
                        </div>

                        <div className='details-group'>
                            <input type="text" name="zip" id="Zip-id" placeholder=" Zip code" onChange={handleChange} />
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

                         <div className='reset-deets'>
                            <button className='resetBtn' type="submit">Reset my information</button>
                        </div>

                        <div className='event-details-buttoncontainer'>
                            <button className='createEvent-button' type="submit">Create event <SvgCreate /> </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}