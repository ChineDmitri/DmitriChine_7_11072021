const mysql = require("mysql");

const conn = mysql.createConnection({
  password: process.env.passDB,
  user: process.env.userDB,
  database: process.env.database,
  host: process.env.hostDB,
  port: process.env.portDB,
});

exports.queryAllPost = (num) => {
  return new Promise((resolve, reject) => {
    let n = 2; // How much
    let start = n * num;
    conn.query(`SELECT * FROM Post 
    ORDER BY date_publication DESC 
    LIMIT ${conn.escape(n)} OFFSET ${conn.escape(start)}`, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results)
      }
    })
  })
}
