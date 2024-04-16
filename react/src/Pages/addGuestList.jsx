import React from 'react';
import { Link } from 'react-router-dom';
import './addGuestList.css';

import SvgName from '../Icons/Name';
import EmailIcon from '../Icons/EmailIcon';
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