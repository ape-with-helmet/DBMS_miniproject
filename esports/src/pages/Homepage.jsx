import React from 'react'
import { Link } from 'react-router-dom';
import game from './game.png'
import team from './buffalo-bills-logo.png'
import '../css/Homepage.css'

const Homepage = () => {
    function actuate(x){
        setTimeout(()=>{
            window.location.href = x;
        },500)
    }
    return (
        <>
            <ul className="container">
                <Link onClick={()=>actuate("/team_info")} className='text_home'>
                <li className="right-div">
                        <div className="outer-animation">
                            <img src={team} className='team_logo' alt='Team logo' />
                            <div className="home-text">
                                <h1>The Teams Playing in this Tournament</h1>
                                <h1>Click to Know more</h1>
                            </div>
                        </div>
                    </li>
                </Link>
                <Link onClick={()=>actuate("/games")} className='text_home'>
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
        </>
    )
}

export default Homepage