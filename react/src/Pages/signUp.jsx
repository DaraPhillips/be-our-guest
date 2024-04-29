import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './signupStyle.css';
import SvgName from '../Icons/Name';
import EmailIcon from '../Icons/EmailIcon';
import SvgPassword from '../Icons/Password';
import SvgConfirmPassword from '../Icons/ConfirmPw';
import SvgClosedEye from '../Icons/SvgClosedEye';
import SvgEye from '../Icons/SvgEye';

const inputFields = [
  { name: 'first_name', placeholder: 'First Name', icon: <SvgName /> },
  { name: 'last_name', placeholder: 'Last Name', icon: <SvgName /> },
  { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
  { name: 'password', placeholder: 'Password', icon: <SvgPassword />, isPassword: true },
  { name: 'confirmPassword', placeholder: 'Confirm Password', icon: <SvgConfirmPassword />, isPassword: true },
];

const passwordRules = [
  'Password must be at least 8 characters long',
  'Password must contain at least one uppercase letter',
  'Password must contain at least one lowercase letter',
  'Password must contain at least one number',
];

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let fieldErrors = {};

    // Validate each field and update errors state
    if (!formData.first_name) {
      fieldErrors.first_name = 'First name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.first_name)) {
      fieldErrors.first_name = 'Name should only contain letters';
    }

    if (!formData.last_name) {
      fieldErrors.last_name = 'Last name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.last_name)) {
      fieldErrors.last_name = 'Name should only contain letters';
    }

    if (!formData.email || !emailRegex.test(formData.email.toLowerCase())) {
      fieldErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      fieldErrors.password = 'Password is required';
    } else if (
      !/(?=.*[a-z])/.test(formData.password) ||
      !/(?=.*[A-Z])/.test(formData.password) ||
      !/(?=.*[0-9])/.test(formData.password) ||
      formData.password.length < 8
    ) {
      fieldErrors.password =
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number (e.g. Aaa1234!)';
    }

    if (formData.password !== formData.confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match';
    }

    // If there are errors, don't proceed with submission
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    console.log('User entered first name:', formData.first_name);
  console.log('User entered last name:', formData.last_name);
    try {
      const response = await axios.post('http://127.0.0.1:8000/register/', formData);
      console.log('Signup successful:', response.data);

      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
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
                  type={field.isPassword ? (field.name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : 'text'}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                />
                {/* Eye icon for password visibility toggle */}
                {field.isPassword && (
                  <div className="toggle" onClick={() => field.name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}>
                    {field.name === 'password' ? (showPassword ? <SvgEye /> : <SvgClosedEye />) : (showConfirmPassword ? <SvgEye /> : <SvgClosedEye />)}
                  </div>
                )}
              </div>
              {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
            </div>
          ))}
          {/* Display password rules */}
          {errors.password && (
            <div className="password-rules">
              {passwordRules.map((rule, index) => (
                <p key={index} className="password-rule"></p>
              ))}
            </div>
          )}
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