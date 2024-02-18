import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
      <h1>{download}</h1>
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Captain Name</th>
            <th>Team Rank</th>
          </tr>
        </thead>
        <tbody>
          {
            player.map(prod => {
              return (<tr key={prod.Team_Name}>
                <td><button onClick={() => upload(prod)}>{prod.Team_Name}</button></td>
                <td>{prod.Captain_Name}</td>
                <td>{prod.Team_Rank}</td>
              </tr>)
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default GameTeam