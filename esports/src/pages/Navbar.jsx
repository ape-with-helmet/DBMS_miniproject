import '../css/Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import back from './back.svg'
import SnowFall from '../SnowFall';
import adduser from './add-user.svg'
import { useEffect, useState } from 'react';

function NavBar() {
    const snowpos=[];
    for (let i = 0; i < 30; i++) {
        const snowpo=Math.floor(Math.random()*100)
        snowpos.push(snowpo)
    }
    const navigate = useNavigate();
    const location = useLocation();
    const [auth, setAuth] = useState('')
    useEffect(() => {
        setAuth(localStorage.getItem("LoginData"));
        console.log(auth)
    },[auth])
    const handleLogout = () => {
        localStorage.clear()
        setAuth('');
        navigate('/')
    }
    const handleLogin = () => {
        navigate('/login')
    }
    return (
        <>
            <SnowFall snowposition={snowpos}/>
            <nav className="navbar">
                <Link to="/" className='links'><div className="navbar-logo">
                    <span className="navbar-text">Ghost Esports</span>
                </div></Link>
                {location.pathname !== '/' && <button className='back-button' onClick={() => window.history.back()}><img src={back} alt='ayein' /></button>}
                <ul className="navbar-links">
                    {
                        auth ?
                            <>
                                <li className="navbar-links-1"><Link to="/add_data"><img src={adduser} alt='adduser' /></Link></li>
                                <li className="navbar-links-1"><Link to="/add_data"><button className='logout-button' onClick={()=>handleLogout()}>Logout</button></Link></li>
                            </>
                            :
                            <>
                                <li className="navbar-links-1"><Link to="/add_data"><button className='logout-button' onClick={()=>handleLogin()}>Login</button></Link></li>
                            </>
                    }
                </ul>
            </nav>
        </>
    )
}
export default NavBar