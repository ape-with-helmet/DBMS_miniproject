const express = require("express");
var mysql = require("mysql");
const cors = require("cors");
const app = express();
const fs = require('fs');
const { send } = require("process");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get("/", cors(), (req, res) => {

});
app.listen(8080, () => {
    console.log("port connected")
})