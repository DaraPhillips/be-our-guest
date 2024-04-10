import { useState } from 'react'

import './App.css'
import Navbar from './Navbar'
import about from './Pages/about'
import features from './Pages/features'
import gallery from './Pages/gallery'
import home from './Pages/home'
import login from './Pages/login'
import Footer from './Footer'
import signUp from './Pages/signUp'
import homeLoggedIn from './Pages/homeLoggedIn'
import createEvent from './Pages/createEvent'


function App(){
 let Component
  switch (window.location.pathname){
  case "/home":
    Component = home
    break
    case "/about":
      Component = about
      break
      case "/features":
        Component = features
      break
      case "/gallery":
        Component = gallery
      break
      case "/login":
        Component = login
      break
      case "/signUp":
        Component = signUp
      break
      case "/homeLoggedIn":
        Component = homeLoggedIn
      break
      case "/createEvent":
        Component = createEvent
      break
 }
  return (
  <div className='page-container'>
    <div className='content-wrap'>
  <Navbar />
  <Component/>
  
  </div>
  <Footer />
  
  </div>
  )
}
export default App