import '../css/Navbar.css'

function navbar() {
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

export default navbar