//import { useState } from 'react'

//import './App.css'
//import Navbar from './Navbar'
//import about from './Pages/about'
//import features from './Pages/features'
//import gallery from './Pages/gallery'
//import home from './Pages/home'
//import login from './Pages/login'
//import Footer from './Footer'
//import signUp from './Pages/signUp'
//import homeLoggedIn from './Pages/homeLoggedIn'
//import createEvent from './Pages/createEvent'


//function App(){
// let Component
//  switch (window.location.pathname){
//  case "/home":
//    Component = home
//    break
//    case "/about":
//      Component = about
//      break
//      case "/features":
//        Component = features
//      break
//      case "/gallery":
//        Component = gallery
//      break
//      case "/login":
//        Component = login
//      break
//      case "/signUp":
//        Component = signUp
//      break
//      case "/homeLoggedIn":
//        Component = homeLoggedIn
//      break
//      case "/createEvent":
//        Component = createEvent
//          break
//      default:
//          Component = home
//          // Handle unknown routes by rendering a "Not Found" component or redirecting to a default route
//          //Component = () => <div>Page Not Found</div>
// }
//  return (
//  <div className='page-container'>
//    <div className='content-wrap'>
//  <Navbar />
//  <Component/>

//  </div>
//  <Footer />

//  </div>
//  )
//}
//export default App
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
