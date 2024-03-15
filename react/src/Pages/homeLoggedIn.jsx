import './homeLoggedInStyle.css'


export default function homeLoggedIn(){

return(
<div className='homeLoggedIn-page'>
    
    <header className='header-title-loggedIn'>
        <h1>Welcome back, NAME!</h1>
        </header>

<div className='top-boxes'>

        <div className='my-invBox'>
            <button className='inv-button'><img src='/src/images/myInvimg.png'/>
                My Invitations</button>
            </div>

           

        <div className='my-eventsBox'>
           <a href='/createEvent'> <button className='events-button'><img src='/src/images/myeventsimg.png'/>My Events</button></a>
            </div>


</div>
        <h2>Accepted Invitations</h2>
        
        <div className='accepted-invBox'></div>
        
        </div>
)




}