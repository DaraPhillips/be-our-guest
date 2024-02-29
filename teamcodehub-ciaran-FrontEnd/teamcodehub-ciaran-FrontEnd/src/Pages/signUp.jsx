import React, { useState } from 'react';

import { Navigate } from 'react-router-dom';

import './signupStyle.css'
import axios from 'axios';




export default function signUp() {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [registered, setRegistered] = useState(false);

    // Event handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send POST request to Django backend
            const response = await axios.post('http://127.0.0.1:8000/register/', formData);
            console.log('Signup successful:', response.data);
            // Optionally redirect to login page or show a success message
            setRegistered(true);
        } catch (error) {
            console.error('Error signing up:', error);
            // Optionally show an error message
        }
    };


    // Event handler for input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    if (registered) {
        return <Navigate to="/login" />;
    }


    return (


        <div className='signUp-form'>
            <div className="form-container">
                <p className="title">Sign Up</p>
                <form className="form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="first-name">First Name</label>
                        <input type="text" name="firstName" id="firstName" placeholder="" value={formData.firstName}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="last-name">Last Name</label>
                        <input type="text" name="lastName" id="lastName" placeholder="" value={formData.lastName}
                            onChange={handleChange}
                            required />
                    </div>


                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" placeholder="" value={formData.email}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="" value={formData.password}
                            onChange={handleChange}
                            required />





                    </div>
                    <button className="sign" id='signup-button' type='submit'>Sign Up</button>
                </form>

                <p className="signup">Already a member?
                    <a rel="noopener noreferrer" href="/login" className="">  Log in</a>
                </p>
            </div>
        </div>
    );
}