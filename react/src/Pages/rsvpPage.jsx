import { Link } from 'react-router-dom';
import './rsvpPageStyleSheet.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RsvpPage() {
    const [eventDetails, setEventDetails] = useState([]);
    const eventId = 46; // Replace 1 with the actual event ID you want to fetch
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/event-invitation/${eventId}/`);
                setEventDetails(response.data);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEventDetails();
    }, [eventId]);
    const handleAcceptInvitation = async () => {
        try {
            // Make a PUT/PATCH request to update is_attending to true
            await axios.patch(`http://127.0.0.1:8000/api/event-invitation/${eventId}/`, { is_attending: true });
            // Update the local state
            setEventDetails(prevState => ({ ...prevState, is_attending: true }));
        } catch (error) {
            console.error('Error updating is_attending:', error);
        }
    };

    const handleDeclineInvitation = async () => {
        try {
            // Make a PUT/PATCH request to update is_attending to false
            await axios.patch(`http://127.0.0.1:8000/api/event-invitation/${eventId}/`, { is_attending: false });
            // Update the local state
            setEventDetails(prevState => ({ ...prevState, is_attending: false }));
        } catch (error) {
            console.error('Error updating is_attending:', error);
        }
    };

    return (
        <div className='rsvpPage-Main'>
            <div className='breadcrumb-container-invite'>
                <Link to="/dashboard" className='breadcrumb'>Dashboard / </Link>
                <Link to="/invitations" className='breadcrumb'>My Invitations / </Link>
                <h3 className='breadcrumb'>{eventDetails.event_wedding_title}</h3>
            </div>

            {/* EVENT DETAILS BOX */}

            <div className='rsvp-boxesWrap'>
                <div className='rsvp-eventDetailsBox'>
                    <div className='rsvp-eventDetailsList'>
                        <div className='rsvp-hostNames'>
                            <h2>{eventDetails.event_wedding_title}</h2>
                        </div>
                        <h3>Date Of Wedding: {eventDetails.event_date}</h3>
                        <h3>Respond By Date: {eventDetails.event_respond_by_date}</h3>

                        <h3>{eventDetails.venue_1 && eventDetails.venue_1.name}</h3>
                        <p>{eventDetails.venue_1 && eventDetails.venue_1.address1}, 
                        {eventDetails.venue_1 && eventDetails.venue_1.address2}, 
                        {eventDetails.venue_1 && eventDetails.venue_1.address3}, 
                        {eventDetails.venue_1 && eventDetails.venue_1.county && eventDetails.venue_1.county.name},
                        {eventDetails.venue_1 && eventDetails.venue_1.zipcode}</p>
                        <h3>Time for above location: {eventDetails.event_venue_1_time}</h3>

                        <h3>{eventDetails.venue_2 && eventDetails.venue_2.name}</h3>
                        <p>{eventDetails.venue_2 && eventDetails.venue_2.address1},
                        {eventDetails.venue_2 && eventDetails.venue_2.address2},
                        {eventDetails.venue_2 && eventDetails.venue_2.address3}, 
                        {eventDetails.venue_2 && eventDetails.venue_2.county && eventDetails.venue_2.county.name},
                        {eventDetails.venue_2 && eventDetails.venue_2.zipcode}</p>
                        <h3>Time for above location: {eventDetails.event_venue_2_time}</h3>

                        <h3>You Are Currently {eventDetails.is_attending ? "Attending" : "Not Attending"} This Event</h3>

                    </div>
                    <div className='rsvp-eventDetailsButtonCon'>
                        <button className='rsvp-Button' id='rsvp-acceptInvitation' onClick={handleAcceptInvitation}><img src='/src/images/acceptButtonIMG.png' /> Accept </button>
                        <button className='rsvp-Button' id='rsvp-declineInvitation' onClick={handleDeclineInvitation}><img src='/src/images/declineButtonIMG.png' /> Decline </button>
                    </div>
                </div>

                {/* INPUT BOX */}
                <div className='rsvp-rightBoxes'>
                    <div className='rsvp-inputboxMain'>
                        <div className='rsvpnamesInput'>
                            <h2>Message for the nearly-weds</h2>
                        </div>
                        <div className='rsvpInput'>
                            <input className='rsvp-brideGroomInput' placeholder='Leave a message..' id='rsvp-messageHost'></input>
                        </div>
                        <div className='rsvp-CancelSendButtons'>
                            <button className='rsvpInputCancel'> Cancel </button>
                            <button className='rsvpInputSend' id='rsvp-sendMessage'> Send </button>
                        </div>
                    </div>

                    {/* SEND GIFT BOX */}
                    <div className='rsvp-giftBox'>
                        <div className='rsvp-sendGiftText'>
                            <h2>Send a gift </h2><img className='rsvpGiftImg' src='/src/images/rsvpGiftIMG.png' />
                        </div>
                        <div className='rsvpInput'>
                            <input className='rsvp-giftAmountInput' placeholder='Enter Amount' id='rsvp-giftAmount'></input>
                        </div>
                        <div className='rsvp-CancelSendButtons'>
                            <button className='rsvpInputCancel'> Cancel </button>
                            <button className='rsvpInputSend' id='rsvp-sendGift'> Send </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}