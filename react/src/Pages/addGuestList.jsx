import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './addGuestList.css';
import SvgName from '../Icons/Name';
import EmailIcon from '../Icons/EmailIcon';
import SvgDelete from '../Icons/SvgDelete';
import axios from 'axios';
// Define your inputFields array
const inputFields = [
  { name: 'first_name', placeholder: 'First Name', icon: <SvgName /> },
  { name: 'last_name', placeholder: 'Last Name', icon: <SvgName /> },
  { name: 'email', placeholder: 'Email', icon: <EmailIcon /> },
];
 
// Define your component
export default function AddGuestList() {
  // Define your state variables
  const [nearlyWedInfo, setNearlyWedInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [guestInfo, setGuestInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [nearlyWedErrors, setNearlyWedErrors] = useState({});
  const [guestErrors, setGuestErrors] = useState({});
  const [guestList, setGuestList] = useState([]);
  const [sentGuests, setSentGuests] = useState([]); // New state variable for sent guests
  const [selectedGuestIndex, setSelectedGuestIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendingInvitations, setIsSendingInvitations] = useState(false);
  const [invitationsSent, setInvitationsSent] = useState(false);
  const [isSendInvitationsModalOpen, setIsSendInvitationsModalOpen] = useState(false); // Added state for send invitations confirmation modal
 
  // Ref to the second form section
  const guestFormRef = useRef(null);
 
  // Function to handle input changes
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
 
  // Function to validate input fields
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
 
  // Function to add nearly-wed to guest list
  const handleAddNearlyWed = () => {
    const { first_name, last_name, email } = nearlyWedInfo;
    const fullName = `${first_name} ${last_name}`;
 
    // Add nearly-wed to guest list
    setGuestList((prevGuestList) => [...prevGuestList, { fullName, email }]);
    setNearlyWedInfo({
      first_name: '',
      last_name: '',
      email: '',
    });
 
    // Scroll to the next form section
    guestFormRef.current.scrollIntoView({ behavior: 'smooth' });
  };
 
  // Function to add a guest to the list
  const handleAddGuest = () => {
    const { first_name, last_name, email } = guestInfo;
    const fullName = `${first_name} ${last_name}`;
 
    // Add the guest object to the guestList
    setGuestList((prevGuestList) => [...prevGuestList, { fullName, email }]);
  };
 
 
  // Function to send invitations
  const handleSendInvitations = async (e) => {
    e.preventDefault();
    setIsSendInvitationsModalOpen(true); // Open the send invitations confirmation modal
  };
 
  // Function to close the send invitations confirmation modal and send invitations
  const closeSendInvitationsModal = async () => {
    setIsSendInvitationsModalOpen(false); // Close the send invitations confirmation modal
    setIsSendingInvitations(true); // Set sending invitations state to true
 
    try {
      // Extracting guest data from guestList
      const guestData = guestList.map(({ fullName, email }) => ({
        email,
        first_name: fullName.split(' ')[0],
        last_name: fullName.split(' ')[1],
      }));
 
      console.log('guests:', guestData);
 
      const fetchUserId = async () => {
 
        try {
   
          const token = localStorage.getItem('jwtToken');
   
     
   
          let url = 'http://127.0.0.1:8000/users/';
   
          if (token) {
   
            url += `?token=${token}`; // Assuming the API endpoint filters by token
   
          }
   
     
   
          const response = await axios.get(url);
   
          console.log('API response:', response); // Log the entire response object (optional)
   
     
   
          if (response.data) { // Check if there's data in the response
   
            const userId = response.data.id;
   
            console.log('User ID log:', response.data); // Log the user ID (optional)
   
            return userId; // Return the user ID
   
          } else {
   
            console.error('No user data found in response.'); // Handle cases where no data is found
   
          }
   
        } catch (error) {
   
          console.error('Error fetching user ID:', error); // Handle errors during API call
   
        }
   
      };
   
      fetchUserId();
   
     
   
   
   
      const user_id = await fetchUserId();
   
      console.log("user id: ", user_id);
   
   
   
   
   
      const eventUrl = `http://127.0.0.1:8000/events/${user_id}/`;  
   
   
   
      const eventResponse = await fetch(eventUrl);
   
      const eventData = await eventResponse.json();
   
      const event_Id = eventData[0].id;
     
 
      console.log("Event ID: ", event_Id,": ", eventData);
 
      // Send API request to send invitations
      const response = await fetch('http://127.0.0.1:8000/send-password-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients: guestData, eventData}),
      });
       
      const data = await response.json();
      fetchSentGuests(event_Id);
      if (response.ok) {
        // Handle successful email sending
        console.log('Invitations sent successfully:', data.message);
        setInvitationsSent(true); // Update state to indicate invitations sent
        // setSentGuests([...sentGuests, ...guestList]); // Add sent guests to the sentGuests state variable
        // setGuestList([]); // Clear guest list after successful sending
 
        // Reset invitationsSent state after 3 seconds
        setTimeout(() => {
          setInvitationsSent(false);
        }, 3000);
      } else {
        // Handle potential errors from the API
        console.error('Error sending invitations:', data.error, guestData);
      }
    } catch (error) {
      console.error('Error sending invitations:', error);
    } finally {
      // Reset sending state
      setIsSendingInvitations(false);
    }
 
  };
 
  const fetchSentGuests = async (eventId) => {
    try {
      const accessToken = localStorage.getItem('jwtToken');
      if (accessToken && eventId) {
        const response = await axios.get(`http://127.0.0.1:8000/get_invitations/?event_id=${eventId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const sentGuestData = response.data;
        setSentGuests(sentGuestData);
        console.log('Invitees:', sentGuestData);
      } else {
        console.error('No access token or event ID found for fetching sent guests.');
      }
    } catch (error) {
      console.error('Error fetching sent guests:', error);
    }
  };
  // Function to delete a guest
  const handleDeleteGuest = (index) => {
    // Set the selected guest index to prompt for confirmation
    setSelectedGuestIndex(index);
    setIsModalOpen(true); // Open modal
  };
 
  // Function to confirm and delete the selected guest
  const confirmDeleteGuest = () => {
    if (selectedGuestIndex !== null) {
      // Delete the selected guest from the guest list
      setGuestList((prevGuestList) =>
        prevGuestList.filter((guest, index) => index !== selectedGuestIndex)
      );
      // Clear the selected guest index
      setSelectedGuestIndex(null);
    }
    setIsModalOpen(false); // Close modal
  };
 
  // Function to validate email format
  const isValidEmail = (email) => {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result;
      // Process the CSV contents and add guests to the list
      processCSVContents(contents);
    };
    reader.readAsText(file);
  };
 
  // Function to process CSV contents and add guests to the list
  const processCSVContents = (contents) => {
   
     const parsedData = parseCSV(contents);
     parsedData.forEach((row) => {
     const [first_name, last_name, email] = row;
     const fullName = `${first_name} ${last_name}`;
     setGuestList((prevGuestList) => [...prevGuestList, { fullName, email }]);
     });
  };
 
 
  // Return your JSX content
  return (
    <div className={`weddingDetails-page addGuestList ${isModalOpen || isSendInvitationsModalOpen ? 'modal-active' : ''}`}>
      <div className='breadcrumb-container'>
        <Link to="/dashboard" className='dash-breadcrumb'>Dashboard / </Link>
        <h3 className='currentPage-breadcrumb'>My Guest List</h3>
      </div>
 
      <div className='addGuestDetails-container'>
        <form className='host-form'>
          <div className="form-nearly-column">
            <label className="addG-heading" htmlFor="venue-details">Let's add your partner to the app!</label>
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
                </div>
              ))}
            </div>
            {/* Error messages for nearly-wed */}
            {Object.keys(nearlyWedErrors).map((fieldName) => (
              <p key={fieldName} className={`error ${nearlyWedErrors[fieldName] ? 'visible' : 'hidden'}`}>{nearlyWedErrors[fieldName]}</p>
            ))}
            {/* Button at the bottom of the nearly-wed column */}
            <button className='addNearlyWed-button' type="button" onClick={handleAddNearlyWed}>Add nearly-wed</button>
          </div>
        </form>
      </div>
 
      {/* Ref attached to the next form section */}
      <div ref={guestFormRef} className='addGuestDetails-container'>
        <form className='host-form1'>
          <div className="form-column">
            <label className="addG-heading">Add your guests</label>
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
              <button className='addGuest-button' type="button" onClick={handleAddGuest}>Add guest</button>
             
            </div>
          </div>
 
          <div className="form-column">
            <label className="addG-heading">Sending invitations to</label>
            <div className='details-group'>
              <div className='guest-item-guest-header'>
                {/* Render guest list items */}
                {guestList.map((guest, index) => (
                  <div key={index} className='guest-item'>
                    <span>{guest.fullName}</span>
                    <span className='secondName'>{guest.email}</span>
                    <button className='deleteGuestIcon' type="button" onClick={() => handleDeleteGuest(index)}>
                      <SvgDelete />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
 
        <div className='line-container'>
          <div className='line1'></div>
        </div>
 
        <div className='invitation-button-container'>
          {invitationsSent ? (
            <button className='SendLinks-button'>Invites have been sent!</button>
          ) : (
            <button className='SendLinks-button' onClick={handleSendInvitations}>
              {isSendingInvitations ? 'Sending...' : 'Send your invites'}
            </button>
          )}
          {/* <button className='cancel-button' type="submit">Cancel</button> */}
        </div>
      </div>
      <div className='sent-guests'>
        <h2>Your wedding guest list ({sentGuests.length})</h2>
        <ol className='sentEmailsContainer'>
        {sentGuests.map((invitee, index) => (
          <li key={index}>
            {/* Assuming event details aren't needed for display */}
            {invitee.guest.first_name} - {invitee.guest.email}- {invitee.is_attending ? 'Attending' : 'Not attending'}
          </li>
        ))}
        </ol>
      </div>  
 
      {/* Confirmation modal for deleting a guest */}
      {selectedGuestIndex !== null && (
        <div className='confirmation-modal'>
          <p>Are you sure you want to delete this guest?</p>
          {/* Button to confirm deletion */}
          <button className='confirm-button' onClick={confirmDeleteGuest}>Yes, delete</button>
          {/* Button to cancel deletion */}
          <button className='cancelBtn' onClick={() => {setSelectedGuestIndex(null); setIsModalOpen(false);}}>Cancel</button>
        </div>
      )}
 
      {/* Confirmation modal for sending invitations */}
      {isSendInvitationsModalOpen && (
        <div className='confirmation-modal'>
          <p>Are you sure you want to send the invitations?</p>
          {/* Button to confirm sending invitations */}
          <button className='confirm-button' onClick={closeSendInvitationsModal}>Yes, send</button>
          {/* Button to cancel sending invitations */}
          <button className='cancelBtn' onClick={() => setIsSendInvitationsModalOpen(false)}>Cancel</button>
        </div>
      )}
     
      {/* Modal background */}
      {(isModalOpen || isSendInvitationsModalOpen) && <div className="modal-background" onClick={() => { setIsModalOpen(false); setIsSendInvitationsModalOpen(false); }}></div>}
      {/* Lottie Animation */}
      {isSendingInvitations}
    </div>
  );
}