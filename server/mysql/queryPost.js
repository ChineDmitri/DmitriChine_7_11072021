const mysql = require("mysql");

const conn = mysql.createConnection({
  password: process.env.passDB,
  user: process.env.userDB,
  database: process.env.database,
  host: process.env.hostDB,
  port: process.env.portDB,
  multipleStatements: true,
});

exports.queryAllPost = (num) => {
  return new Promise((resolve, reject) => {
    let n = 2; // How much
    let start = n * num;

    conn.query(
      `SELECT * FROM Post 
    ORDER BY date_publication DESC 
    LIMIT ${conn.escape(n)} OFFSET ${conn.escape(start)}`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

exports.queryOnePost = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM post 
    WHERE post.id=${conn.escape(id)}`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

exports.queryCreatePost = (post) => {
  return new Promise((resolve, reject) => {
    conn.query(`
    INSERT INTO Post (date_publication, title, discription)
    VALUES (NOW(), ${conn.escape(post.title)}, 
    ${conn.escape(post.discription)});

    SET @a:=LAST_INSERT_ID();

    INSERT INTO post_photo (url, post_id) 
    VALUES (${conn.escape(post.url1)}, @a),
    (${conn.escape(post.url2)}, @a),
    (${conn.escape(post.url3)}, @a);

    INSERT INTO account_posts (user_id, post_id)
    VALUES (${conn.escape(post.user_id)}, @a);
    `,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// exports.queryCreatePost = (post) => {
//   return new Promise((resolve, reject) => {

//     conn.query(`INSERT INTO Post (date_publication, title, discription)
//     VALUES
//     (NOW(), ${conn.escape(post.title)}, ${conn.escape(post.discription)});`, (err, results) => {
//       if (err) throw err;
//       conn.query('SET @a:=LAST_INSERT_ID();', (err, results) => {
//         if (err) throw err;
//         conn.query(`INSERT INTO post_photo (url, post_id)
//         VALUES
//         (${conn.escape(post.url1)}, @a),
//         (${conn.escape(post.url2)}, @a),
//         (${conn.escape(post.url3)}, @a);`, (err, results) => {
//           if (err) throw err;
//           conn.query(`INSERT INTO account_posts (user_id, post_id)
//           VALUES
//           (${conn.escape(post.user_id)}, @a);`, (err, results) => {
//             if (err) {
//               reject(err)
//             } else {
//               resolve(results)
//             }
//           })
//         })
//       })
//     })

//   })
// }
