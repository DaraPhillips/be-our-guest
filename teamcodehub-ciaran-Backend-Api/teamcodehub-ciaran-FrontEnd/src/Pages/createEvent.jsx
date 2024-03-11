import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import SvgVenue from '../Icons/SvgVenue';
import SvgCreate from '../Icons/SvgCreate';
import SvgTime from '../Icons/SvgTime';
import SvgBellIcon from '../Icons/SvgBellIcon';
import SvgReset from '../Icons/SvgReset';
import './createEventStyle.css';

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
        axios.get('http://127.0.0.1:8000/countries/')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/create_event/', { event: eventData });
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
                        <label className="Venue-deets" htmlFor="venue-details">Venue details</label>

                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'><SvgVenue /></div>
                                <input type="text" name="venue" id="venue-id" placeholder=" Venue" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'><SvgVenue /></div>
                                <input type="text" name="address1" id="address1-id" placeholder=" Address line 1" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'><SvgVenue /></div>
                                <input type="text" name="address2" id="address2-id" placeholder=" Address line 2" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'><SvgVenue /></div>
                                <input type="text" name="address3" id="address3-id" placeholder=" Address line 3" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'><SvgVenue /></div>
                                <input type="text" name="zip" id="Zip-id" placeholder=" Zip code" onChange={handleChange} />
                            </div>
                        </div>

                        <label htmlFor="username">Respond by date </label>
                        <div className='details-group'>
                            <input type="date" id="respondByDate" name="respondByDate" onChange={handleChange} />
                        </div>

                        <label htmlFor="username">Enter wedding time</label>
                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'><SvgTime /></div>
                                <input type="time" id="time" name="time" onChange={handleChange} required />
                            </div>
                        </div>

                        <label htmlFor="username">Enter wedding date  </label>
                        <div className='details-group'>
                            <div className='input-container'>
                                <div className='icon'></div>
                                <input type="date" id="date" name="date" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='reset-deets'>
                            <button className='resetBtn' type="submit">Reset my information</button>
                        </div>

                        <div className='event-details-buttoncontainer'>
                            <button className='createEvent-button' type="submit">Create event <SvgCreate /></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}