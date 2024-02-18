const express = require("express");
var mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
const connection = require ('./database.js')


app.get("/", cors(), (req, res) => {

});

//

app.get("/player_details",(req,res)=>{
    const sql = "SELECT p.pname, DATE_FORMAT(p.dob, '%d-%m-%Y') AS dob, p.origin, p.sex, pt.nickname, t.tname AS team_name FROM player p JOIN player_team pt ON p.pid = pt.pid JOIN team t ON pt.tid = t.tid;    ";
    connection.query(sql, function(err,results){
        if (err) throw err;
        res.send(results);
    })
})

app.post("/fetch_team_details",(req,res)=>{
    const data = req.body.id;
    const sql = `SELECT p.pname, pt.nickname, CASE WHEN p.pid = t.captain_id THEN 'Captain' ELSE 'Player' END AS captain_status FROM player p JOIN player_team pt ON p.pid = pt.pid JOIN team t ON pt.tid = t.tid WHERE t.tname = '${data}' ORDER BY (CASE WHEN p.pid = t.captain_id THEN 0 ELSE 1 END);    `;
    connection.query(sql, function(err,results){
        if (err) throw err;
        res.send(results);
    })
})

//SELECT DISTINCT gname, publisher, release_date FROM game;
app.get("/game_details",(req,res)=>{
    const sql = "SELECT DISTINCT gname, publisher, release_date FROM game;";
    connection.query(sql, function(err,results){
        if (err) throw err;
        res.send(results);
    })
})

app.post("/fetch_player_details",(req,res)=>{
    const data = req.body.id;
    const sql = `SELECT p.pname, DATE_FORMAT(p.dob, '%Y-%m-%d') AS dob, p.origin, p.sex, pt.nickname, t.tname, p.description FROM player p JOIN player_team pt ON p.pid = pt.pid JOIN team t ON pt.tid = t.tid WHERE p.pname = '${data}';    `;
    connection.query(sql, function(err,results){
        if (err) throw err;
        res.send(results);
    })
})

app.get("/team_details",(req,res)=>{
    const sql = "SELECT t.tname, t.trank, p.pname AS captain_name, t.social_id, s.sname FROM team t LEFT JOIN sponsor s ON t.tid = s.tid LEFT JOIN player p ON t.captain_id = p.pid;    ";
    connection.query(sql, function(err,results){
        if (err) throw err;
        res.send(results);
    })
})

app.listen(8080, () => {
    console.log("port connected")
    connection.connect(function(err){
        if(err) throw err;
        console.log("Database coletions")
    })
})