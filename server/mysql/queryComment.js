const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase

// creation d'un commentaire
exports.queryCreateCommentForPost = (body, postId) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `INSERT INTO Post_commentaire (commentaire, date_publication, user_id, post_id)
            VALUES (${conn.escape(body.text)},
            NOW(),
            ${conn.escape(body.userId)}, 
            ${conn.escape(postId)});
            
            SET @a:=LAST_INSERT_ID();

            UPDATE Post 
            SET comments = comments + 1 
            WHERE id=${conn.escape(postId)};
            
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


// obtenir deux dernier recent commentaire
exports.queryAllCommentsForPost = (body, postId) => {
    return new Promise((resolve, reject) => {
        let n = 2; // How much
        let start = n * body.postCounter;

        conn.query(
            `SELECT pc.*, u.pseudo, acl.status FROM Post_commentaire pc
            LEFT JOIN User u ON pc.user_id=u.id 
            LEFT JOIN account_commentaires_liked acl ON pc.id=acl.commentaire_id AND acl.user_id=${conn.escape(body.postId)}
            WHERE post_id=${conn.escape(postId)}
            ORDER BY date_publication DESC 
            LIMIT ${conn.escape(n)} OFFSET ${conn.escape(start)};`,
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        );
    });
};


// supprime un commentaire
exports.queryDeleteCommentForPost = (userId, commentId, postId) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `DELETE FROM Account_commentaires WHERE commentaire_id=${conn.escape(commentId)} AND user_id=${conn.escape(userId)};
            DELETE FROM Account_commentaires_liked WHERE commentaire_id=${conn.escape(commentId)};
                  
            DELETE FROM Post_commentaire WHERE id=${conn.escape(commentId)} AND user_id=${conn.escape(userId)};
            
            UPDATE Post
            SET comments = comments - 1
            WHERE id=${conn.escape(postId)};`,
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        );
    });
};


// modifier un commentaire
exports.queryModifyCommentForPost = (body, commentId) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `UPDATE Post_commentaire 

            SET 
            commentaire=${conn.escape(body.text)},
            date_modification=NOW()

            WHERE id=${conn.escape(commentId)} AND user_id=${conn.escape(body.userId)}`,
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        );
    });
};