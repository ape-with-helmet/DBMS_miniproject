const express = require("express");
var mysql = require("mysql");
const fs = require('fs');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded requests
app.use(bodyParser.urlencoded({ extended: true }));
const connection = require('./database.js')

//fetches list of players in a team
app.post("/fetch_team_details", (req, res) => {
    const data = req.body.id;
    const sql = `SELECT p.pname, pt.nickname, CASE WHEN p.pid = t.captain_id THEN 'Captain' ELSE 'Player' END AS captain_status, p.photo AS photo FROM player p JOIN player_team pt ON p.pid = pt.pid JOIN team t ON pt.tid = t.tid WHERE t.tname = '${data}' ORDER BY (CASE WHEN p.pid = t.captain_id THEN 0 ELSE 1 END);    `;
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches list of games
app.get("/game_details", (req, res) => {
    const sql = "SELECT DISTINCT gname, publisher, DATE_FORMAT(release_date, '%Y-%m-%d') as release_date, photo, description FROM game;";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches sponsor of teams
app.post("/sponsor_details", (req, res) => {
    const data = req.body.id;
    const sql = `SELECT s.sname, s.money FROM sponsor s JOIN team t ON s.tid = t.tid WHERE t.tname = '${data}';    `;
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches all details of a particular player
app.post("/fetch_player_details", (req, res) => {
    const data = req.body.id;
    const sql = `SELECT p.pname, DATE_FORMAT(p.dob, '%Y-%m-%d') AS dob, p.origin, p.sex, pt.nickname, t.tname, p.photo, p.description FROM player p JOIN player_team pt ON p.pid = pt.pid JOIN team t ON pt.tid = t.tid WHERE p.pname = '${data}';    `;
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches list of all teams and captains
app.get("/team_details", (req, res) => {
    const sql = "SELECT t.tname, t.trank, p.pname AS captain_name, t.social_id, s.sname, t.photo FROM team t LEFT JOIN sponsor s ON t.tid = s.tid LEFT JOIN player p ON t.captain_id = p.pid;    ";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches all teams in a particular game
app.post("/fetch_game_teams", (req, res) => {
    const data = req.body.id;
    const sql = `SELECT t.tname AS Team_Name, p.pname AS Captain_Name, t.trank AS Team_Rank, t.photo AS Team_Photo FROM team t JOIN player p ON t.captain_id = p.pid JOIN game g ON t.tid = g.tid WHERE g.gname = '${data}' ORDER BY t.trank;    `;
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches merchandise of each team
app.post("/fetch_merch", (req, res) => {
    const data = req.body.id;
    const sql = `SELECT product AS Product, price AS Price, quantity AS Stock FROM merchandise WHERE tid = (SELECT tid FROM team WHERE tname = '${data}' );
    `;
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//decreases stock by 1 for a team
app.post("/buy_merch", (req, res) => {
    const team = req.body.teamname;
    const prod = req.body.merch_name;
    const sql = `UPDATE merchandise SET quantity = CASE WHEN quantity > 0 THEN quantity - 1 ELSE 0 END WHERE tid = (SELECT tid FROM team WHERE tname = '${team}' LIMIT 1) AND product = '${prod}';`;
    connection.query(sql, function (err, response) {
        if (err) throw err;
    })
})

//increases stock by 1 for a team
app.post("/cancel_merch", (req, res) => {
    const team = req.body.teamname;
    const prod = req.body.merch_name;
    const sql = `UPDATE merchandise SET quantity = CASE WHEN quantity < 100 THEN quantity + 1 ELSE 0 END WHERE tid = (SELECT tid FROM team WHERE tname = '${team}' LIMIT 1) AND product = '${prod}';`;
    connection.query(sql, function (err) {
        if (err) throw err;
    })
})
//adds player details
app.post("/add_player_data", (req, res) => {
    const desc = req.body.id.desc;
    const dob = req.body.id.dob;
    const sex = req.body.id.sex;
    const pname = req.body.id.name;
    const origin = req.body.id.origin;
    console.log(req.body, "input")
    const sql = `INSERT INTO player (pname, dob, description, origin, sex) VALUES ('${pname}', '${dob}', '${desc}', '${origin}', '${sex}');`;
    connection.query(sql, function (err) {
        if (err) throw err;
        else res.status(200).send({message:"SUCCESS"})
    })
})


    //establishes connections
    app.listen(8080, () => {
        console.log("port connected")
        connection.connect(function (err) {
            if (err) throw err;
            console.log("Database coletions")
        })
    })