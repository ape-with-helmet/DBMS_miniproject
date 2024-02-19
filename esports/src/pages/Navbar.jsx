import '../css/Navbar.css'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './buffalo-bills-logo.png'

function NavBar() {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/"><img src={Logo} alt="Logo" className="navbar-image" /></Link>
                    <span className="navbar-text">Ghost Esports</span>
                </div>
                <ul className="navbar-links">
                    <li className="navbar-links"><Link to="/">Add info</Link></li>
                    <li className="navbar-links"><Link to="/team_info">Teams</Link></li>
                    <li className="navbar-links"><Link to="/games">Games</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default NavBar