////import './createEventStyle.css'


////export default function createEvent(){


////return(
////<div className='weddingDetails-page'>

////<div className='topyoke'>
////<h3 className='home-tab-top-thingy'>Home / </h3> <h3 className='other-tab-at-top'>My Events</h3>
////</div>

////<div className='wedding-details-header'>
////   <h1>Wedding Details</h1>
////</div>

////{/* HOST DETAILS */}

////<div className='event-col1'>

////<div className='event-details-container'>

////<form className='host-form'>

////<div className='bride-group'>

////<label htmlFor="username">Nearly-wed</label>
////<div className='details-group'>
////<input type="text" name="bride-firstName" id="bride-firstName" placeholder=" First Name" />
////</div>
////<div className='details-group'>
////<input type="text" name="bride-lastName" id="bride-lastName" placeholder=" Last Name" />
////</div>
////<div className='details-group'>
////<input type="text" name="bride-email" id="bride-email" placeholder=" Email" />
////</div>
////<div className='details-group'>
////<input type="password" name="bride-password" id="bride-password" placeholder=" Password" />
////</div>
////</div>

////<div className='groom-group'>
////<label htmlFor="username">Nearly-wed</label>
////<div className='details-group'>
////<input type="text" name="groom-firstName" id="groom-firstName" placeholder=" First Name" />
////</div>

////<div className='details-group'>
////<input type="text" name="groom-lastName" id="groom-lastName" placeholder=" Last Name" />
////</div>
////<div className='details-group'>
////<input type="text" name="groom-email" id="groom-email" placeholder=" Email" />
////</div>
////<div className='details-group'>
////<input type="password" name="groom-password" id="groom-password" placeholder=" Password" />
////</div>




////</div>

////</form>
////</div>

////{/* VENUE DETAILS */}

////<div className='event-details-container'>
////<form className='venue-form'>

////<label htmlFor="venue-details">Venue details</label>

////<div className='details-group'>
////<input type="text" name="country-id" id="country-id" placeholder=" Country" />
////</div>

////<div className='details-group'>
////<input type="text" name="venue-id" id="venue-id" placeholder=" Venue" />
////</div>

////<div className='details-group'>
////<input type="text" name="address1-id" id="address1-id" placeholder=" Address line 1" />
////</div>
////<div className='details-group'>
////<input type="text" name="address2-id" id="address2-id" placeholder=" Address line 2" />
////</div>
////<div className='details-group'>
////<input type="text" name="address3-id" id="address3-id" placeholder=" Address line 3" />
////</div>

////<div className='details-group'>
////<input type="text" name="zip-id" id="Zip-id" placeholder=" Zip code" />
////                    </div>
////                    <label htmlFor="username">Enter Time</label>
////                    <div className='details-group'>
////                        <input type="time" id="startTime" name="appt" min="00:00" max="24:00" required />
////                    </div>

////                    <label htmlFor="username">Enter Date  </label>
////                    <div className='details-group'>
////                        <input type="date" id="startDate" name="datepicker" />
////                    </div>

////                    <label htmlFor="username">Respond by Date </label>

////                    <div className='details-group'>

////                        <input type="date" id="respondbyDate" name="datepicker" />

////                    </div>

////</form>
////</div>


////<div className='event-details-buttoncontainer'>
////<button className='createEvent-button'>Create event </button>
////   </div>

////   </div>

////</div>







////)




////}


//import React from 'react';
//import './createEventStyle.css';

//export default function createEvent() {
//    return (
//        <div className='weddingDetails-page'>

//            <div className='topyoke'>
//                <h3 className='home-tab-top-thingy'>Home / </h3> <h3 className='other-tab-at-top'>My Events</h3>
//            </div>

//            <div className='wedding-details-header'>
//                <h1>Wedding Details</h1>
//            </div>

//            {/* HOST DETAILS */}

//            <div className='event-col1'>

//                <div className='event-details-container'>

//                    <form className='host-form'>

//                        <div className='bride-group'>

//                            <label htmlFor="username">Nearly-wed</label>
//                            <div className='details-group'>
//                                <input type="text" name="bride-firstName" id="bride-firstName" placeholder=" First Name" />
//                            </div>
//                            <div className='details-group'>
//                                <input type="text" name="bride-lastName" id="bride-lastName" placeholder=" Last Name" />
//                            </div>
//                            <div className='details-group'>
//                                <input type="text" name="bride-email" id="bride-email" placeholder=" Email" />
//                            </div>
//                            <div className='details-group'>
//                                <input type="password" name="bride-password" id="bride-password" placeholder=" Password" />
//                            </div>
//                        </div>

//                        <div className='groom-group'>
//                            <label htmlFor="username">Nearly-wed</label>
//                            <div className='details-group'>
//                                <input type="text" name="groom-firstName" id="groom-firstName" placeholder=" First Name" />
//                            </div>

//                            <div className='details-group'>
//                                <input type="text" name="groom-lastName" id="groom-lastName" placeholder=" Last Name" />
//                            </div>
//                            <div className='details-group'>
//                                <input type="text" name="groom-email" id="groom-email" placeholder=" Email" />
//                            </div>
//                            <div className='details-group'>
//                                <input type="password" name="groom-password" id="groom-password" placeholder=" Password" />
//                            </div>
//                        </div>

