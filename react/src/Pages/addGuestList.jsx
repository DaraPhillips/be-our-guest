import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './addGuestList.css';

import SvgName from '../Icons/Name';
import EmailIcon from '../Icons/EmailIcon';
import SvgClosedEye from '../Icons/SvgClosedEye';
import SvgEye from '../Icons/SvgEye';
import SvgPassword from '../Icons/Password';
import SvgGuests from '../Icons/SvgGuests';
import SvgDelete from '../Icons/SvgDelete'; // Import the delete icon

const inputFields = [
  { name: 'firstName', placeholder: 'First Name', icon: <SvgName /> },
  { name: 'lastName', placeholder: 'Last Name', icon: <SvgName /> },
  { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
  { name: 'password', placeholder: 'Password', isPassword: true, icon: <SvgPassword /> },
];

export default function AddGuestList() {
  const [showPassword, setShowPassword] = useState(false);
  const [nearlyWedInfo, setNearlyWedInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [nearlyWedErrors, setNearlyWedErrors] = useState({});
  const [guestErrors, setGuestErrors] = useState({});
  const [guestList, setGuestList] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState('');

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event, type) => {
    const { name, value } = event.target;
    if (type === 'nearlyWed') {
      setNearlyWedInfo((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      validateField(name, value, 'nearlyWed');
    } else {
      setGuestInfo((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      validateField(name, value, 'guest');
    }
  };

  const validateField = (name, value, type) => {
    let errorMessage = '';

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value) {
          errorMessage = 'Name is required';
        } else if (!/^[a-zA-Z]+$/.test(value)) {
          errorMessage = 'Name cannot contain numbers or special characters';
        }
        break;
      case 'email':
        if (!value) {
          errorMessage = 'Email is required';
        } else if (!isValidEmail(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          errorMessage = 'Password is required';
        } else if (value.length < 8 || !isValidPassword(value)) {
          errorMessage = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number (e.g., Ddd1234!)';
        }
        break;
      default:
        break;
    }

    if (type === 'nearlyWed') {
      setNearlyWedErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    } else {
      setGuestErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }

    // Clear the error message after 3 seconds
    setTimeout(() => {
      if (type === 'nearlyWed') {
        setNearlyWedErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      } else {
        setGuestErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }, 3500);
  };

  const handleAddNearlyWed = () => {
    const { firstName, lastName, email } = nearlyWedInfo;
    const fullName = `${firstName} ${lastName}`;

    // Add nearly-wed to guest list
    setGuestList((prevGuestList) => [...prevGuestList, fullName]);
    setNearlyWedInfo({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };

  const handleAddGuest = () => {
    const { firstName, lastName, email } = guestInfo;
    const fullName = `${firstName} ${lastName}`;

    // Add guest to guest list
    setGuestList((prevGuestList) => [...prevGuestList, fullName]);
    setGuestInfo({
      firstName: '',
      lastName: '',
      email: '',
    });
  };

  const handleDeleteGuest = (index) => {
    const updatedGuestList = [...guestList];
    updatedGuestList.splice(index, 1); // Remove the guest at the specified index
    setGuestList(updatedGuestList);
  };

  const isValidEmail = (email) => {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Regular expression for validating password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div className='weddingDetails-page addGuestList'>
      <div className='breadcrumb-container'>
        <Link to="/dashboard" className='dash-breadcrumb'>Dashboard / </Link>
        <h3 className='currentPage-breadcrumb'>My Guest List</h3>
      </div>

      <div className='addGuestDetails-container'>
        <form className='host-form'>
          <div className="form-column">
            <label className="addG-heading" htmlFor="venue-details">Nearly-wed 2</label>
            <div className='details-group'>
              {inputFields.map((field, index) => (
                <div key={index} className='input-group'>
                  <div className='icon'>{field.icon}</div>
                  <input
                    type={field.isPassword ? (showPassword ? 'text' : 'password') : 'text'}
                    name={field.name}
                    id={`${field.name}-id-nearly-wed`}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, 'nearlyWed')}
                    value={nearlyWedInfo[field.name]} // Bind value to form data
                    required  // Add required attribute
                  />
                  {/* Eye icon for password visibility toggle */}
                  {field.isPassword && (
                    <div className="icon" onClick={handleTogglePassword}>
                      {showPassword ? <SvgEye /> : <SvgClosedEye />}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Error messages for nearly-wed */}
            {Object.keys(nearlyWedErrors).map((fieldName) => (
              <p key={fieldName} className={`error ${nearlyWedErrors[fieldName] ? 'visible' : 'hidden'}`}>{nearlyWedErrors[fieldName]}</p>
            ))}
            {/* Button at the bottom of the nearly-wed column */}
            <button className='addNearlyWed-button' type="button" onClick={handleAddNearlyWed}>Add Nearly-Wed</button>
          </div>

          <div className="form-column">
            <label className="addG-heading">Guest Details</label>
            <div className='details-group'>
              {inputFields.slice(0, 2).map((field, index) => (
                <div key={index} className='input-group'>
                  <div className='icon'>{field.icon}</div>
                  <input
                    type='text'
                    name={field.name}
                    id={`${field.name}-id-guest`}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, 'guest')}
                    value={guestInfo[field.name]} // Bind value to form data
                    required  // Add required attribute
                  />
                </div>
              ))}
              <div className='input-group'>
                <div className='icon'><EmailIcon /></div>
                <input
                  type='email'
                  name='email'
                  id='email-id-guest'
                  placeholder='Email'
                  onChange={(e) => handleChange(e, 'guest')}
                  value={guestInfo.email} // Bind value to form data
                  required  // Add required attribute
                />
              </div>
              {/* Error messages for guest details */}
              {Object.keys(guestErrors).map((fieldName) => (
                <p key={fieldName} className={`error ${guestErrors[fieldName] ? 'visible' : 'hidden'}`}>{guestErrors[fieldName]}</p>
              ))}
              <button className='addGuest-button' type="button" onClick={handleAddGuest}>Add Guest</button>
            </div>
          </div>

          <div className="form-column">
            <label className="addG-heading">Guest List</label>
            <div className='details-group'>
              <select id="guest-list" name="guest-list" value={selectedGuest} onChange={(e) => setSelectedGuest(e.target.value)}>
                {/* Render guest list options */}
                {guestList.map((guest, index) => (
                  <option key={index} value={guest}>{guest}</option>
                ))}
              </select>
              {/* Render delete button for each guest */}
              {guestList.map((guest, index) => (
                <button className='deleteGuestIcon' key={index} onClick={() => handleDeleteGuest(index)}>
                  <SvgDelete />
                </button>
              ))}
            </div>
            <SvgGuests color="#9093A3" />
            <div className='invitation-button-container'>
              <button className='SendLinks-button' type="submit">Send Invitations</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}