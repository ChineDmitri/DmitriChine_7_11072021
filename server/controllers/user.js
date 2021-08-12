const qUser = require("../mysql/queryUser");

// package
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// enregisté un utilisateur
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
                .then(() => res.status(201).json({
                    message: "User created!",
                    created: true
                }))
                .catch((err) => res.status(400).json(err));

        })
        .catch(error => res.status(500).json({ error }))

};


// entré et destribue cookie
exports.login = (req, res, next) => {

    const hashEmail = crypto.createHmac('sha256', process.env.SHA256_KEY)
        .update(req.body.email)
        .digest('hex');

    qUser.findUser(hashEmail)
        .then((user) => {


            if (user.length === 0) {
                return res.status(401).json({
                    message: "Utilisateur n'est pas trouvé",
                    auth: false
                }); // Underfined user
            }
            bcrypt.compare(req.body.password, user[0].password)
                .then((validation) => {
                    if (!validation) {
                        return res.status(401).json({
                            message: "Mot de pass incorrect",
                            auth: false
                        }); // MdP incorrect
                    }

                    const token = jwt.sign(
                        {
                            userId: user[0].id,
                            profil: user[0].profil
                        },
                        process.env.JWT_KEY,
                    )

                    const data = {
                        userId: user[0].id,
                        profil: user[0].profil
                    }

                    // ici token chifré
                    res.cookie('access_token', token, {
                        maxAge: 3600 * 24, // 24 heurs
                        // httpOnly: true, // OWASP utilisation par http seulement
                        // secure: true // secure il faut decommenter en production!

                    });

                    // ici donnée de utilisateur
                    res.cookie('data', data, {
                        maxAge: 3600 * 24, // 24 heurs
                        // httpOnly: true, // OWASP utilisation par http seulement
                        // secure: true // secure il faut decommenter en production!
                    });

                    res.status(200).json({
                        message: "Auth -> OK",
                        auth: true
                    })

                })
                .catch((err) => res.status(502).json({ err }));
        })
        .catch((err) => res.status(501).json({ err }))

};


// obtenir user 
exports.getOneUser = (req, res, next) => {

    if (req.params.id == undefined) {
        qUser.queryGetOneUser(req.body.userId)
            .then((account) => res.status(200).json(account[0]))
            .catch((err) => res.status(404).json({ err }))
    } else {
        qUser.queryGetOneUser(req.params.id)
            .then((account) => res.status(200).json(account[0]))
            .catch((err) => res.status(404).json({ err }))
    }

}