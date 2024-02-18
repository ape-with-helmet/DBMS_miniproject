import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import PlayerInfo from './pages/PlayerInfo'
import TeamInfo from './pages/TeamInfo'
import TeamPlayers from './pages/TeamPlayers'
import SpecPlayerInfo from './pages/SpecPlayerInfo'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
        {/* <Route element={<PlayerInfo/>} path='/player_info'/> */}
        <Route element={<TeamInfo/>} path='/team_info'/>
        <Route element={<TeamPlayers/>} path='/team_players'/>
        <Route element={<SpecPlayerInfo/>} path='/player'/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App