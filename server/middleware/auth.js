const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // recuperation cookies
        const token = req.cookies.access_token;
        // decodage cookies
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // ici nous avons donné decodé
        const userId = decodedToken.userId;
        const profil = decodedToken.profil;

        // recuperation donée d'un utilisateur
        // data.userId & data.profil
        const data = req.cookies.data;

        if (data.userId
            && data.profil
            && data.userId !== userId
            && data.profil !== profil) {
            throw 'User ID non valable';
        } else {
            // attribution userId et son profil(A M U)
            req.body.userId = userId;
            req.body.profil = profil;

            // console.log('from MW ', req.body.userId)

            next();
        }

    } catch (error) {
        res.status(401).json({ error: error | 'Request non authorized' })
    }
};