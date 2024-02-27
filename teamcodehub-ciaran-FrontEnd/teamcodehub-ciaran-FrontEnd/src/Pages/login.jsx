import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Import Navigate instead of Redirect
import './login.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Send POST request to login endpoint
            console.log('formData:', formData);
            const response = await axios.post('http://127.0.0.1:8000/login/', formData);
            console.log('Login successful:', response.data);
            // Set loggedIn to true after successful login
            setLoggedIn(true);
        } catch (error) {
            console.error('Error logging in:', error);
            // Handle login error, display error message to user
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // If loggedIn is true, redirect to create_event page
    if (loggedIn) {
        return <Navigate to="/create_event" />; // Use Navigate instead of Redirect
    }

    return (
        <div className='login-form'>
            <div className="form-container">
                <p className="title">Login</p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" placeholder="" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="" value={formData.password} onChange={handleChange} required />
                        <div className="forgot">
                            <a rel="noopener noreferrer" href="#">Forgot your Password?</a>
                        </div>
                    </div>
                    <button className="sign" id='login-button' type="submit">Login</button>
                </form>
                <p className="signup">Not a member?
                    <a rel="noopener noreferrer" href="/signUp" className="">  Sign up</a>
                </p>
            </div>
        </div>
    );
}
