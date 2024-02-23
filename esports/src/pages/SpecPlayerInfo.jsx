import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Buffer } from 'buffer'
import '../css/SpecPlayerInfo.css'

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
        <div className='spec-player-container'>
            {
                player.map(prod => {
                    return (<>
                        <div className='spec-player-image'>
                        {/* <img src={`data:image/png;base64,${Buffer.from(prod.photo.data).toString('base64')}`} alt={prod.pname} className='spec-player-image' /> */}
                        {
                                    prod.photo != null ?
                                        <img src={`data:image/png;base64,${Buffer.from(prod.photo.data).toString('base64')}`} alt={prod.tname} className='spec-player-image' />
                                        :
                                        <img src='https://static.vecteezy.com/system/resources/thumbnails/010/884/730/small_2x/owl-head-mascot-team-logo-png.png' className='spec-player-image' />
                                }
                        </div>
                        <div className='player-desc'>
                            <h1 className='spec-player-name'>{prod.pname}</h1>
                            <div>Date of Birth: {prod.dob}</div>
                            <div>Country of Origin: {prod.origin}</div>
                            <div>Sex: {prod.sex}</div>
                            <div>Nickname: {prod.nickname}</div>
                            <div>Team Name: {prod.tname}</div>
                            <div>Description: {prod.description}</div>
                        </div>
                    </>)
                })
            }
        </div>
    )
}

export default SpecPlayerInfo