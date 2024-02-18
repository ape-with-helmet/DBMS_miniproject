import React from 'react'
import { Link } from 'react-router-dom';
import game from './game.png'
import team from './buffalo-bills-logo.png'
import '../css/Homepage.css'

const Homepage = () => {
    return (
        <>
            <div className="container">
                <Link to="/team_info" className='text_home'>
                    <div className="left-div">
                        <div className="outer-box">
                            <img src={team} className='team_logo' alt='Team logo' />
                            <h2>The Teams Participating in this Mega Tournament</h2>
                            <div className='teambutton'>Click Here</div>
                        </div>
                    </div></Link>
                <Link to="/games" className='text_home'>
                    <div className="right-div">
                        <div className="outer-box-right">
                            <img src={game} className='game_logo' alt='Team logo' />
                            <h2>The Games organized in this Mega Tournament</h2>
                            <a href='/games'><button className='teambutton'>Click Here</button></a>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Homepage