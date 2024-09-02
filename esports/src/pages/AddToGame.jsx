import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/AddToGame.css'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AddToGame = () => {
    const [teams, setTeams] = useState([])
    const [gameForm, setGameForm] = useState('')
    const [nonPart, setNon] = useState([])
    const [selGame, setSelGame] = useState('')
    useEffect(() => {
        const getTeam = async () => {
            const response = await axios.get("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/team_details");
            setTeams(response.data)
        }
        getTeam();
    }, [])
    useEffect(() => {
        const getNonPart = async () => {
            const response = await axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/games_not_played_by_team", {
                id: gameForm
            })
            setNon(response.data.payload)
        }
        getNonPart();
    }, [gameForm])
    async function handleAddGame() {
        if (!gameForm || !selGame) {
            return toast.error("Enter the details");
        }
        const response = await toast.promise(axios.post("https://b098-2405-201-d00f-608c-4e4b-9e5b-b74a-27a/add_team_to_game", {
            team: gameForm,
            game: selGame
        }),{
            pending: "Waiting for server response...",
            success: "Game added successfully!",
            error: "Failed to add game.",
        })
        setTimeout(()=>{
            window.location.href='/'
        },2000)
    }
    function handleTeamChange(e) {
        const { name, value, type } = e.target;
        const val = type === 'file' ? e.target.files[0] : value;
        setGameForm(val);
    }
    function handleGameChange(e) {
        const { name, value, type } = e.target;
        const val = type === 'file' ? e.target.files[0] : value;
        setSelGame(val);
    }

    return (
        <>
            <div className="select-game-container">
                <form className='select-game-form'>
                    <h1>Enroll for games</h1>
                    <select className='select-game-form-inside' type="dropdown" name='select-team' value={gameForm} onChange={handleTeamChange}>
                        <option value='' disabled>Choose your Team</option>
                        {
                            teams.map(team => (
                                <option value={team.tname}>{team.tname}</option>
                            ))
                        }
                    </select>
                    <select
                        className='select-game-form-inside'
                        type="dropdown"
                        name='select-team'
                        value={selGame}
                        onChange={handleGameChange}
                        disabled={!nonPart[0] ? true : false}>
                        <option value='' disabled>Choose your game</option>
                        {
                            nonPart.map(team => (
                                <option value={team.gname}>{team.gname}</option>
                            ))
                        }
                    </select>
                    <button type='button' className='team-submit' onClick={() => handleAddGame()}>Submit</button>
                </form>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}

export default AddToGame