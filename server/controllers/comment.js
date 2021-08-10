const qComment = require("../mysql/queryComment");

exports.createCommentForPost = (req, res, next) =>  {

    qComment.queryCreateComment(req.body, req.params.id_post)
    .then(() => res.status(201).json({ message: "Commentaire created!" }))
    .catch((err) => res.status(421).json(err));

};