import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import '../css/Games.css'
import axios from 'axios'
import { toast } from 'react-toastify'
// import { Link } from 'react-router-dom'
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Games = () => {
    const [data1, setData1] = useState([]);
    useEffect(() => {
        const getGameDetails = async () => {
            try {
                const response = await toast.promise( axios.get("https://690c-2405-201-d00f-608c-4e4b-9e5b-b74a-27ab.ngrok-free.app/game_details"),
                {
                    pending: "Waiting for server to respond",
                    success: "Found the data",
                    error: "Failed to fetch data",
                });
                setData1(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        getGameDetails();
    }, []);


    function upload(x) {
        localStorage.setItem("SelectedGame", x.gname);
        setTimeout(() => {
            window.location.href = "/game_team"
        }, 1000
        )
    }
    return (
        <div>
            {/* <button>{handleBack}</button> */}
            <ul className="games-card-list">
                {data1.map((cardData, index) => (
                    <li key={index} onClick={() => upload(cardData)} className="games-card">
                            <div className='roll-animation'>
                                {
                                    cardData.photo != null ?
                                        <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.gname} className='game_image' />
                                        :
                                        <img src='https://static.vecteezy.com/system/resources/thumbnails/010/884/730/small_2x/owl-head-mascot-team-logo-png.png' alt='idkl' className='game_image' />
                                }
                                <div className='games-text'>
                                    <h1 className='game-text-header'>{cardData.gname}</h1>
                                    <p className='game-text-inside'>{cardData.publisher}</p>
                                    <p className='game-text-inside'>{cardData.release_date}</p>
                                    <p className='game-text-inside'>{cardData.description}</p>
                                </div>
                            </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Games