const mysql = require("mysql");
const conn = require("./config.js"); //config for connection in DataBase

exports.queryGetAllUsers = (userId) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `SELECT * FROM user 
            WHERE NOT id=${conn.escape(userId)}`,
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


exports.queryChangeProfil = (body) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `UPDATE user 

            SET 
            profil=${conn.escape(body.profil)}

            WHERE id=${conn.escape(body.memberId)};`,
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


exports.queryDesavivationAndActivationUser = (body) => {
    return new Promise((resolve, reject) => {

        conn.query(
            `UPDATE User 

            SET 
            active=${conn.escape(!body.status)}

            WHERE id=${conn.escape(body.memberId)};`,
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