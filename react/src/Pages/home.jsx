import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './home.css';
import image1 from '../images/1.svg';
import image2 from '../images/2.svg';
import image3 from '../images/3.svg';
import image4 from '../images/rsvp.svg';
import image5 from '../images/apostrophe.svg';


const Home = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div>
      <div className='home-container'>
        <div className='home-pageDiv'>
          <header className='header'>
            <h1 className="headerH1">Where Every Guest Becomes Part of the Family</h1>
            <h3 class="getToKnow">Get to Know, Get Excited, Get Ready for the Celebration!</h3>
          </header>
          <div className='button-div'>
            {/* Use Link component instead of anchor tag */}
            <Link to="/SignUp"><button>Get started</button></Link>
          </div>
        </div>

        {/* Carousel */}
        <Slider {...carouselSettings}>
          <div className="carousel">
            <img src={image1} alt="Wedding couple in a van" />
          </div>
          <div>
            <img src={image2} alt="Family-hands-touching" />
          </div>
          <div>
            <img src={image3} alt="Wedding guests" />
          </div>
          {/* Add more slides as needed */}
        </Slider>
      </div>

      {/* RSVP Container */}
      <div className="RsvpContainer">
        <div className="rsvpText">
          <h1 className="rsvpH1">Send a digital RSVP to each guest.</h1>
          <div>
            <img className="rsvpImage" src={image4} alt="Family-hands-touching" />
          </div>
          <div className='button-div2'>
            <a href="/features"><button className="more">See more features</button></a>
          </div>
        </div>
      </div>

      {/* quote */}
      <div className="quoteContainer">
      <div className="quoteTextbox">
          <h1 className="quoteH1"><img className="apost1"src={image5} alt="apostrophe" />Be Our Guest added excitement to our wedding, 
                                   ensuring no guest felt alone with its seamless connections 
                                   and event notifications. Highly recommend!<img className="apost1"src={image5} alt="apostrophe" /> Jennifer, UK</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;