import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import '../css/Games.css'
import axios from 'axios'

const Games = () => {
    const [data1, setData1] = useState([]);

    useEffect(() => {
        const getGameDetails = async () => {
            try {
                const response = await axios.get("http://localhost:8080/game_details");
                setData1(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getGameDetails();
    }, []);


    function upload(x) {
        localStorage.setItem("SelectedGame", x.gname);
        window.location.href = "/game_team"
    }
    return (
        <div>
            <ul className="games-card-list">
                {data1.map(cardData => (
                    <li key={cardData.gname} className="games-card">

                        <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.gname} />

                        {/* <h2>{console.log(cardData.photo,"THis is")}{cardData.gname}</h2> */}
                        <p>Publisher: {cardData.publisher}</p>
                        <p>Release Date: {cardData.release_date}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Games