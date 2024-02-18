import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../css/PlayerInfo.css'

function App() {
    function team () {
        window.location.href = "/team_info"
    }
    function game () {
        window.location.href = "/games"
    }
    return (
        <div>
            <button onClick={team}>Teams</button>
            <button onClick={game}>Games</button>
        </div>
    )
}

export default App