const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase

// const conn = mysql.createConnection({
//   password: process.env.passDB,
//   user: process.env.userDB,
//   database: process.env.database,
//   host: process.env.hostDB,
//   port: process.env.portDB,
//   multipleStatements: true,
// });

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
      `SELECT * FROM Post 
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

// Query for create post (insertion in tables Post, Post_photo, Account_posts)
exports.queryCreatePost = (post) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `INSERT INTO Post (user_id, date_publication, title, discription)
      VALUES (${conn.escape(post.userId)},
      NOW(),
      ${conn.escape(post.title)}, 
      ${conn.escape(post.discription)});

      SET @a:=LAST_INSERT_ID();

      INSERT INTO Post_photo (url, post_id) 
      VALUES (${conn.escape(post.url1)}, @a),
      (${conn.escape(post.url2)}, @a),
      (${conn.escape(post.url3)}, @a);

      INSERT INTO Account_posts (user_id, post_id)
      VALUES (${conn.escape(post.userId)}, @a);`,
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

exports.queryDeletePost = (body) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `DELETE FROM Post_photo WHERE post_id=${conn.escape(body.postId)};
      DELETE FROM Account_posts WHERE post_id=${conn.escape(body.postId)};
      DELETE FROM Account_posts_liked WHERE post_id=${conn.escape(body.postId)};
      
      DELETE FROM Post WHERE id=${conn.escape(body.postId)};`,
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

// Pour verifie exist pour post like - dilike
exports.queryRecon = (body) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `SELECT * FROM Account_posts_liked 
      
      WHERE post_id=${conn.escape(body.postId)} AND user_id=${conn.escape(body.userId)};`,
      (err, results) => {
        
          resolve(results);
        
      }
    );

  });
};

// Insertion like OR dislike
exports.pushStatus = (body) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `INSERT INTO Account_posts_liked (user_id, post_id, status)
      
      VALUES (${conn.escape(body.userId)},
      ${conn.escape(body.postId)},
      ${conn.escape(body.status)});`,
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

// update like => unlike OR dislike => undislike
exports.updateStatus = (body, status) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `UPDATE account_posts_liked

      SET status=${conn.escape(status)}

      WHERE post_id=${conn.escape(body.postId)} AND user_id=${conn.escape(body.userId)}
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