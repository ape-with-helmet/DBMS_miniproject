import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SpecPlayerInfo = () => {
    var [download, setDownload] = useState("")
    const [player, setPlayer] = useState([])

    useEffect(() => {
        setDownload(localStorage.getItem("SelectedPlayer"))
    })
    useEffect(() => {
        const getTeamData = async (download) => {
            try {
                const response = await axios.post("http://localhost:8080/fetch_player_details", {
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
            {
                player.map(prod => {
                    return (<>
                        <h1 >{prod.pname}</h1>
                        <div>Date of Birth: {prod.dob}</div>
                        <div>Country of Origin: {prod.origin}</div>
                        <div>Sex: {prod.sex}</div>
                        <div>Nickname: {prod.nickname}</div>
                        <div>Team Name: {prod.tname}</div>
                        <div>Description: {prod.description}</div>
                    </>)
                })
            }
        </div>
    )
}

export default SpecPlayerInfo