import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/TeamInfo.css'
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';

function App() {
    const [data1, setData1] = useState([]);
    useEffect(() => {
        axios.get("https://dbms-miniproject.onrender.com//team_details")
            .then(data1 => setData1(data1.data))
            .catch(err => console.log(err))
    },[])
    function upload(x) {
        localStorage.setItem("SelectedTeam", x.tname);
        window.location.href = '/team_players'
    }

    return (
        <body>
            <ul className="team-card-list">
                {data1.map((cardData, index) => (
                    <li key={index} className="team-card">
                        <Link onClick={() => upload(cardData)} className='link-card'>
                            <div className='team-roll-animation'>
                                {
                                    cardData.photo != null ?
                                        <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.tname} className='team_image' />
                                        :
                                        <img src='https://static.vecteezy.com/system/resources/thumbnails/010/884/730/small_2x/owl-head-mascot-team-logo-png.png' alt='idkl' className='team_image' />
                                }
                                <div className='team-text'>
                                    <h1 className='team-text-header'>{cardData.tname}</h1>
                                    <p className='team-text-inside'>Captain: {cardData.captain_name}</p>
                                    <p className='team-text-inside'>Instagram: {cardData.social_id}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </body>
    )
}

export default App
