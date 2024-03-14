// UserInitialCircle.js
import React from 'react';

const UserInitialCircle = ({ firstName }) => {
  const getFirstLetter = () => {
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return '';
  };

  return <div className="user-initial-circle">{getFirstLetter()}</div>;
};

export default UserInitialCircle;