import '../css/Navbar.css'
import { Link, useLocation } from 'react-router-dom';
import back from './back.svg'
import Logo from './buffalo-bills-logo.png'

function NavBar() {
    const location = useLocation();
    return (
        <>
            <nav className="navbar">
                <Link to="/" className='links'><div className="navbar-logo">
                    <img src={Logo} alt="Logo" className="navbar-image" />
                    <span className="navbar-text">Ghost Esports</span>
                </div></Link>
                {location.pathname !== '/' && <a className='back-button' onClick={()=>window.history.back()}><img src={back}/></a>}
                <ul className="navbar-links">
                    <li className="navbar-links-1"><Link to="/">Add info</Link></li>
                    <li className="navbar-links-2"><Link to="/team_info">Teams</Link></li>
                    <li className="navbar-links-3"><Link to="/games">Games</Link></li>
                </ul>
            </nav>
        </>
    )
}
{/* <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
<circle cx="50" cy="50" r="40" fill="blue" /> */}
// </svg>
export default NavBar