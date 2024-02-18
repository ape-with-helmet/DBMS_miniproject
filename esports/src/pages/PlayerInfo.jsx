import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/PlayerInfo.css'

function App() {
    const [data1, setData1] = useState([]);
    useEffect(()=>{
        axios.get("http://localhost:8080/player_details")
            .then(data1=>setData1(data1.data))
            .catch(err=>console.log(err))
    },[])
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Dob</th>
                        <th>Origin</th>
                        <th>Sex</th>
                        <th>Nickname</th>
                        <th>Team Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data1.map(prod => {
                            return (<tr key={prod.pname}>
                                <td className='about-us'>{prod.pname}</td>
                                <td>{prod.dob}</td>
                                <td>{prod.origin}</td>
                                <td>{prod.sex}</td>
                                <td>{prod.nickname}</td>
                                <td>{prod.team_name}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default App