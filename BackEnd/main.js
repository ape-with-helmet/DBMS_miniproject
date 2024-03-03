const express = require("express");
var mysql = require("mysql");
const fs = require('fs');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json({ limit: '500mb' }));

// Parse application/x-www-form-urlencoded requests
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
const connection = require('./database.js');
const { error } = require("console");

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
    const sql = "SELECT gname, publisher, DATE_FORMAT(release_date, '%Y-%m-%d') as release_date, photo, description FROM game;";
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
    const sql = "SELECT t.tname, p.pname AS captain_name, t.social_id, s.sname, t.photo FROM team t LEFT JOIN sponsor s ON t.tid = s.tid LEFT JOIN player p ON t.captain_id = p.pid;    ";
    connection.query(sql, function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

//fetches all teams in a particular game
app.post("/fetch_game_teams", (req, res) => {
    const data = req.body.id;
    const sql = `SELECT t.tname AS Team_Name, p.pname AS Captain_Name, t.photo AS Team_Photo FROM team t JOIN player p ON t.captain_id = p.pid JOIN game_team g ON t.tid = g.tid WHERE g.gname = '${data}';    `;
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
const multer = require('multer');
const upload = multer(); // Initialize multer

app.post("/add_player_data", upload.single('photo'), (req, res) => {
    const desc = req.body.desc;
    const dob = req.body.dob;
    const sex = req.body.sex;
    const pname = req.body.name;
    const origin = req.body.origin;
    const photo = req.file.buffer; // Use req.file.buffer to get the binary data of the photo
    // console.log(req.body)
    // console.log(desc,dob,sex,pname,origin,photo, "input");

    const sql = `INSERT INTO player (pname, dob, description, origin, sex, photo) VALUES (?, ?, ?, ?, ?, ?);`;
    connection.query(sql, [pname, dob, desc, origin, sex, photo], function (err,response) {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send({ message: "Error inserting data" });
        } else {
            console.log(response)
            res.status(200).send({ message: "SUCCESS" });
        }
    });
});



//adds team details
app.post("/add_team_data",  upload.single('photo'), (req, res) => {
    // Extract data from the request
    const { name, social, p1, p2, p3 } = req.body;
    const photo = req.file.buffer; // Access the uploaded image buffer

    // Insert team data into the database
    const sql1 = `INSERT INTO team (tname, social_id, photo) VALUES (?, ?, ?)`;
    connection.query(sql1, [name, social, photo], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Error occurred while adding team data" });
        } else {
            // Insert player-team relations into the database
            const tid = result.insertId; // Get the ID of the inserted team
            const sql2 = `INSERT INTO player_team (tid, pid) VALUES ?`;
            const values = [[tid, p1], [tid, p2], [tid, p3]];
            connection.query(sql2, [values], (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error occurred while adding player data to team" });
                } else {
                    res.status(200).json({ message: "Team and player data added successfully" });
                }
            });
        }
    });
});


app.get("/get_notfullteams", (req, res) => {
    const sql = `SELECT * FROM player WHERE pid NOT IN (SELECT pid FROM player_team);    `;
    connection.query(sql, function (err, response) {
        if (err) throw err;
        else res.send(response);
    })
})

