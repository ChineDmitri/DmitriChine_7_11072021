const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase

exports.queryCreateComment = (body, postId) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `INSERT INTO Post_commentaire (commentaire, date_publication, user_id, post_id)
            VALUES (${conn.escape(body.text)},
            NOW(),
            ${conn.escape(body.userId)}, 
            ${conn.escape(postId)});
            
            SET @a:=LAST_INSERT_ID();

            UPDATE Post SET comments = comments + 1;
            
            INSERT INTO Account_commentaires (user_id, commentaire_id)
            VALUES (${conn.escape(body.userId)}, @a);`,
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
