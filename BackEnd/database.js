require('dotenv').config({path: '../.env'});
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

connection.connect(function(err) {
    if (err) {
        console.error('Environment variables:', process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS);
        console.error('Error connecting to database: ' + err.stack);
        process.exit(1);
    }
    console.log('Database connected as id ' + connection.threadId);
});

module.exports = connection;
