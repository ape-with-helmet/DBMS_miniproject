import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import PlayerInfo from './pages/PlayerInfo'
import TeamInfo from './pages/TeamInfo'
import TeamPlayers from './pages/TeamPlayers'
import SpecPlayerInfo from './pages/SpecPlayerInfo'
import Games from './pages/Games'
import GameTeam from './pages/GameTeam'

const App = () => {
  return (
    <>
    <PlayerInfo/>
    <BrowserRouter>
    <Routes>
        <Route element={<TeamInfo/>} path='/team_info'/>
        <Route element={<TeamPlayers/>} path='/team_players'/>
        <Route element={<SpecPlayerInfo/>} path='/player'/>
        <Route element={<Games/>} path='/games'/>
        <Route element={<GameTeam/>} path='/game_team'/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App