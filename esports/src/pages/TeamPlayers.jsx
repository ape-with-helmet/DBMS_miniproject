import React, { useEffect, useState } from 'react'
import axios from 'axios'

const TeamPlayers = () => {
    var [download, setDownload] = useState("")
    const [players, setPlayers] = useState([])

    useEffect(() => {
        setDownload(localStorage.getItem("SelectedTeam"))
    })
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
    })
    function uploadPlayer(x) {
        localStorage.setItem("SelectedPlayer", x.pname);
        window.location.href = "/player"
    }
    return (
        <div>
            <h1>{download}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Player Name</th>
                        <th>NickName</th>
                        <th>Position</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        players.map(prod => {
                            return (<tr key={prod.pname}>
                                <td ><button onClick={() => uploadPlayer(prod)}>{prod.pname}</button></td>
                                <td>{prod.nickname}</td>
                                <td>{prod.captain_status}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TeamPlayers