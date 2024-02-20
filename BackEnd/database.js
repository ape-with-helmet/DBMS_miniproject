var mysql = require("mysql");

var connection = mysql.createConnection({
    host: '0.0.0.0',
    database: 'esports',
    user: 'root',
    password: ''
});


module.exports = connection;