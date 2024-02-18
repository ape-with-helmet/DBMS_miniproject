import '../css/Navbar.css'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from './logo.png'

function NavBar() {
    function team() {
        window.location.href = "/team_info"
    }
    function game() {
        window.location.href = "/games"
    }
    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src={Logo} alt="Logo" className="logo-img" />
                    <span className="logo-name">ESPORT TOURNAMENT</span>
                </div>
                <ul className="navbar-links">
                    <li className="navbar-links"><Link to="/">Home</Link></li>
                    <li className="navbar-links"><Link to="/team_info">Teams</Link></li>
                    <li className="navbar-links"><Link to="/games">Games</Link></li>
                </ul>
            </nav>
        </>
    )
}

export default NavBar