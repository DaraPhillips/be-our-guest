import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './home.css';
import image1 from '../images/1.svg';
import image2 from '../images/2.svg';
import image3 from '../images/3.svg';


const Home = () => {
  const carouselSettings = {
    dots: false,
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
            <h3 className="getToKnow">Get to Know, Get Excited, Get Ready for the Celebration!</h3>
          </header>
          <div className='button-div'>
            {/* Use Link component instead of anchor tag */}
            <Link to="/SignUp"><button>Get started</button></Link>
          </div>
        </div>

        {/* Carousel */}
        <Slider {...carouselSettings}>
          <div className="carousel">
            <img src={image1} alt="Wedding couple in a van"  />
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
    </div>
  );
};

export default Home;