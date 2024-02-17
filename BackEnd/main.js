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

app.get("/player",(req,res)=>{
    const sql = "SELECT m.product AS Product,t.tname AS Team_Name,s.sname AS Sponsor_Name,t.social_id AS Social_ID,p.pname AS Captain_Name FROM merchandise m INNER JOIN team t ON m.tid = t.tid LEFT JOIN sponsor s ON t.tid = s.tid LEFT JOIN player p ON t.captain_id = p.pid WHERE m.tid = 1;";
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