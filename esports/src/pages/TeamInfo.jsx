import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/TeamInfo.css'
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';

function App() {
    const [data1, setData1] = useState([]);
    useEffect(()=>{
        axios.get("http://localhost:8080/team_details")
            .then(data1=>setData1(data1.data))
            .catch(err=>console.log(err))
    })
    function upload(x) {
        localStorage.setItem("SelectedTeam",x.tname);
        window.location.href = "/team_players"
    }
    
    return (
        <body>
            <ul className="team-card-list">
                {data1.map((cardData, index) => (
                    <li key={index} className="team-card">
                        <Link onClick={() => upload(cardData)}>
                            <div className='team-roll-animation'>
                                 <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.tname} className='team_image' />
                                <div className='team-text'>
                                    <h1 className='team-text-header'>{cardData.tname}</h1>
                                    <p className='team-text-inside'>Rank {cardData.trank}</p>
                                    <p className='team-text-inside'>Captain: {cardData.captain_name}</p>
                                    <p className='team-text-inside'>Instagram: @{cardData.social_id}</p>
                                    <p className='team-text-inside'>Sponsor<br/>{cardData.sname}</p>
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