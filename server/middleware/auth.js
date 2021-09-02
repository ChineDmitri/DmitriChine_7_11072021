const jwt = require('jsonwebtoken');

const qUser = require("../mysql/queryUser");

module.exports = (req, res, next) => {

    // recuperation cookies
    const token = req.cookies.access_token;
    // decodage cookies
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // ici nous avons donné decodé
    const userId = decodedToken.userId;
    const profil = decodedToken.profil;
    const active = decodedToken.active;

    // recuperation donée d'un utilisateur
    // data.userId & data.profil
    const data = req.cookies.data;

    qUser.queryGetOneUser(userId)
        .then((account) => {
            try {
                console.log(account)
                // si dans le deux cookies il y a anomalie ou profil de compté or utilisateur desactivé error 401
                if (data.userId !== userId ||
                    data.profil !== profil ||
                    account[0].profil !== profil ||
                    !account[0].active) {
                    throw 'User ID non valable';
                } else {
                    // attribution userId, son profil(A M U), et compte active: TRUE/FALSE
                    req.body.userId = userId;
                    req.body.profil = profil;
                    req.body.active = active;

                    // console.log('from MW ', req.body.userId)

                    next();
                }
            } catch (error) {
                res.status(401).json({ error: error | 'Request non authorized' })
            }

        })
        .catch((err) => res.status(404).json({ err }))

};