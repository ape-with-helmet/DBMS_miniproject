var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'esports',
    user: 'root',
    password: ''
});


module.exports = connection;