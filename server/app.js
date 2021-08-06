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
    return console.error("Oups, --ERROR: " + err.message);
  } else {
    console.log("Database connection --TEST: OK!");
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

app.use(bodyParser.json());

// ICI DEBUT DES API
// require ROUTES 
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// use this ROUTES
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

module.exports = app;
