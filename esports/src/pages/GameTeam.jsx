import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/GameTeam.css';
import { toast } from 'react-toastify';

const GameTeam = () => {
  const [download, setDownload] = useState("");
  const [player, setPlayer] = useState([]);

  // Update download state based on localStorage
  useEffect(() => {
    const storedGame = localStorage.getItem("SelectedGame");
    if (storedGame) {
      setDownload(storedGame);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch team data when download state changes
  useEffect(() => {
    if (!download) return; // Don't fetch if download is not set

    const getTeamData = async () => {
      try {
        const response = await toast.promise(
          axios.post("http://localhost:8080/fetch_game_teams", { id: download }),
          {
            pending: "Waiting for server to respond",
            success: "Found the data",
            error: "Failed to fetch data",
          }
        );
        setPlayer(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getTeamData();
  }, [download]); // Dependency array includes download

  function upload(x) {
    localStorage.setItem("SelectedTeam", x.Team_Name);
    window.location.href = "/team_players";
  }

  return (
    <div className='gameteam-container'>
      <div className='header-game-team'>{download}</div>
      {player.length!==0 ? 
      <ul className="team-card-list">
        {player.map((cardData, index) => (
          <li key={index} className="team-card">
            <Link onClick={() => upload(cardData)}>
              <div className='team-roll-animation'>
                {
                  cardData.Team_Photo ?
                    <img src={`data:image/png;base64,${cardData.Team_Photo}`} alt={cardData.Team_Name} className='team_image' />
                    :
                    <img src='https://static.vecteezy.com/system/resources/thumbnails/010/884/730/small_2x/owl-head-mascot-team-logo-png.png' alt='default' className='team_image' />
                }
                <div className='team-text'>
                  <h1 className='team-text-header'>{cardData.Team_Name}</h1>
                  <p className='team-text-inside'>Captain: {cardData.Captain_Name}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      : 
      <>
      <h1>NO teams have registered</h1>
      </>}
    </div>
  );
};

export default GameTeam;
