import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import game from './game.png'
import team from './tams.png'
import '../css/Homepage.css'

const Homepage = () => {
    const navigate = useNavigate()
    function actuate(x) {
        setTimeout(() => {
            navigate(x)
        }, 100)
    }
    return (
        <>
            <div className='main-container-home'>
                <ul className="container">
                    <Link onClick={() => actuate("/team_info")} className='text_home'>
                        <li className="left-div">
                            <div className="outer-animation">
                                <img src={team} className='team_logo' alt='Team logo' />
                                <div className="home-text">
                                    <h1>The Teams Playing in this Tournament</h1>
                                    <h1>Click to Know more</h1>
                                </div>
                            </div>
                        </li>
                    </Link>
                    <Link onClick={() => actuate("/games")} className='text_home'>
                        <li className="right-div">
                            <div className="outer-animation">
                                <img src={game} className='game_logo' alt='Team logo' />
                                <div className="home-text">
                                    <h1>The Games organized in this Mega Tournament</h1>
                                    <h1>Click to Know more</h1>
                                </div>
                            </div>
                        </li>
                    </Link>
                </ul>
            </div>
        </>
    )
}

export default Homepage