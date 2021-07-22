const db = require("../mysql/queryPost");

exports.getAllPost = (req, res, next) => {
    db.queryAllPost(req.body.postCounter)
        .then((object) => {
            res.status(200).json(object);
        })
        .catch((err) => {
            res.status(404).json(err);
        });
};
