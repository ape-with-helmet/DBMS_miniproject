const express = require("express");
var mysql = require("mysql2");
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
// Fetches all teams in a particular game
app.post("/fetch_game_teams", (req, res) => {
    const data = req.body.id;

    const sql = `SELECT t.tname AS Team_Name, p.pname AS Captain_Name, t.photo AS Team_Photo FROM team t JOIN player p ON t.captain_id = p.pid JOIN game_team g ON t.tid = g.tid WHERE g.gname = ?;`;

    connection.query(sql, [data], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data');
            return;
        }

        // Convert photo column from binary to Base64
        const resultsWithBase64 = results.map(row => {
            if (row.Team_Photo) {
                row.Team_Photo = Buffer.from(row.Team_Photo).toString('base64');
            }
            return row;
        });
        res.send(resultsWithBase64);
    });
});

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
        res.send(response);
    })
})

//increases stock by 1 for a team
app.post("/cancel_merch", (req, res) => {
    const team = req.body.teamname;
    const prod = req.body.merch_name;
    const sql = `UPDATE merchandise SET quantity = CASE WHEN quantity < 100 THEN quantity + 1 ELSE 0 END WHERE tid = (SELECT tid FROM team WHERE tname = '${team}' LIMIT 1) AND product = '${prod}';`;
    connection.query(sql, function (err) {
        if (err) throw err;
        res.send();
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
    const photo = req.file.buffer; 

    const sql = `INSERT INTO player (pname, dob, description, origin, sex, photo) VALUES (?, ?, ?, ?, ?, ?);`;
    connection.query(sql, [pname, dob, desc, origin, sex, photo], function (err,response) {
        if (err) {
            res.status(500).send({ message: "Error inserting data" });
        } else {
            res.status(200).send({ message: "Added the player to the Roster!" });
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
            res.status(500).json({ message: "Error occurred while adding team data" });
        } else {
            // Insert player-team relations into the database
            const tid = result.insertId; // Get the ID of the inserted team
            const sql2 = `INSERT INTO player_team (tid, pid) VALUES ?`;
            const values = [[tid, p1], [tid, p2], [tid, p3]];
            connection.query(sql2, [values], (err) => {
                if (err) {
                    res.status(500).json({ message: "Error occurred while adding player data to team" });
                } else {
                    res.status(200).json({ message: "Team and player data added successfully" });
                }
            });
        }
    });
});


app.get("/unassigned_players", (req, res) => {
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
app.post("/add_captain_and_create_merch", (req, res) => {
    // Data from the request
    const { team, captain, sponsor, amount, nick1, nick2, nick3, p1, p2, p3 } = req.body.team;
    const { m1, m2, m3, p1: mp1, p2: mp2, p3: mp3, q1, q2, q3, tid: tname } = req.body.merch;

    // SQL Queries
    const sqlAddCaptain = `UPDATE team SET captain_id = ${captain} WHERE tname = '${team}';`;
    const sqlInsertSponsor = `INSERT INTO sponsor (tid, sname, money) VALUES ((SELECT tid FROM team WHERE tname='${team}'), '${sponsor}', ${amount});`;
    const sqlUpdateNick1 = `UPDATE player_team SET nickname = ? WHERE pid = ?`;
    const sqlInsertMerch1 = `INSERT INTO merchandise (tid, product, price, quantity) VALUES ((SELECT tid FROM team WHERE tname = '${tname}'), '${m1}', ${mp1}, ${q1});`;
    const sqlInsertMerch2 = `INSERT INTO merchandise (tid, product, price, quantity) VALUES ((SELECT tid FROM team WHERE tname = '${tname}'), '${m2}', ${mp2}, ${q2});`;
    const sqlInsertMerch3 = `INSERT INTO merchandise (tid, product, price, quantity) VALUES ((SELECT tid FROM team WHERE tname = '${tname}'), '${m3}', ${mp3}, ${q3});`;

    connection.beginTransaction(err => {
        if (err) {
            return res.status(500).send({ error: "Transaction error", details: err });
        }

        // Execute the add_captain logic
        connection.query(sqlAddCaptain, (err, response) => {
            if (err) {
                return connection.rollback(() => {
                    res.status(500).send({ error: "Error in add_captain", details: err });
                });
            }

            connection.query(sqlInsertSponsor, (err, response) => {
                if (err) {
                    return connection.rollback(() => {
                        res.status(500).send({ error: "Error in inserting sponsor", details: err });
                    });
                }

                connection.query(sqlUpdateNick1, [nick1, p1], (err, response) => {
                    if (err) {
                        return connection.rollback(() => {
                            res.status(500).send({ error: "Error in updating nickname 1", details: err });
                        });
                    }

                    connection.query(sqlUpdateNick1, [nick2, p2], (err, response) => {
                        if (err) {
                            return connection.rollback(() => {
                                res.status(500).send({ error: "Error in updating nickname 2", details: err });
                            });
                        }

                        connection.query(sqlUpdateNick1, [nick3, p3], (err, response) => {
                            if (err) {
                                return connection.rollback(() => {
                                    res.status(500).send({ error: "Error in updating nickname 3", details: err });
                                });
                            }

                            // Execute the createMerch logic
                            connection.query(sqlInsertMerch1, (err, response) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        res.status(500).send({ error: "Error in creating merch 1", details: err });
                                    });
                                }

                                connection.query(sqlInsertMerch2, (err, response) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            res.status(500).send({ error: "Error in creating merch 2", details: err });
                                        });
                                    }

                                    connection.query(sqlInsertMerch3, (err, response) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                res.status(500).send({ error: "Error in creating merch 3", details: err });
                                            });
                                        }

                                        // If everything succeeded, commit the transaction
                                        connection.commit(err => {
                                            if (err) {
                                                return connection.rollback(() => {
                                                    res.status(500).send({ error: "Transaction commit error", details: err });
                                                });
                                            }
                                            res.send({ message: "Success" });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

const bcrypt = require('bcrypt');
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the email and hashed password into the database
        const sql = `INSERT INTO LOGIN (email, pwd) VALUES (?, ?)`;
        connection.query(sql, [email, hashedPassword], function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: "Error storing password" });
            }
            res.send({ message: "Password stored successfully" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
});
// During login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT email, pwd FROM LOGIN WHERE email = '${email}';`;
    
    connection.query(sql, function (err, response) {
        if (err) {
            console.log(err);
        } else {
            if (response.length > 0) {
                const hashedPassword = response[0].pwd;
                // Compare the entered password with the stored hashed password
                bcrypt.compare(password, hashedPassword, function(err, result) {
                    if (result) {
                        // Passwords match
                        res.send({ message: "Login success", data: response[0] });
                    } else {
                        // Passwords don't match
                        res.send({ message: "Invalid credentials" });
                    }
                });
            } else {
                res.send({ message: "Invalid credentials" });
            }
        }
    });
});


app.post("/games_not_played_by_team",(req,res)=>{
    const team = req.body.id;
    if (!team) {
        return res.send({payload:[],message:"Error"});
    }
    const sql = `SELECT DISTINCT gname FROM game WHERE gname NOT IN (SELECT gname FROM game_team WHERE tid = (SELECT tid FROM team WHERE tname = ?));`
    connection.query(sql,[team],function(err,response){
        if (err) throw err;
        else{
            res.send({payload:response,message:"Success"})
        }
    })
})

app.post("/add_team_to_game",(req,res)=>{
    const team = req.body.team;
    const game = req.body.game;
    const sql = `INSERT INTO game_team (tid, gname) SELECT team.tid, ? FROM team WHERE team.tname = ?;`
    connection.query(sql,[game,team],function(err,response){
        if (err) throw err;
        else{
            return res.send({message:"Success"})
        }
    })
})




// //temporarily used for testing
// app.post("/update_game_photo", (req, res) => {
//     const { gname, photoBase64 } = req.body;

//     // Convert base64 string to binary buffer
//     const photoBuffer = Buffer.from(photoBase64, 'base64');

//     const sql = `UPDATE player SET photo = ? WHERE pid = ?`;
//     connection.query(sql, [photoBuffer, gname], (err, results) => {
//         if (err) {
//             console.error("Error updating photo: ", err);
//             res.status(500).send("Database error.");
//             return;
//         }
//         res.send("Photo updated successfully.");
//     });
// });







//establishes connections
app.listen(8080, () => {
    console.log("port connected")
})