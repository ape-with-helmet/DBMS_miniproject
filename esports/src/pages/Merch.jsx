import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Merch = () => {
    var [download, setDownload] = useState("")
    const [stock, setStock] = useState([])
    useEffect(() => {
        setDownload(localStorage.getItem("SelectedTeam"))
    })
    useEffect(() => {
        const getMerchData = async (download) => {
            try {
                const response = await axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/fetch_merch", {
                    id: download,
                });
                setStock(response.data)
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        getMerchData(download)
    })
    const buymerch = async (bought_merch) => {
        try {
            const response = await axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/buy_merch", {
                teamname: download,
                merch_name: bought_merch
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    const cancelmerch = async (bought_merch) => {
        try {
            const response = await axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/cancel_merch", {
                teamname: download,
                merch_name: bought_merch
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return (
        <div>
            <h1>{download}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Current Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        stock.map(prod => {
                            return (<tr key={prod.Product}>
                                <td>{prod.Product}</td>
                                <td>{prod.Price}</td>
                                <td>{prod.Stock}</td>
                                <td><button onClick={() => buymerch(prod.Product)}>Buy Merch</button></td>
                                <td><button onClick={() => cancelmerch(prod.Product)}>Cancel Order</button></td>
                            </tr>)
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Merch