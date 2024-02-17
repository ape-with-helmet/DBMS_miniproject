import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
    const [data, setData] = useState([]);
    useEffect(()=>{
        axios.get("http://localhost:8080/player")
            .then(data1=>setData(data1.data))
            .catch(err=>console.log(err))
            console.log(data)
    },data)
    return (
        <div>
            <button>HII</button>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>tNAME</th>
                        <th>spns</th>
                        <th>socal</th>
                        <th>capname</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map(prod => {
                            return (<tr key={prod.Product}>
                                <h1 className='about-us'>{prod.Product}</h1>
                                <td>{prod.Team_Name}</td>
                                <td>{prod.Sponsor_Name}</td>
                                <td>{prod.Social_ID}</td>
                                <td>{prod.Captain_Name}</td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default App