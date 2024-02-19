import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'
import '../css/GameTeam.css'

const GameTeam = () => {
  var [download, setDownload] = useState("")
  const [player, setPlayer] = useState([])

  useEffect(() => {
    setDownload(localStorage.getItem("SelectedGame"))
  })
  function upload(x) {
    localStorage.setItem("SelectedTeam", x.Team_Name);
    window.location.href = "/team_players"
  }
  useEffect(() => {
    const getTeamData = async (download) => {
      try {
        const response = await axios.post("http://localhost:8080/fetch_game_teams", {
          id: download
        });
        setPlayer(response.data)
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    getTeamData(download)
  })
  return (
    <div>
      <div className='header-game-team'>{download}</div>
      <ul className="team-card-list">
                {player.map((cardData, index) => (
                    <li key={index} className="team-card">
                        <Link onClick={() => upload(cardData)}>
                            <div className='team-roll-animation'>
                                 <img src={`data:image/png;base64,${Buffer.from(cardData.Team_Photo.data).toString('base64')}`} alt={cardData.tname} className='team_image' />
                                <div className='team-text'>
                                    <h1 className='team-text-header'>{cardData.Team_Name}</h1>
                                    <p className='team-text-inside'>Captain: {cardData.Captain_Name}</p>
                                    <p className='team-text-inside'>Rank {cardData.Team_Rank}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
    </div>
  )
}

export default GameTeam