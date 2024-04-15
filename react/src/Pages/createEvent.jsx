/* comment */
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './createEventStyle.css';
import axios from 'axios';


export default function CreateEvent() {
    const [eventData, setEventData] = useState({
        county: '',
        venue: '',
        address1: '',
        address2: '',
        address3: '',
        zip: '',
        respondByDate: '',
        eventType: '',
        time: '',
        date: ''
    });

    const [eventCreated, setEventCreated] = useState(false);
    const [counties, setCounty] = useState([]);
    const [venues, setVenues] = useState([]);
    const [eventType, setEventType] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/event_type/')
            .then(response => {
                setEventType(response.data);
            })
            .catch(error => {
                console.error('Error fetching event types:', error);
            });

        axios.get('http://127.0.0.1:8000/county/')
            .then(response => {
                setCounty(response.data);
            })
            .catch(error => {
                console.error('Error fetching counties:', error);
            });

        axios.get('http://127.0.0.1:8000/venues/')
            .then(response => {
                console.log(response.data);
                console.log(response.data);
                setVenues(response.data);
            })
            .catch(error => {
                console.error('Error fetching venues:', error);
            });
    }, []);
    

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
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(
                'http://127.0.0.1:8000/create_event/',
                { event: eventData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                        
                    }
                }
            );

            console.log('Event created successfully:', response.data);
            setEventCreated(true);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEventData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleVenueSelect = (event) => {
        console.log("Venues:", venues);
        console.log("Venue selected:", event.target.value);
        const venueId = parseInt(event.target.value, 10);
        const selectedVenue = venues.find(venue => venue.venueDetailsID === venueId);
        console.log("Selected venue:", selectedVenue);
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
                <h3 className='home-tab-top-thingy'>Home / </h3>
                <h3 className='other-tab-at-top'>My Events</h3>
            </div>
            <div className='wedding-details-header'>
                <h1>Wedding Details</h1>
            </div>
            <div className='event-page-wrap'>
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
                                </div>
                            </div>
                            <div className='details-group'>
                                <select name="country" id="country-id" value={eventData.eventType} onChange={handleChange}>
                                    <option key="" value="">Event type</option>
                                    {eventType.map(eventType => (
                                        <option key={eventType.id} value={eventType.id}>{eventType.name}</option>
                                    ))}
                                </select>
                            </div>
                            <hr />
                            <label className="church-deets" htmlFor="church-details">Church details</label>
                            <label className="country-deets" htmlFor="country-details"></label>
                            <div className='details-group'>
                                <select name="country" id="country-id" value={eventData.county} onChange={handleChange}>
                                    <option key="" value="">Select County</option>
                                    {counties.map(county => (
                                        <option key={county.id} value={county.id}>{county.name}</option>
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
                            <div className='details-group'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="churchName"
                                        id="churchName"
                                        placeholder=" Name of church"
                                        onChange={handleChange}
                                    />
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
                                </div>
                            </div>
                            <label htmlFor="username">Enter time</label>
                            <div className='details-group'>
                                <input type="time" id="church-time" name="church-time" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='event-col2'>
                    <div className='event-details-container'>
                        <form className='host-form' onSubmit={handleSubmit}>
                            <label className="Venue-deets" htmlFor="venue-details">Venue details</label>
                            <label className="country-deets" htmlFor="country-details"></label>
                            <div className='details-group'>
                                <select name="country" id="country-id" value={eventData.county} onChange={handleChange}>
                                    <option key="" value="">Select County</option>
                                    {counties.map(county => (
                                        <option key={county.id} value={county.id}>{county.name}</option>
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
                            <div className='details-group'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="address1"
                                        id="address1-id"
                                        placeholder=" Address line 1"
                                        onChange={handleChange}
                                        value={eventData.address1 || ''}
                                        readOnly
                                    />
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
                                        value={eventData.address2 || ''}
                                        readOnly
                                    />
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
                                        value={eventData.address3 || ''}
                                        readOnly
                                    />
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
                                        value={eventData.zip || ''}
                                        readOnly
                                    />
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