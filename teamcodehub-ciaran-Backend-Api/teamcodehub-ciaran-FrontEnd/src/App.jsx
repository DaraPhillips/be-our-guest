
//This one works!!!!!

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Navbar from './Navbar';
import Footer from './Footer';
import About from './Pages/About';
import Features from './Pages/Features';
import Gallery from './Pages/Gallery';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import HomeLoggedIn from './Pages/HomeLoggedIn';
import CreateEvent from './Pages/CreateEvent';

function App() {
    return (
        <Router>
            <div className='page-container'>
                <div className='content-wrap'>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signUp" element={<SignUp />} />
                        <Route path="/homeLoggedIn" element={<HomeLoggedIn />} />
                        <Route path="/create_event" element={<CreateEvent />} />
                        <Route path="/createEvent" element={<CreateEvent />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;




// DARA's app.jsx for the newest css and forms 

//import React from 'react';
//import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom';
//import 'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';

//import Navbar from './Navbar';
//import Home from './Pages/home';
//import About from './Pages/about';
//import Features from './Pages/features';
//import Gallery from './Pages/gallery';
//import Login from './Pages/login';
//import Footer from './Footer';
//import SignUp from './Pages/signUp';
//import HomeLoggedIn from './Pages/homeLoggedIn';
//import CreateEvent from './Pages/createEvent';


//function ScrollToTop() {
//    const history = useHistory();
//    const { pathname } = useLocation();

//    React.useEffect(() => {
//        history.listen(() => {
//            window.scrollTo(0, 0);
//        });
//    }, [history]);

//    React.useEffect(() => {
//        window.scrollTo(0, 0);
//    }, [pathname]);

//    return null;
//}

//function App() {
//    return (
//        <Router>
//            <div className='page-container'>
//                <div className='content-wrap'>
//                    <Navbar />
//                    <ScrollToTop />
//                    <Switch>
//                        <Route path='/home' component={Home} />
//                        <Route path='/about' component={About} />
//                        <Route path='/features' component={Features} />
//                        <Route path='/gallery' component={Gallery} />
//                        <Route path='/login' component={Login} />
//                        <Route path='/signUp' component={SignUp} />
//                        <Route path='/homeLoggedIn' component={HomeLoggedIn} />
//                        <Route path='/createEvent' component={CreateEvent} />
//                        <Route path='/' component={Home} /> {/* Default route */}
//                    </Switch>
//                </div>
//                <Footer />
//            </div>
//        </Router>
//    );
//}

//export default App;