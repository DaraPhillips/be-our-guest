import './Pages/footer.css'

export default function Footer(){



    return(

        <div className="main-footer">
           
           {/* <p className='col-small'>
                        &copy;{new Date().getFullYear()} BeOurGuest, Inc.
                    </p>
                    <p>All rights reserved</p>
                    <p>Do not Share My Personal Information</p>
             */}
            <div className="container">
                
                <div className="row">
                    {/* Column1 */}
                    <div className="col">
                        <h4>Menu</h4>
                        <ul className="list-unstyled">
                        <li>Features</li>
                        <li>About</li>
                        <li>Stories</li>
                        <li>Support</li>
                        </ul>
                    </div>
                    <div className="col">
                        <h4>Follow</h4>
                        <ul className="list-unstyled">
                        <li>X</li>
                        <li>Reddit</li>
                        <li>Facebook</li>
                        <li>Instagram</li>

                        </ul>
                    </div>
                    <div className="col">
                        <h4>Get Started</h4>
                        <ul className="list-unstyled">
                        <li>Log in</li>
                        <li>Sign up</li>
                       <a href="/homeLoggedIn" ><li>HomeDashTemp</li> </a>

                        </ul>
                    </div>
                </div>
                
                    {/* <p className='col-small'>
                        &copy;{new Date().getFullYear()} BeOurGuest, Inc.
                    </p>
                    <p>All rights reserved</p>
                    <p>Do not Share My Personal Information</p> */}
                
            </div>
        </div>

    ) 
    



}
