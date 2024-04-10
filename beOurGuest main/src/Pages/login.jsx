import './login.css'

export default function login(){
 

  
        return (
          <div className='login-form'>
          <div className="form-container">
            <p className="title">Login</p>
            <form className="form">
              <div className="input-group">
                <label htmlFor="username">Email</label>
                <input type="text" name="username" id="login-email" placeholder="" />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="login-password" placeholder="" />
                <div className="forgot">
                  <a rel="noopener noreferrer" href="#">Forgot your Password?</a>
                </div>
              </div>
              <a href="/homeLoggedIn"> <button className="sign" id='login-button'>Login</button> </a>
            </form>
            
            <p className="signup">Not a member?  
              <a rel="noopener noreferrer" href="/signUp" className="">  Sign up</a>
            </p>
          </div>
          </div>
        );
      };


  