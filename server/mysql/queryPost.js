const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase


//Query for get all post by 2
exports.queryAllPost = (body) => {
  return new Promise((resolve, reject) => {
    let n = 2; // How much
    let start = n * body.postCounter;

    conn.query(
      `SELECT p.*, pp.url_img, u.pseudo, apl.status FROM Post p
      LEFT JOIN User u ON p.user_id=u.id 
      LEFT JOIN account_posts_liked apl ON p.id=apl.post_id AND apl.user_id=${conn.escape(body.userId)}
      LEFT JOIN post_photo pp ON p.id=pp.post_id
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


// Query for get one post
exports.queryOnePost = (id, userId) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `SELECT p.*, pp.url_img, u.pseudo, apl.status FROM Post p
      LEFT JOIN User u ON p.user_id=u.id 
      LEFT JOIN account_posts_liked apl ON p.id=apl.post_id AND apl.user_id=${conn.escape(userId)}
      LEFT JOIN post_photo pp ON p.id=pp.post_id
      WHERE p.id=${conn.escape(id)}`,
      (err, results) => {
        if (err || results[0] === undefined) {
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

      INSERT INTO Post_photo (url_img, post_id) 
      VALUES (${conn.escape(post.imageUrl)},
      @a);

      INSERT INTO Account_posts (user_id, post_id)
      VALUES (${conn.escape(post.userId)}, 
      @a);`,
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


// Query for modification post
exports.queryModifyPost = (postId, post) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `UPDATE Post 
      SET date_modification=NOW(),
      title=${conn.escape(post.title)},
      discription=${conn.escape(post.discription)}
      WHERE id=${conn.escape(postId)};
      
      UPDATE Post_photo 
      SET url_img=${conn.escape(post.imageUrl)}
      WHERE post_id=${conn.escape(postId)};`,
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


// Query for delete post et ses photo, statistic account et like/dislike
exports.queryDeletePost = (userId, postId) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `DELETE FROM Post_photo WHERE post_id=${conn.escape(postId)};
      DELETE FROM Account_posts WHERE post_id=${conn.escape(postId)};
      DELETE FROM Account_posts_liked WHERE post_id=${conn.escape(postId)};
      

      DELETE ac.* FROM Post_commentaire pc 
      LEFT JOIN account_commentaires ac ON pc.id=ac.commentaire_id 
      WHERE pc.post_id=${conn.escape(postId)};

      DELETE acl.* FROM Post_commentaire pc 
      LEFT JOIN account_commentaires_liked acl ON pc.id=acl.commentaire_id 
      WHERE pc.post_id=${conn.escape(postId)};

      DELETE FROM Post_commentaire WHERE post_id=${conn.escape(postId)};
      
      DELETE FROM Post WHERE id=${conn.escape(postId)};`,
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


// START pour LIKE et DISLIKE
// Pour verifie exist pour post like - dilike
exports.queryRecon = (body) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `SELECT * FROM Account_posts_liked 
      
      WHERE post_id = ${conn.escape(body.postId)} AND user_id = ${conn.escape(body.userId)}; `,
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


// Insertion like OR dislike
exports.pushStatus = (body) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `INSERT INTO Account_posts_liked(user_id, post_id, status)

    VALUES(${conn.escape(body.userId)},
      ${conn.escape(body.postId)},
      ${conn.escape(body.status)});
      
      UPDATE Post 
      SET likes = (SELECT sum(status) FROM account_posts_liked WHERE post_id = ${conn.escape(body.postId)} AND status = 1)
      WHERE id = ${conn.escape(body.postId)};
      
      UPDATE Post 
      SET dislikes = (SELECT sum(status) FROM account_posts_liked WHERE post_id = ${conn.escape(body.postId)} AND status = -1)
      WHERE id = ${conn.escape(body.postId)}; `,
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
      `UPDATE Account_posts_liked

      SET status = ${conn.escape(status)}

      WHERE post_id = ${conn.escape(body.postId)} AND user_id = ${conn.escape(body.userId)};
      
      UPDATE Post 
      SET likes = (SELECT sum(status) FROM account_posts_liked WHERE post_id = ${conn.escape(body.postId)} AND status = 1)
      WHERE id = ${conn.escape(body.postId)};
      
      UPDATE Post 
      SET dislikes = (SELECT sum(status) FROM account_posts_liked WHERE post_id = ${conn.escape(body.postId)} AND status = -1)
      WHERE id = ${conn.escape(body.postId)}; `,
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
// FIN pour LIKE et DISLIKE


exports.queryGetAllPostForUser = (accountId, memberId) => {
  return new Promise((resolve, reject) => {

    conn.query(
      `SELECT p.*, pp.url_img, u.pseudo, apl.status FROM Post p
      LEFT JOIN User u ON p.user_id=u.id 
      LEFT JOIN account_posts_liked apl ON p.id=apl.post_id AND apl.user_id=${conn.escape(memberId)}
      LEFT JOIN post_photo pp ON p.id=pp.post_id
      WHERE p.user_id=${conn.escape(accountId)}
      ORDER BY date_publication DESC;`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );

  });
}