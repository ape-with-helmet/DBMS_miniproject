import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import '../css/Games.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Games = () => {
    const [data1, setData1] = useState([]);
    // const history = useHistory()

    // const handleBack = () => {
    //     history.goBack();
    // };
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

                    <li key={index} className="games-card">
                        <Link onClick={() => upload(cardData)}>
                            <div className='roll-animation'>
                                <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.gname} className='game_image' />
                                <div className='games-text'>
                                    <h1 className='game-text-header'>{cardData.gname}</h1>
                                    <p className='game-text-inside'>{cardData.publisher}</p>
                                    <p className='game-text-inside'>{cardData.release_date}</p>
                                    <p className='game-text-inside'>{cardData.description}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Games