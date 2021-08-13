const mysql = require("mysql");

module.exports = mysql.createPool({
  connectionLimit: 10,
  password: process.env.passDB,
  user: process.env.userDB,
  database: process.env.database,
  host: process.env.hostDB,
  port: process.env.portDB,
  multipleStatements: true,
});