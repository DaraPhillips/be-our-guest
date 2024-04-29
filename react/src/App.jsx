import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Navbar from './Navbar';
import Footer from './Footer';
import About from './Pages/About';
import Features from './Pages/Features';
import Pricing from './Pages/pricing';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import CreateEvent from './Pages/addEvent';
import ScrollToTop from './Pages/ScrollToTop'; // Import the ScrollToTop component
import Dashboard from './Pages/dashboard';
import Invitations from './Pages/invitations';
import RsvpPage from './Pages/rsvpPage';

import AddGuestList from './Pages/AddGuestList';
import CrudEvent from './Pages/crudEvent';

function App() {
    return (
        <Router>
            <div className='page-container'>
                <div className='content-wrap'>
                    <Navbar />
                    <ScrollToTop />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signUp" element={<SignUp />} />
                        <Route path="/create_event" element={<CreateEvent />} />
                        <Route path="/createEvent" element={<CreateEvent />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/rsvpPage" element={<RsvpPage />} />
                        <Route path="/invitations" element={<Invitations/>} />
                        <Route path="/crudEvent" element={<CrudEvent/>} />
                        <Route path="/addGuestList" element={<AddGuestList />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;




