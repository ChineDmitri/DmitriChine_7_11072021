const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase

exports.queryCreateComment = (comment, postId) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `INSERT INTO Post_commentaire (commentaire, date_publication, user_id, post_id)
            VALUES (${conn.escape(comment.text)},
            NOW(),
            ${conn.escape(comment.userId)}, 
            ${conn.escape(postId)});
            
            SET @a:=LAST_INSERT_ID();
            
            INSERT INTO Account_commentaires (user_id, commentaire_id)
            VALUES (${conn.escape(comment.userId)}, @a);`,
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(reject)
                }
            }
        );
    });
};
