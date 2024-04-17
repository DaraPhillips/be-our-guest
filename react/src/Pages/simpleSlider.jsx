import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import './home.css';
import image1 from '../images/1.svg';
import image2 from '../images/2.svg';
import image3 from '../images/3.svg';
import image4 from '../images/4.svg';
import image5 from '../images/5.svg';
import image6 from '../images/6.svg';
 
const SimpleSlider = () => {
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef();
 
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: !isHovered, // Start autoplay only if not hovered
    autoplaySpeed: 2000,
    fade: true,
    pauseOnHover: true,
  };
 
  const handleHover = (status) => {
    setIsHovered(status);
    if (status) {
      sliderRef.current.slickPause(); // Pause autoplay when hovered
    } else {
      sliderRef.current.slickPlay(); // Resume autoplay when not hovered
    }
  };
 
  return (
    <Slider ref={sliderRef} {...settings} onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}>
      <div>
        <h3 className='carousel-images'><img src={image1} alt="Wedding couple in a van" /></h3>
      </div>
      <div>
        <h3 className='carousel-images'><img src={image2} alt="Family-hands-touching" /></h3>
      </div>
      <div>
        <h3 className='carousel-images'><img src={image3} alt="Wedding guests" /></h3>
      </div>
      <div>
        <h3 className='carousel-images'><img src={image4} alt="Wedding guests" /></h3>
      </div>
      <div>
        <h3 className='carousel-images'><img src={image5} alt="Wedding guests" /></h3>
      </div>
      <div>
        <h3 className='carousel-images'><img src={image6} alt="Wedding guests" /></h3>
      </div>
    </Slider>
  );
};
 
export default SimpleSlider;