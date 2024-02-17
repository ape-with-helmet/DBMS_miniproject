var mysql = require("mysql");

var connection = mysql.createConnection({
    host: '127.0.0.1',
    database: 'esports',
    user: 'root',
    password: ''
});


module.exports = connection;