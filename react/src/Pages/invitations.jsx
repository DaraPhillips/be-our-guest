
import { SvgInvYes } from '../Icons/SvgInvYes';
import { SvgInvNo } from '../Icons/SvgInvNo';
import { SvgChat } from '../Icons/SvgChat';
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './invitationsStyle.css';


export default function CreateEvent() {

    
    
    return (
        <div className='invitations-page'>

            <div className='topyoke'>
                <h3 className='home-tab-top-thingy'>Dashboard / </h3>
                <h3 className='home-tab-top-thingy'> My Invitations / </h3>

                <h3 className='other-tab-at-top'> Page 1</h3>
            </div>

            <div className='wedding-details-header'>

                <h1>My Invitations</h1>

                {/* TOP ROW */}

                <div className='top-boxes'>

                    <div className='my-invBox'>
                    <Link to="/rsvpPage" className="inv-button-link">

                        <button className='inv-button'>
                        <img className='inv-button-background' src="/react/src/images/homeLoggedInBackground.jpg"  />

                            <ul>
                           <li><h4>Wedding Title</h4></li>
                           <li><h4>Location</h4></li>
                            <li><h5>@Location</h5></li>
                            <li><h5>Date</h5></li>
                            </ul>
                            <div className="inv-icons">
                                <div className="inv-icon">
                                    <SvgInvYes />
                                </div>
                                <div className="inv-icon" >
                                <Link to="/rsvpPage"/>
                                    <SvgChat />
                                </div>
                                <div className="inv-icon">
                                    <SvgInvNo />
                                </div>
                            </div>
                        </button>
                        
                        </Link>
                    </div>

                    <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>
                    <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>
                    <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>









                </div>

                {/* BOTTOM ROW */}

                <div className='second-row'>


                <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>
                    <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>
                    <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>
                    <div className='my-invBox'>
                        <button className='inv-button'></button>
                    </div>


                </div>


            </div>

        </div>























    )


}