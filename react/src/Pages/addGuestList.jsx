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
  { name: 'first_name', placeholder: 'First Name', icon: <SvgName /> },
  { name: 'last_name', placeholder: 'Last Name', icon: <SvgName /> },
  { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
  { name: 'password', placeholder: 'Password', isPassword: true, icon: <SvgPassword /> },
];

export default function AddGuestList() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [nearlyWedInfo, setNearlyWedInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [guestInfo, setGuestInfo] = useState({
    first_name: '',
    last_name: '',
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
      console.log(`Updating guestInfo.${name} with value: ${value}`);
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
      case 'first_name':
      case 'last_name':
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
    const { first_name, last_name, email } = nearlyWedInfo;
    const fullName = `${first_name} ${last_name}`;

    // Add nearly-wed to guest list
    setGuestList((prevGuestList) => [...prevGuestList, fullName]);
    setNearlyWedInfo({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    });
  };

  const handleAddGuest = () => {
  const { first_name, last_name, email } = guestInfo;
  const fullName = `${first_name} ${last_name}`;

  // Create a guest object with individual properties
  const newGuest = {
    firstName: first_name,
    lastName: last_name,
    email: email, // Use the email from guestInfo
  };

  // Add the guest object to the guestList
  setGuestList((prevGuestList) => [...prevGuestList, newGuest]);
    // setGuestInfo({
    //   first_name: '',
    //   last_name: '',
    //   email: '',
    // });
  };

  const handleSendInvitations = async (e) => {
   e.preventDefault();

  // No need to split guest objects
  const guestData = guestList.map((guest) => ({
    email: guest.email,
    first_name: guest.firstName,
    last_name: guest.lastName,
  }));

  console.log('guests:', guestData);
  
    // Send API request to send password email (or invitations)
    const response = await fetch('http://127.0.0.1:8000/send-password-email/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients: guestData }), // Array with guest data objects
    });
  
    const data = await response.json();
  
    if (data.message) {
      // Handle successful email sending
      console.log('Invitations sent successfully:', data.message);
      setGuestList([]); // Clear guest list after successful sending
    } else if (data.error) {
      // Handle potential errors from the API
      console.error('Error sending invitations:', data.error, guestData);
    }
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
                    // required  // Add required attribute
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
                    // required  // Add required attribute
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
                  // required  // Add required attribute
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
            <label className="addG-heading"> Guest List</label>
              <div className='details-group'>
                {/* Render guest list items */}
                {guestList.map((guest, index) => (
                  <div key={index} className='guest-item'>
                    <span>{guest.firstName} {guest.lastName}</span>
                    {<span>{guest.email}</span>}
                    <button className='deleteGuestIcon' key={index} onClick={() => handleDeleteGuest(index)}>
                      <SvgDelete />
                    </button>
                  </div>
                ))}
            </div>
            <SvgGuests color="#9093A3" />
            <div className='invitation-button-container'>
              <button className='SendLinks-button' type="submit" onClick={handleSendInvitations}>Send Invitations</button>
            </div>
          </div>
        </form>
=======
import SvgPassword from '../Icons/Password';

const inputFields = [
  { name: 'firstName', placeholder: 'First Name', icon: <SvgName /> },
  { name: 'lastName', placeholder: 'Last Name', icon: <SvgName /> },
  { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
  { name: 'password', placeholder: 'Password', icon: <SvgPassword />, isPassword: true },
];

export default function AddGuestList() {
  return (
    <div className='weddingDetails-page addGuestList'>
      <div className='topyoke'>
        <Link to="/dashboard" className='home-tab-top-thingy'>Dashboard / </Link>
        <h3 className='other-tab-at-top'>My Guest List</h3>
      </div>

      <div className='event-col1'>
        <div className='guests-container'>
          <form className='host-form'>
            <div className="form-column">
              {/* Column 1 */}
              <label className="Venue-deets" htmlFor="venue-details">Nearly-wed 2</label>
              <div className='details-group'>
                {inputFields.map((field, index) => (
                  <div key={index} className='input-group'>
                    <div className='icon'>{field.icon}</div>
                    <input
                      type={field.isPassword ? 'password' : 'text'}
                      name={field.name}
                      id={`${field.name}-id`}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              <label className="Venue-deets" htmlFor="venue-details">Guest Details</label>

              {/* Address fields */}
              <div className='details-group'>
                <input
                  type="text"
                  name="firstName"
                  id="firstName-id"
                  placeholder=" First Name"
                />
              </div>
              <div className='details-group'>
                <input
                  type="text"
                  name="lastName"
                  id="lastName-id"
                  placeholder=" Last Name"
                />
              </div>
              <div className='details-group'>
                <input
                  type="email"
                  name="email"
                  id="email-id"
                  placeholder=" Email"
                />
              </div>

              <div className='event-details-buttoncontainer'>
                <button className='createEvent-button' type="submit">Add Guest</button>
              </div>
            </div>

            {/*Column 2*/}
            <div className="form-column">
              <label className="Venue-deets">Guest List</label>
              <div className='details-group'>
                <select id="guest-list" name="guest-list">
                  <option value="Guests">Added Guests</option>
                </select>
              </div>

              <div className='event-details-buttoncontainer'>
                <button className='SendLinks-button' type="submit">Send Invitations</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}