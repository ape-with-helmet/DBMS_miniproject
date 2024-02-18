import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/TeamInfo.css'

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
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Team Rank</th>
                        <th>Captain Name</th>
                        <th>Social ID</th>
                        <th>Sponsor</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data1.map(prod => {
                            return (<tr key={prod.tname}>
                                <td ><button onClick={()=>upload(prod)}>{prod.tname}</button></td>
                                <td>{prod.trank}</td>
                                <td>{prod.captain_name}</td>
                                <td>{prod.social_id}</td>
                                <td>{prod.sname}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default App