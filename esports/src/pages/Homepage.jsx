import React from 'react'
import { Link } from 'react-router-dom';
import game from './game.png'
import team from './buffalo-bills-logo.png'
import '../css/Homepage.css'

const Homepage = () => {
    return (
        <>
            <div className="container">
                <div className="left-div">
                    <div className="outer-box">
                        <Link to="/team_info">
                            <img src={team} className='team_logo' alt='Team logo' />
                        </Link>
                        <h2>The Teams Participating in this Mega Tournament</h2>
                        <a href='/team_info'><button className='teambutton'>Click Here</button></a>
                    </div>
                </div>
                <div className="right-div">
                <div className="outer-box-right">
                        <Link to="/games">
                            <img src={game} className='game_logo' alt='Team logo' />
                        </Link>
                        <h2>The Games organized in this Mega Tournament</h2>
                        <a href='/games'><button className='teambutton'>Click Here</button></a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Homepage