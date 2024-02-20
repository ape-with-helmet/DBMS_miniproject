import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'
import '../css/TeamPlayers.css'
import EmptyTriangle from '../resoures/circle'

const TeamPlayers = () => {
    var [download, setDownload] = useState("")
    const [players, setPlayers] = useState([])

    useEffect(() => {
        setDownload(localStorage.getItem("SelectedTeam"))
    }, [])
    useEffect(() => {
        const getTeamData = async (download) => {
            try {
                const response = await axios.post("http://localhost:8080/fetch_team_details", {
                    id: download
                });
                setPlayers(response.data)
            } catch (error) {
                console.error(error);
                throw error;
            }
        }

        getTeamData(download)
    }, [players])
    // function merch(x) {
    //     localStorage.setItem("SelectedTeam",x.tname);
    //     window.location.href = "/merch"
    // }
    function uploadPlayer(x) {
        localStorage.setItem("SelectedPlayer", x.pname);
        window.location.href = "/player"
    }
    return (
        <div>
            <h1 className='roster'>{download} Player Roster</h1>
            {/* <p className='team-text-inside'><button onClick={()=>merch(cardData)}>Buy Merch</button></p> */}
            <ul className="player-card-list">
                {players.map((cardData, index) => (<>
                    
                    <li key={index} className='player-card'>
                        <div>
                        {cardData.captain_status=="Captain"?<div className='captain-status'></div>:<></>}
                    </div>
                        <Link onClick={() => uploadPlayer(cardData)} className='lonk-plonk'>
                            <div className='player-roll-animation'>
                                <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.pname} className='player-image' />
                                <div className='player-text'>
                                    <h1 className='player-text-header'>{cardData.nickname}</h1>
                                    <p className='player-text-inside'>AKA {cardData.pname}</p>
                                </div>
                            </div>
                        </Link>
                    </li></>
                ))}
            </ul>

        </div>
    )
}

export default TeamPlayers