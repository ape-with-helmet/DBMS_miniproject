import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Games = () => {
    const [data1, setData1] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8080/game_details")
            .then(data1 => setData1(data1.data))
            .catch(err => console.log(err))
    })
    function upload(x) {
        localStorage.setItem("SelectedGame", x.gname);
        window.location.href = "/game_team"
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Game Name</th>
                        <th>Publisher</th>
                        <th>Release Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data1.map(prod => {
                            return (<tr key={prod.gname}>
                                <td><button onClick={() => upload(prod)}>{prod.gname}</button></td>
                                <td>{prod.publisher}</td>
                                <td>{prod.release_date}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Games