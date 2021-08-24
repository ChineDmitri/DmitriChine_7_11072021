const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase


// query pour creation d'un user
exports.createUser = (body) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `INSERT INTO user(email, password, pseudo, date_inscription)
            VALUES (${conn.escape(body.email)}, ${conn.escape(body.password)}, ${conn.escape(body.pseudo)}, NOW())`,
            (err, result) => {
                // champs user.email et user.pseudo sont unique donc il faut verifié si deja enregisté dans la base
                if (err) {
                    if (err.sqlMessage.includes("'user.email'")) {
                        reject({ "message": "Email deja exist" })
                    }
                    if (err.sqlMessage.includes("'user.pseudo'")) {
                        reject({ "message": "Pseudo deja exist" })
                    }
                    reject(err.sqlMessage);
                } else {
                    resolve(result);
                }
            }
        );

    });
};


// query pour recherch d'un user dans la DB
exports.findUser = (email) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `SELECT * FROM User WHERE email=${conn.escape(email)}`,
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );

    });
};


// query pour recherch par userId
exports.queryGetOneUser = (id) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `SELECT id, pseudo, date_inscription, profil_img_url FROM user WHERE id=${conn.escape(id)}`,
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


// Mise à jour des donné
exports.updateInfoUser = (user) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `UPDATE User
            SET pseudo=${conn.escape(user.pseudo)}, profil_img_url=${conn.escape(user.imageUrl)}
            WHERE id=${conn.escape(user.userId)}`,
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


// desactivé user et mettre dans user_deleted
exports.queryDeletePost = (userId) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `INSERT INTO user_deleted (user_id, email, pseudo)
            SELECT id, email, pseudo FROM user WHERE id=${conn.escape(userId)};
            
            UPDATE User
            SET email=NULL, pseudo=NULL
            WHERE id=${conn.escape(userId)}`,
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



