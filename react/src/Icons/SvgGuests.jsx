import React from 'react';

const SvgGuests = ({ color = '#02092D' }) => (
  <svg className='guestListIcon' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_686_17509)">
      <path d="M5.25 6C6.49264 6 7.5 4.99264 7.5 3.75C7.5 2.50736 6.49264 1.5 5.25 1.5C4.00736 1.5 3 2.50736 3 3.75C3 4.99264 4.00736 6 5.25 6Z" stroke={color} strokeWidth="1.5"/>
      <path d="M7.50027 9H5.25027H4.42403C3.2893 9 2.33214 9.84495 2.1914 10.9709L1.71102 14.8139C1.59911 15.7092 2.29719 16.5 3.19944 16.5H6.75027" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.2895 14.8139L15.8091 10.9709C15.6684 9.84495 14.7112 9 13.5765 9H12.7503H11.924C10.7893 9 9.83217 9.84495 9.6914 10.9709L9.21102 14.8139C9.09912 15.7092 9.79722 16.5 10.6995 16.5H14.8011C15.7033 16.5 16.4014 15.7092 16.2895 14.8139Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.75 6C13.9926 6 15 4.99264 15 3.75C15 2.50736 13.9926 1.5 12.75 1.5C11.5074 1.5 10.5 2.50736 10.5 3.75C10.5 4.99264 11.5074 6 12.75 6Z" stroke={color} strokeWidth="1.5" color='#9093A3;'/>
    </g>
    <defs>
      <clipPath id="clip0_686_17509">
        <rect width="18" height="18" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default SvgGuests;