//                    </form>
//                </div>

//                {/* VENUE DETAILS */}

//                <div className='event-details-container'>
//                    <form className='venue-form'>

//                        <label htmlFor="venue-details">Venue details</label>

//                        <div className='details-group'>
//                            <input type="text" name="country-id" id="country-id" placeholder=" Country" />
//                        </div>

//                        <div className='details-group'>
//                            <input type="text" name="venue-id" id="venue-id" placeholder=" Venue" />
//                        </div>

//                        <div className='details-group'>
//                            <input type="text" name="address1-id" id="address1-id" placeholder=" Address line 1" />
//                        </div>
//                        <div className='details-group'>
//                            <input type="text" name="address2-id" id="address2-id" placeholder=" Address line 2" />
//                        </div>
//                        <div className='details-group'>
//                            <input type="text" name="address3-id" id="address3-id" placeholder=" Address line 3" />
//                        </div>

//                        <div className='details-group'>
//                            <input type="text" name="zip-id" id="Zip-id" placeholder=" Zip code" />
//                        </div>
//                        <label htmlFor="username">Enter Time</label>
//                        <div className='details-group'>
//                            <input type="time" id="startTime" name="appt" min="00:00" max="24:00" required />
//                        </div>

//                        <label htmlFor="username">Enter Date  </label>
//                        <div className='details-group'>
//                            <input type="date" id="startDate" name="datepicker" />
//                        </div>

//                        <label htmlFor="username">Respond by Date </label>

//                        <div className='details-group'>

//                            <input type="date" id="respondbyDate" name="datepicker" />

//                        </div>

//                    </form>
//                </div>


//                <div className='event-details-buttoncontainer'>
//                    <button className='createEvent-button'>Create event </button>
//                </div>

//            </div>

//        </div>
//    );
//}

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './createEventStyle.css';
import axios from 'axios';


export default function CreateEvent() {
    const [eventData, setEventData] = useState({
        brideFirstName: '',
        brideLastName: '',
        brideEmail: '',
        bridePassword: '',
        groomFirstName: '',
        groomLastName: '',
        groomEmail: '',
        groomPassword: '',
        country: '',
        venue: '',
        address1: '',
        address2: '',
        address3: '',
        zip: '',
        startTime: '',
        startDate: '',
        respondByDate: ''
    });
    const [eventCreated, setEventCreated] = useState(false);

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

            {/* HOST DETAILS */}

            <div className='event-col1'>

                <div className='event-details-container'>

                    <form className='host-form' onSubmit={handleSubmit}>
                        <div className='bride-group'>
                            <label htmlFor="bride-firstName">Nearly-wed</label>
                            <div className='details-group'>
                                <input type="text" name="brideFirstName" id="bride-firstName" placeholder=" First Name" onChange={handleChange} />
                            </div>
                            <div className='details-group'>
                                <input type="text" name="brideLastName" id="bride-lastName" placeholder=" Last Name" onChange={handleChange} />
                            </div>
                            <div className='details-group'>
                                <input type="text" name="brideEmail" id="bride-email" placeholder=" Email" onChange={handleChange} />
                            </div>
                            <div className='details-group'>
                                <input type="password" name="bridePassword" id="bride-password" placeholder=" Password" onChange={handleChange} />
                            </div>
                        </div>

                        <div className='groom-group'>
                            <label htmlFor="groom-firstName">Nearly-wed</label>
                            <div className='details-group'>
                                <input type="text" name="groomFirstName" id="groom-firstName" placeholder=" First Name" onChange={handleChange} />
                            </div>
                            <div className='details-group'>
                                <input type="text" name="groomLastName" id="groom-lastName" placeholder=" Last Name" onChange={handleChange} />
                            </div>
                            <div className='details-group'>
                                <input type="text" name="groomEmail" id="groom-email" placeholder=" Email" onChange={handleChange} />
                            </div>
                            <div className='details-group'>
                                <input type="password" name="groomPassword" id="groom-password" placeholder=" Password" onChange={handleChange} />
                            </div>
                        </div>

                        {/* VENUE DETAILS */}

                        <label htmlFor="venue-details">Venue details</label>

                        <div className='details-group'>
                            <input type="text" name="country" id="country-id" placeholder=" Country" onChange={handleChange} />
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
                        <label htmlFor="username">Enter Time</label>
                        <div className='details-group'>
                            <input type="time" id="startTime" name="startTime" min="00:00" max="24:00" onChange={handleChange} required />
                        </div>

                        <label htmlFor="username">Enter Date  </label>
                        <div className='details-group'>
                            <input type="date" id="startDate" name="startDate" onChange={handleChange} />
                        </div>

                        <label htmlFor="username">Respond by Date </label>

                        <div className='details-group'>

                            <input type="date" id="respondByDate" name="respondByDate" onChange={handleChange} />

                        </div>

                        <div className='event-details-buttoncontainer'>
                            <button className='createEvent-button' type="submit">Create event </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

