import React from 'react';
import SvgBLOGOWH from './Icons/SvgBLOGOWH'; // Adjust the path based on your folder structure
import SvgCPRIGHT from './Icons/SvgCPRIGHT'; // Adjust the path for SvgCPRIGHT
import './Pages/footer.css'; // Assuming footer.css is inside the Pages folder
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

export default function Footer() {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row">
          {/* Column 1 - BLOGOWH Logo and SvgCPRIGHT */}
          <div className="col">
            <Link to="/home">
              <div className="footer-icon">
                <SvgBLOGOWH />
              </div>
            </Link>
            <ul>
              <li className="copyRight"><SvgCPRIGHT />{/* Add your SvgCPRIGHT component here */} 2024 BeOurGuest, Inc.</li>
              <li className="copyRight">All rights reserved</li>
              <li className="copyRight">Do not Share My Personal Information</li> 
            </ul>
          </div>

          {/* Column 2 */}
          <div className="col">
            <h4 className='head4'>Menu</h4>
            <ul className="list-unstyled">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col">
            <h4 className='head4'>Follow</h4>
            <ul className="list-unstyled">
              <li><a href="https://twitter.com/?lang=en" className="footer-link" target="_blank" rel="noopener noreferrer">X</a></li>
              <li><a href="https://www.facebook.com/" className="footer-link" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://www.instagram.com/" className="footer-link" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="col">
            <h4 className='head4'>Get Started</h4>
            <ul className="list-unstyled">
              <li><Link to="/login" className="footer-link">Log in</Link></li>
              <li><Link to="/signUp" className="footer-link">Sign up</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}