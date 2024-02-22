export default function Navbar(){

return <nav className="nav">

{/* <a href="/" className="site-title">Be Our Guest</a> */}

<img src="/src/images/beOurGuestLogo.png" alt="Logo" className="navbar-logo"/>

<ul>
    <li> <a href="/home">Home</a></li>
    <li> <a href="/about">About</a></li>
    <li> <a href="/features">Features</a></li>
    <li> <a href="/gallery">Gallery</a></li>
</ul>

{/* <ul className="right-side">
    <li> <a href="/login">Log in</a></li>
</ul> */}
<p><a href="/login">Login</a></p>
</nav>




}