//Uses a stored procedure GetTeamsWithNoCaptain which runs the sql query SELECT * FROM team where captain_is is NULL;
app.get("/get_blank_team", (req, res) => {
    const sql = `CALL GetTeamsWithNoCaptain();`;
    connection.query(sql, function (err, response) {
        if (err) throw err;
        else res.send(response);
    })
})
//returns players of a given team iff the team doesnt have a captain
app.post("/given_team_players", (req, res) => {
    const tname = req.body.id
    const sql = `SELECT p.* FROM player p JOIN player_team pt ON p.pid = pt.pid JOIN team t ON pt.tid = t.tid WHERE t.tname = '${tname}' AND t.captain_id IS NULL;    `
    connection.query(sql, function (err, response) {
        if (err) throw err;
        else res.send(response);
    })
})
//updates captain value from NULL
app.post("/add_captain", (req, res) => {
    const tname = req.body.id.team
    const cap_id = req.body.id.captain
    const sname = req.body.id.sponsor
    const amount = req.body.id.amount
    const nick1 = req.body.id.nick1
    const nick2 = req.body.id.nick2
    const nick3 = req.body.id.nick3
    const p1 = req.body.id.p1
    const p2 = req.body.id.p2
    const p3 = req.body.id.p3
    console.log(p1,p2,p3)
    const sql = `UPDATE team SET captain_id = ${cap_id} WHERE tname = '${tname}';`
    const sql2 = `INSERT INTO sponsor (tid,sname,money) VALUES ((SELECT tid FROM team WHERE tname='${tname}'), '${sname}', ${amount}) `
    const sql3 = `UPDATE player_team SET nickname = ? WHERE pid = ?`
    const sql4 = `UPDATE player_team SET nickname = ? WHERE pid = ?`
    const sql5 = `UPDATE player_team SET nickname = ? WHERE pid = ?`
    connection.query(sql, function (err, response) {
        if (err) throw err;
        else {
            connection.query(sql2, function (err, response) {
                if (err) throw err;
                else {
                    connection.query(sql3, [nick1, p1], function (err, response) {
                        if (err) throw err;
                        else {
                            connection.query(sql4, [nick2, p2], function (err, response) {
                                if (err) throw err;
                                else {
                                    connection.query(sql5, [nick3, p3], function (err, response) {
                                        if (err) throw err;
                                        else {
                                            res.send(response);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

})

app.post("/createMerch",(req,res)=>{
    const m1 = req.body.id.m1
    const m2 = req.body.id.m2
    const m3 = req.body.id.m3
    const p1 = req.body.id.p1
    const p2 = req.body.id.p2
    const p3 = req.body.id.p3
    const q1 = req.body.id.q1
    const q2 = req.body.id.q2
    const q3 = req.body.id.q3
    const tname = req.body.id.tid
    const sql1 = `INSERT INTO merchandise (tid, product, price, quantity) VALUES ((SELECT tid FROM team WHERE tname = '${tname}'), '${m1}', ${p1}, ${q1});    `
    const sql2 = `INSERT INTO merchandise (tid, product, price, quantity) VALUES ((SELECT tid FROM team WHERE tname = '${tname}'), '${m2}', ${p2}, ${q2});    `
    const sql3 = `INSERT INTO merchandise (tid, product, price, quantity) VALUES ((SELECT tid FROM team WHERE tname = '${tname}'), '${m3}', ${p3}, ${q3});    `
    connection.query(sql1, function(err,response){
        if (err) throw err;
        else{
            connection.query(sql2, function(err,response){
                if (err) throw err;
                else{
                    connection.query(sql3, function(err,response){
                        if (err) throw err;
                        else res.send({message:"Success"})
                    })
                }
            })
        }
    })
})

app.post("/login",(req,res)=>{
    const {email,password} = req.body;
    console.log(email,password)
    const sql = `SELECT email FROM LOGIN WHERE email = '${email}' AND pwd = '${password}';`
    connection.query(sql, function(err,response){
        if (err) {
            console.log(err)
        }else{
            const data = response[0];
            console.log(data)
            res.send({message:"Login success", data:data});
        }
    })  
})

app.post("/games_not_played_by_team",(req,res)=>{
    const team = req.body.id;
    if (!team) {
        return res.send({payload:[],message:"Error"});
    }
    console.log(team)
    const sql = `SELECT DISTINCT gname FROM game_team WHERE gname NOT IN (SELECT gname FROM game_team WHERE tid = (SELECT tid FROM team WHERE tname = ?));`
    connection.query(sql,[team],function(err,response){
        if (err) throw err;
        else{
            console.log(response)
            res.send({payload:response,message:"Success"})
        }
    })
})

app.post("/add_team_to_game",(req,res)=>{
    const team = req.body.team;
    const game = req.body.game;
    console.log(team,game)
    const sql = `INSERT INTO game_team (tid, gname) SELECT team.tid, ? FROM team WHERE team.tname = ?;`
    connection.query(sql,[game,team],function(err,response){
        if (err) throw err;
        else{
            return res.send({message:"Success"})
        }
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