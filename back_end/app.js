const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const path = require("path");

const conn = mysql.createConnection({
  password: process.env.passDB,
  user: process.env.userDB,
  database: process.env.database,
  host: process.env.hostDB,
  port: process.env.portDB,
});

conn.connect((err) => {
  if (err) {
    return console.error("Oups, ERROR: " + err.message);
  } else {
    console.log("Connection to mysql has been started");
  }
});

conn.end();

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTION"
  );
  next();
});

app.use(express.json());

// ICI DEBUT DES API
// ROUTES 
const postRoutes = require('./routes/post');

app.use('/api/post', postRoutes);

module.exports = app;
