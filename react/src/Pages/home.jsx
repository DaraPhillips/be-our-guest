import React from 'react';
import SimpleSlider from '../Pages/simpleSlider'; // Import the SimpleSlider component
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home = () => {
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
            <Link to="/SignUp"><button className='getStarted'>Get started</button></Link>
          </div>
        </div>

        {/* Replace the existing carousel with SimpleSlider */}
        <SimpleSlider />

      </div>
    </div>
  );
};

export default Home;