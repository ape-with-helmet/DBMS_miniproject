import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './pages/Navbar'
import TeamInfo from './pages/TeamInfo'
import TeamPlayers from './pages/TeamPlayers'
import SpecPlayerInfo from './pages/SpecPlayerInfo'
import Games from './pages/Games'
import GameTeam from './pages/GameTeam'
import Merch from './pages/Merch'
import Homepage from './pages/Homepage'
import BackGroundImage from './pages/BackGroundImage'

const App = () => {
  return (
    <>
      <BrowserRouter>
      <NavBar/>
      <BackGroundImage/>
        <Routes>
          <Route element={<TeamInfo />} path='/team_info' />
          <Route element={<Homepage />} path='/' />
          <Route element={<TeamPlayers />} path='/team_players' />
          <Route element={<SpecPlayerInfo />} path='/player' />
          <Route element={<Games />} path='/games' />
          <Route element={<GameTeam />} path='/game_team' />
          <Route element={<Merch />} path='/merch' />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App