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




//DARA's register with confirm password and client valadation 

//import React, { useState } from 'react';
//import axios from 'axios';
//import validator from 'validator';
//import './signupStyle.css';
//import SvgName from '../Icons/Name';
//import EmailIcon from '../Icons/EmailIcon';
//import SvgPassword from '../Icons/Password';
//import SvgConfirmPassword from '../Icons/ConfirmPw';
//import { Link, useHistory } from 'react-router-dom';

//export default function SignUp() {
//    const history = useHistory();
//    const [formData, setFormData] = useState({
//        firstName: '',
//        lastName: '',
//        email: '',
//        password: '',
//        confirmPassword: '',
//    });

//    const [errors, setErrors] = useState({});

//    const inputFields = [
//        { name: 'firstName', placeholder: 'First Name', icon: <SvgName /> },
//        { name: 'lastName', placeholder: 'Last Name', icon: <SvgName /> },
//        { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
//        { name: 'password', placeholder: 'Password', icon: <SvgPassword /> },
//        { name: 'confirmPassword', placeholder: 'Confirm Password', icon: <SvgConfirmPassword /> },
//    ];

//    const validateForm = () => {
//        let isValid = true;
//        const newErrors = {};

//        if (!validator.isEmail(formData.email)) {
//            newErrors.email = 'Invalid email address';
//            isValid = false;
//        }

//        for (const key in formData) {
//            if (!formData[key]) {
//                newErrors[key] = 'This field is required';
//                isValid = false;
//            }
//        }

//        if (formData.password !== formData.confirmPassword) {
//            newErrors.confirmPassword = 'Passwords do not match';
//            isValid = false;
//        }

//        setErrors(newErrors);
//        return isValid;
//    };

//    const handleSubmit = async (event) => {
//        event.preventDefault();

//        if (validateForm()) {
//            try {
//                const response = await axios.post('http://127.0.0.1:8000/register/', formData);
//                console.log('Signup successful:', response.data);

//                // Redirect to the login page upon successful registration
//                history.push('/login');
//            } catch (error) {
//                console.error('Error signing up:', error);
//            }
//        }
//    };

//    const handleChange = (event) => {
//        const { name, value } = event.target;
//        setFormData((prevData) => ({
//            ...prevData,
//            [name]: name === 'email' ? value.toLowerCase() : value,
//        }));

//        setErrors((prevErrors) => ({
//            ...prevErrors,
//            [name]: undefined,
//        }));
//    };

//    return (
//        <div className='signUp-form'>
//            <div className="form-container">
//                <p className="title">Sign up</p>
//                <form className="form" onSubmit={handleSubmit}>
//                    {inputFields.map(({ name, placeholder, icon }) => (
//                        <div key={name} className="input-group">
//                            <label htmlFor={name}></label>
//                            <div className="input-container">
//                                <div className="icon">{icon}</div>
//                                <input
//                                    type={name === 'password' || name === 'confirmPassword' ? 'password' : 'text'}
//                                    name={name}
//                                    id={name}
//                                    placeholder={placeholder}
//                                    value={formData[name]}
//                                    onChange={handleChange}
//                                    required
//                                />
//                            </div>
//                            {errors[name] && <span className="error">{errors[name]}</span>}
//                        </div>
//                    ))}
//                    <button className="sign" id='signup-button' type='submit'>Sign up</button>
//                </form>
//                <p className="signup">Already a member?<Link to="/login"> Log in</Link></p>
//            </div>
//        </div>
//    );
//}
