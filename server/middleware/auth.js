const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        const userId = decodedToken.userId;

        // console.log(decodedToken)
        // console.log("user id from mw ", userId)

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable';
        } else {

            // attribution userId
            req.userId = userId

            next();
        }

    } catch (error) {
        res.status(401).json({ error: error | 'Request non authorized' })
    }
};