const qUser = require("../mysql/queryUser");
const modules = require("../modules/index");

// package
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { reject } = require("bcrypt/promises");

// enregisté un utilisateur
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10) // salt = 10 tours, en suite retourn un promise
        .then((hashPassword) => {

            const hashEmail = crypto.createHmac('sha256', process.env.SHA256_KEY)
                .update(req.body.email.toLowerCase())
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
        .update(req.body.email.toLowerCase())
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

                    if (!user[0].active) {
                        return res.status(401).json({
                            message: "Utilisateur n'est pas activé, veuillez attendre la validation du compte",
                            auth: false
                        }); // Underfined user
                    }

                    const token = jwt.sign(
                        {
                            userId: user[0].id,
                            profil: user[0].profil,
                            active: user[0].active
                        },
                        process.env.JWT_KEY,
                    )

                    const data = {
                        userId: user[0].id,
                        profil: user[0].profil,
                        active: user[0].active
                    }

                    // ici token chifré
                    res.cookie('access_token', token, {
                        maxAge: 60000 * 60 * 24, // 24 heurs
                        httpOnly: true // OWASP utilisation par http seulement
                        // secure: true // secure il faut decommenter en production!

                    });

                    // ici donnée de utilisateur
                    res.cookie('data', data, {
                        maxAge: 60000 * 60 * 24, // 24 heurs
                        httpOnly: true // OWASP utilisation par http seulement
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


// LogOut (suppretion des cookies)
exports.logout = (req, res, next) => {

    res.clearCookie("access_token"); // Suppprimé cookies avec token

    res.clearCookie("data"); // Supprimé cookies avec les donné

    res.status(200).json({
        message: "LogOut -> OK",
        logout: true
    })
}


// destribution de info user
exports.getInfo = (req, res, next) => {

    res.status(200).json({
        user: req.body.userId,
        profil: req.body.profil,
        active: req.body.active
    })

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
    };

};


// modifcation info user 
exports.modifyInfoUser = (req, res, next) => {

    const userObject = req.file ? // s'il existe on parse body Sauce SINON on reste simple
        { // true 1
            pseudo: req.body.pseudo,
            userId: req.body.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : {
            pseudo: req.body.pseudo,
            userId: req.body.userId,
            imageUrl: req.body.imageUrl
        }; // false 0

    // si on modifier une image pour un user, il ne faut pas oublier supprime l'ancienne   
    qUser.queryGetOneUser(req.body.userId)
        .then((user) => {
            if (user[0].profil_img_url !== "http://localhost:3000/images/custom_photo_user.png" &&
                user[0].profil_img_url !== null) {
                // console.log(user[0])
                modules.deleteImg(user[0].profil_img_url)
                    .then(() => { })
                    .catch(err => console.log(err)) // si jamais fichier n'existé pas envoyer error (par ex. 4058)
            }

            // mise à jour des donnée d'un utilisateur
            qUser.updateInfoUser(userObject)
                .then(() => res.status(200).json({
                    message: 'User info modified',
                    status: true
                }))
                .catch((error) => res.status(404).json({ error }));
        })

        .catch((error) => res.status(500).json({ error }));


};


// delete user 
exports.deleteUser = (req, res, next) => {

    qUser.queryGetOneUser(req.body.userId)
        .then((user) => {
            if (user[0].profil_img_url !== "http://localhost:3000/images/custom_photo_user.png" &&
                user[0].profil_img_url !== null) {
                // console.log(user[0])
                modules.deleteImg(user[0].profil_img_url)
                    .then(() => { })
                    .catch(err => console.log(err)) // si jamais fichier n'existé pas envoyer error (par ex. 4058)
            }

            qUser.queryDeleteUser(req.body.userId)
                .then(() => {

                    res.clearCookie("access_token"); // supprimé cookie avec tooken

                    res.clearCookie("data"); // supprimé cookie avec des donnés: userId et profil(admin, user...)

                    res.status(200).json({
                        message: "User deleted!",
                        deleted: true
                    })
                })
                .catch((err) => res.status(400).json(err));

        })
        .catch((error) => res.status(500).json({ error }));

};


// modification mot de pass
exports.changePass = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then((hashEmail) => {

            qUser.queryUpdatePassword(hashEmail, req.body.userId)
                .then(() => {
                    res.clearCookie("access_token"); // Suppprimé cookies avec token

                    res.clearCookie("data"); // Supprimé cookies avec les donné

                    res.status(500).json({
                        message: "Mot de passe changé",
                        modified: true,
                    })
                })
                .catch((err) => {
                    res.status(500).json(err)
                })
        })
        .catch((err) => res.status(501).json({ err }));

}

