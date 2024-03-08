import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './signupStyle.css';
import SvgName from '../Icons/Name';
import EmailIcon from '../Icons/EmailIcon';
import SvgPassword from '../Icons/Password';
import SvgConfirmPassword from '../Icons/ConfirmPw';

const inputFields = [
  { name: 'firstName', placeholder: 'First Name', icon: <SvgName /> },
  { name: 'lastName', placeholder: 'Last Name', icon: <SvgName /> },
  { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
  { name: 'password', placeholder: 'Password', icon: <SvgPassword /> },
  { name: 'confirmPassword', placeholder: 'Confirm Password', icon: <SvgConfirmPassword /> },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true); // Set loading to true when submitting

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate each field and update errors state
    let fieldErrors = {};
    if (!formData.firstName) {
      fieldErrors.firstName = 'First name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      fieldErrors.firstName = 'Name should only contain letters';
    }

    if (!formData.lastName) {
      fieldErrors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      fieldErrors.lastName = 'Name should only contain letters';
    }

    if (!formData.email || !emailRegex.test(formData.email.toLowerCase())) {
      fieldErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      fieldErrors.password = 'Password is required';
    }

    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match';
    }

    // If there are errors, don't proceed with submission
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setLoading(false); // Set loading to false on error
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', formData);
      console.log('Signup successful:', response.data);

      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear corresponding error when field changes
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  return (
    <div className="signUp-form">
      <div className="form-container">
        <p className="title">Sign Up</p>
        <form className="form" onSubmit={handleSubmit}>
          {inputFields.map((field) => (
            <div className="input-group" key={field.name}>
              <div className="input-container">
                <div className="icon">{field.icon}</div>
                <input
                  type={(field.name === 'password' || field.name === 'confirmPassword') ? 'password' : 'text'}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                />
              </div>
              {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
            </div>
          ))}
          <button className="sign" id="signup-button" type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="signup">
          Already a member?{' '}
          <Link to="/login" className="">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}