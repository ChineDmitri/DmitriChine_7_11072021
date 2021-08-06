const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase

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