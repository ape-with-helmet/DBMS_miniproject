import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Buffer } from 'buffer'
import '../css/TeamPlayers.css'
import plus from '../pages/plus.png'
import minus from '../pages/minus.png'

const TeamPlayers = () => {
    var [download, setDownload] = useState("")
    const [players, setPlayers] = useState([])
    const [sponsor, setSponsor] = useState([])
    const [merchData, setMerchData] = useState([])

    useEffect(() => {
        setDownload(localStorage.getItem("SelectedTeam"))
    }, [])
    useEffect(() => {
        const getTeamData = async (download) => {
            try {
                const response = await axios.post("http://localhost:8080/fetch_team_details", {
                    id: download
                });
                setPlayers(response.data)
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        getTeamData(download)
    }, [players])
    useEffect(() => {
        const getSpnsorData = async (download) => {
            try {
                const sponsor_response = await axios.post("http://localhost:8080/sponsor_details", {
                    id: download
                });
                setSponsor(sponsor_response.data)
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        getSpnsorData(download)
    })
    useEffect(() => {
        const getMerchData = async (download) => {
            try {
                const merch_response = await axios.post("http://localhost:8080/fetch_merch", {
                    id: download
                });
                setMerchData(merch_response.data)
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
        getMerchData(download)
    })
    function buymerch(x, y) {
        axios.post("http://localhost:8080/buy_merch", {
            teamname: x,
            merch_name: y
        });
    }
    function sellmerch(x, y) {
        axios.post("http://localhost:8080/cancel_merch", {
            teamname: x,
            merch_name: y
        });
    }
    function uploadPlayer(x) {
        localStorage.setItem("SelectedPlayer", x.pname);
        window.location.href = "/player"
    }
    return (
        <div>
            <div className="team-player-main-container">
                <div className="team-player-left">
                    <h1 className='roster'>Sponsors and Merch </h1>
                    <div className="team-player-container">
                        {sponsor.map(spnsr => (
                            <>
                                <div className='sponsor-name'>{spnsr.sname}</div>
                                <div className='sponsor-amount'>Sponsor amount : ${spnsr.money}</div>
                            </>
                        ))}
                        {merchData.map(merchandise => (
                            <div className='merch-line'>
                                <div className="merch-name">{merchandise.Product}</div>
                                <div className="merch-price">${merchandise.Price}</div>
                                <img src={plus} className="merch-plus" onClick={() => buymerch(download, merchandise.Product)} />
                                <span className="merch-stock">{merchandise.Stock}</span>
                                <img src={minus} className="merch-minus" onClick={() => sellmerch(download, merchandise.Product)} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="team-player-right">
                    <h1 className='roster'>{download} Player Roster</h1>
                    <ul className="player-card-list">
                        {players.map((cardData, index) => (<>
                            <li key={index} className='player-card'>
                                <div>
                                    {cardData.captain_status == "Captain" ? <div className='captain-status'></div> : <></>}
                                </div>
                                <Link onClick={() => uploadPlayer(cardData)} className='lonk-plonk'>
                                    <div className='player-roll-animation'>
                                        {
                                            cardData.photo != null ?
                                                <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.tname} className='player-image' />
                                                :
                                                <img src='https://static.vecteezy.com/system/resources/thumbnails/010/884/730/small_2x/owl-head-mascot-team-logo-png.png' className='player-image' />
                                        }
                                        {/* <img src={`data:image/png;base64,${Buffer.from(cardData.photo.data).toString('base64')}`} alt={cardData.pname} className='player-image' /> */}
                                        <div className='player-text'>
                                            <h1 className='player-text-header'>{cardData.nickname}</h1>
                                            <p className='player-text-inside'>AKA {cardData.pname}</p>
                                        </div>
                                    </div>
                                </Link>
                            </li></>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TeamPlayers