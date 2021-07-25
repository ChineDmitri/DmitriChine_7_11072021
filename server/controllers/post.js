const db = require("../mysql/queryPost");

exports.getAllPost = (req, res, next) => {
    db.queryAllPost(req.body.postCounter)
        .then((object) => res.status(200).json(object))
        .catch((err) => res.status(404).json(err));
};

exports.getOnePost = (req, res, next) => {
    db.queryOnePost(req.params.id)
        .then((object) => res.status(200).json(object))
        .catch((err) => res.status(404).json(err));
};

exports.createPost = (req, res, next) => {
    db.queryCreatePost(req.body)
        .then(() => res.status(201).json({ message: "Post created!" }))
        .catch((err) => res.status(400).json(err));
};

exports.deletePost = (req, res, next) => {
    db.queryDeletePost(req.body)
        .then(() => res.status(200).json({ message: "Post deleted!" }))
        .catch((err) => res.status(400).json(err));
};
