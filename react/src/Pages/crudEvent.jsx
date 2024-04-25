import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

import axios from 'axios';

export default function CrudEvent() {
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
    const [counties, setCounties] = useState([]);
    const [venues1, setVenues1] = useState([]);
    const [venues2, setVenues2] = useState([]);
    const [weddingTypeOptions, setWeddingTypeOptions] = useState([]);
    const [churchDetailsLabel, setChurchDetailsLabel] = useState('Church details');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/event_type/')
            .then(response => {
                setWeddingTypeOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching event types:', error);
            });

        axios.get('http://127.0.0.1:8000/county/')
            .then(response => {
                setCounties(response.data);
            })
            .catch(error => {
                console.error('Error fetching counties:', error);
            });
    }, []);

    useEffect(() => {
        if (eventData.county1) {
            const countyId = parseInt(eventData.county1, 10);
            axios.get(`http://127.0.0.1:8000/venues/${countyId}/`)
                .then((response) => {
                    setVenues1(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching venues:', error);
                });
        }
    }, [eventData.county1]);

    useEffect(() => {
        if (eventData.county2) {
            const countyId = parseInt(eventData.county2, 10);
            axios.get(`http://127.0.0.1:8000/venues/${countyId}/`)
                .then((response) => {
                    setVenues2(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching venues:', error);
                });
        }
    }, [eventData.county2]);

    useEffect(() => {
        const updateChurchDetailsLabel = (selectedWeddingType) => {
            switch (selectedWeddingType) {
                case 'Civil':
                    setChurchDetailsLabel('Civil Ceremony Office');
                    break;
                case 'Religious':
                    setChurchDetailsLabel('Church details');
                    break;
                case 'Humanist':
                    setChurchDetailsLabel('Humanist Ceremony Venue');
                    break;
                default:
                    setChurchDetailsLabel('Church details');
                    break;
            }
        };

        const selectedWeddingType = weddingTypeOptions.find(type => type.id === parseInt(eventData.wedding_type, 10));

        if (selectedWeddingType) {
            updateChurchDetailsLabel(selectedWeddingType.name);
        }
    }, [eventData.wedding_type]);

    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            let url = 'http://127.0.0.1:8000/users/';
            if (token) {
                url += `?token=${token}`;
            }
            const response = await axios.get(url);
            if (response.data && response.data.id) {
                const userId = response.data.id;
                return userId;
            } else {
                console.error('No user ID found in response.');
            }
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('jwtToken');
            const host_user = await fetchUserDetails();
            const response = await axios.post(
                'http://127.0.0.1:8000/create_event/',
                { event: eventData, host_user },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
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
    
        // Handle changes in county and venue options
        if (name === "county1") {
            const selectedCounty = counties.find(county => county.id === parseInt(value, 10));
            if (selectedCounty) {
                setEventData(prevEventData => ({
                    ...prevEventData,
                    venue1_address1: selectedCounty.address1 || '',
                    venue1_address2: selectedCounty.address2 || '',
                    venue1_address3: selectedCounty.address3 || '',
                    venue1_zip: selectedCounty.zipcode || '',
                }));
            }
        }
    
        if (name === "venue1") {
            const selectedVenue = venues1.find(venue => venue.id === parseInt(value, 10));
            if (selectedVenue) {
                setEventData(prevEventData => ({
                    ...prevEventData,
                    venue_1: selectedVenue.id,
                    venue1_address1: selectedVenue.address1 || '',
                    venue1_address2: selectedVenue.address2 || '',
                    venue1_address3: selectedVenue.address3 || '',
                    venue1_zip: selectedVenue.zipcode || '',
                }));
            }
        }
    
        if (name === "county2") {
            const selectedCounty = counties.find(county => county.id === parseInt(value, 10));
            if (selectedCounty) {
                setEventData(prevEventData => ({
                    ...prevEventData,
                    venue2_address1: selectedCounty.address1 || '',
                    venue2_address2: selectedCounty.address2 || '',
                    venue2_address3: selectedCounty.address3 || '',
                    venue2_zip: selectedCounty.zipcode || '',
                }));
            }
        }
    
        if (name === "venue2") {
            const selectedVenue = venues2.find(venue => venue.id === parseInt(value, 10));
            if (selectedVenue) {
                setEventData(prevEventData => ({
                    ...prevEventData,
                    venue2_address1: selectedVenue.address1 || '',
                    venue2_address2: selectedVenue.address2 || '',
                    venue2_address3: selectedVenue.address3 || '',
                    venue2_zip: selectedVenue.zipcode || '',
                }));
            }
        }
    };

    if (eventCreated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className='weddingDetails-page'>
            <div className='breadcrumb-container'>
                <Link to="/dashboard" className='dash-breadcrumb'>Dashboard / </Link>
                <h3 className='currentPage-breadcrumb'>My Event</h3>
            </div>
            <div className='wedding-details-header'></div>
            <div className='event-page-wrap'>
                <div className='event-details-container'>
                    <div className='church-details'>
                        <div className='details-group1'>
                            <h1 className='heading'>Your Wedding Details</h1>
                            {/* Wedding Title Input */}
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="weddingTitle"
                                    id="weddingTitle"
                                    placeholder=" Enter Wedding Title"
                                    onChange={handleChange}
                                    className="custom-input"
                                />
                            </div>
                            {/* Ceremony Type Dropdown */}
                            <div className='details-group1'>
                                <select name="wedding_type" id="event-id" value={eventData.wedding_type} onChange={handleChange}>
                                    <option disabled value="">Ceremony type</option>
                                    {weddingTypeOptions.map(wedding_type => (
                                        <option key={wedding_type.id} value={wedding_type.id}>{wedding_type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='addEventHr'></div>
                            <label className="country-deets" htmlFor="country-details">{churchDetailsLabel}</label>
                            {/* County 1 Dropdown */}
                            <div className='details-group1'>
                                <select name="county1" id="county1" value={eventData.county1} onChange={handleChange}>
                                    <option disabled key="" value="">Select County</option>
                                    {counties.map(county1 => (
                                        <option key={county1.id} value={county1.id}>{county1.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Venue 1 Dropdown */}
                            <div className='details-group1'>
                                <select name="venue1" id="venue_1" value={eventData.venue1} onChange={handleChange}>
                                    <option disabled key="" value="">Select Venue</option>
                                    {venues1.map(venue1 => (
                                        <option key={venue1.id} value={venue1.id}>{venue1.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Venue 1 Address Fields */}
                            <div className='details-group1'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_address1"
                                        id="venue1_address1"
                                        placeholder=" Address line 1"
                                        onChange={handleChange}
                                        value={eventData.venue1_address1 || ''}
                                        readOnly
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            <div className='details-group1'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_address2"
                                        id="venue1_address2"
                                        placeholder=" Address line 2"
                                        onChange={handleChange}
                                        value={eventData.venue1_address2 || ''}
                                        readOnly
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            <div className='details-group1'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_address3"
                                        id="venue1_address3"
                                        placeholder=" Address line 3"
                                        onChange={handleChange}
                                        value={eventData.venue1_address3 || ''}
                                        readOnly
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            <div className='details-group1'>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="venue1_zip"
                                        id="venue1_zip"
                                        placeholder=" Zip code"
                                        onChange={handleChange}
                                        value={eventData.venue1_zip || ''}
                                        readOnly
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            {/* Venue 1 Time Input */}
                            <div className='details-group1'>
                                <label htmlFor="venue_1_time">Enter time</label>
                                <input type="time" id="venue_1_time" name="venue_1_time" onChange={handleChange} required className="custom-input" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='event-details-container host-form2'>
                    <form className='host-form' onSubmit={handleSubmit}>
                        {/* Venue Details Label */}
                        <label className="Venue-deets" htmlFor="venue-details">Venue details</label>
                        {/* County 2 Dropdown */}
                        <div className='details-group1'>
                            <select name="county2" id="county2-id" value={eventData.county2} onChange={handleChange}>
                                <option disabled key="" value="">Select County</option>
                                {counties.map(county2 => (
                                    <option key={county2.id} value={county2.id}>{county2.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Venue 2 Dropdown */}
                        <div className='details-group1'>
                            <select name="venue2" id="venue2-id" value={eventData.venue2} onChange={handleChange}>
                                <option disabled key="" value="">Select Venue</option>
                                {venues2.map(venue2 => (
                                    <option key={venue2.id} value={venue2.id}>{venue2.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Venue 2 Address Fields */}
                        <div className='details-group1'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="venue2_address1"
                                    id="venue2_address1"
                                    placeholder=" Address line 1"
                                    onChange={handleChange}
                                    value={eventData.venue2_address1 || ''}
                                    readOnly
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className='details-group1'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="venue2_address2"
                                    id="venue2_address2"
                                    placeholder=" Address line 2"
                                    onChange={handleChange}
                                    value={eventData.venue2_address2 || ''}
                                    readOnly
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className='details-group1'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="venue2_address3"
                                    id="venue2_address3"
                                    placeholder=" Address line 3"
                                    onChange={handleChange}
                                    value={eventData.venue2_address3 || ''}
                                    readOnly
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        <div className='details-group1'>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="venue2_zip"
                                    id="venue2_zip"
                                    placeholder=" Zip code"
                                    onChange={handleChange}
                                    value={eventData.venue2_zip || ''}
                                    readOnly
                                    className="custom-input"
                                />
                            </div>
                        </div>
                        {/* Respond by Date Input */}
                        <div className='details-group1'>
                            <label htmlFor="respond_by_date">Respond by date</label>
                            <input type="date" id="respond_by_date" name="respond_by_date" onChange={handleChange} className="custom-input" />
                        </div>
                        {/* Time Input */}
                        <div className='details-group1'>
                            <label htmlFor="time">Enter wedding time</label>
                            <input type="time" id="time" name="time" onChange={handleChange} required className="custom-input" />
                        </div>
                        {/* Date Input */}
                        <div className='details-group1'>
                            <label htmlFor="date">Enter wedding date</label>
                            <input type="date" id="date" name="date" onChange={handleChange} className="custom-input" />
                        </div>
                        {/* Submit Button */}
                        <div className='event-details-buttoncontainer'>
                            <button className='createEvent-button' type="submit">Add event</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}