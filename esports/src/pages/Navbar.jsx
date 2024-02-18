import '../css/Navbar.css'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    function team() {
        window.location.href = "/team_info"
    }
    function game() {
        window.location.href = "/games"
    }
    return (
        <>
            <Navbar className="bg-body-tertiary top_nav">
                <Container>
                    <Link to="/" className='nav_name'>
                        <Navbar.Brand href="#home" className='nav_name'>
                            <img
                                alt=""
                                src='logo.png'
                                width="30"
                                height="30"
                                className="d-inline-block align-top top_logo"
                            />{' '}
                            <span><b>Esports Event</b></span>
                        </Navbar.Brand>
                    </Link>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar