const qUser = require("../mysql/queryUser");

// package
const crypto = require('crypto');
const bcrypt = require('bcrypt');


exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10) // salt = 10 tours, en suite retourn un promise
        .then((hashPassword) => {

            const hashEmail = crypto.createHmac('sha256', process.env.SHA256_KEY)
                .update(req.body.email)
                .digest('hex');

            const user = new Object({ //creation d'un instance user
                email: hashEmail,
                password: hashPassword,
                pseudo: req.body.pseudo
            });

            qUser.createUser(user)
                .then(() => res.status(201).json({ message: "User created!" }))
                .catch((err) => res.status(400).json(err));

        })
        .catch(error => res.status(500).json({ error }))

};


exports.login = (req, res, next) => {

};