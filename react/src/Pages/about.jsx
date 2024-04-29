import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './about.css';
 
export default function about() {
    return (
 
 
        <div className='about-page'>

            <div className='fun'>
            <img src='../src/images/fun.png' alt="Wedding" className="wedding-image" />
            </div>

            <div className='breadcrumb-container'>
                <Link to="/home" className='breadcrumb'>Home / </Link>
                <h3 className='currentPage-breadcrumb'>About</h3>
            </div>
 
            <div className='about-title'>
                <h1 id='title'>Welcome to Be Our Guest - Elevating Wedding Connections!</h1>
            </div>
 
            <div className='centered-container'>
                <div className='about-box'>
                    <div className='about-text'>
                        <h2 style={{ whiteSpace: 'pre-line' }}>
                            At Be Our Guest, we are on a mission to{'\n'}
                            transform weddings into unforgettable{'\n'}
                            experiences for every attendee. Whether{'\n'}
                            you're a proud parent, a distant cousin, a{'\n'}
                            long-lost sibling, or a new friend, we are{'\n'}
                            dedicated to fostering meaningful{'\n'}
                            connections among all participants. Our{'\n'}
                            goal is to ensure that no one feels alone{'\n'}
                            or awkward in the midst of celebration.
                        </h2>
                    </div>
                </div>
            </div>
 
            <div className='about-title'>
                <h1>Our Team</h1>
            </div>
 
            <div className='centered-container'>
                <div className='about-box'>
                    <div className='about-text'>
                        <div className='lists-container'>
                            <div className='left-list'>
                                <h2>Front End</h2>
                                <ul>
                                    <li><span style={{ color: '#02092D', fontSize: '1.3em' }}>Product Owner</span> - </li>
                                    <li><span style={{ color: '#02092D', fontSize: '1.3em' }}>UX Designer</span> - Dara Phillips</li>
                                    <li><span style={{ color: '#02092D', fontSize: '1.3em' }}>UI Developer</span> - Dylan Stewart</li>
                                </ul>
                            </div>
                            <div className='right-list'>
                                <h2>Back End</h2>
                                <ul>
                                    <li><span style={{ color: '#02092D', fontSize: '1.3em' }}>Application Architect</span> - <span>Mark Malloy</span></li>
                                    <li><span style={{ color: '#02092D', fontSize: '1.3em' }}>API Engineer</span> - <span>Ciaran O'Connor</span></li>
                                    <li><span style={{ color: '#02092D', fontSize: '1.3em' }}>Data Architect</span> - <span>Steven Nolan</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}