import '../css/Navbar.css'
import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
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
                {location.pathname !== '/' && <button className='back-button' onClick={()=>window.history.back()}>Back</button>}
                <ul className="navbar-links">
                    <li className="navbar-links-1"><Link to="/">Add info</Link></li>
                    <li className="navbar-links-2"><Link to="/team_info">Teams</Link></li>
                    <li className="navbar-links-3"><Link to="/games">Games</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default NavBar