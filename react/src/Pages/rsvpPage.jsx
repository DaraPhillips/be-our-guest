import { Link } from 'react-router-dom';
import './rsvpPageStyleSheet.css'
import React, { useState, useEffect } from 'react';

export default function rsvpPage() {

    

    return (
        <div className='rsvpPage-Main'>
            <div className='breadcrumb-container-invite'>
            <Link to="/dashboard" className='breadcrumb'>Dashboard / </Link>
            <Link to="/invitations" className='breadcrumb'>My Invitations / </Link>
            <h3 className='breadcrumb'><span className='names'>Wedding Title</span> </h3>
            </div>

            {/* EVENT DETAILS BOX */}

            <div className='rsvp-boxesWrap'>
                <div className='rsvp-eventDetailsBox'>
                    <div className='rsvp-eventDetailsList'>

                        <div className='rsvp-hostNames'>
                            <h2>Wedding title</h2>
                        </div>
                        <h3>County description</h3>
                        <h3>Venue description</h3>
                        <h3>Date</h3>

                    </div>

                    <div className='rsvp-eventDetailsButtonCon'>
                        <button className='rsvp-Button' id='rsvp-acceptInvitation'><img src='/src/images/acceptButtonIMG.png' /> Accept </button>
                        <button className='rsvp-Button' id='rsvp-declineInvitation'><img src='/src/images/declineButtonIMG.png' /> Decline </button>
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