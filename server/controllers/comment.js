const qComment = require("../mysql/queryComment");

exports.createCommentForPost = (req, res, next) =>  {

    const body = {
        text: req.body.text,
        userId: req.body.userId
    }
    
    qComment.queryCreateComment(body, req.params.id_post)
    .then(() => res.status(201).json({ message: "Commentaire created!" }))
    .catch((err) => res.status(421).json(err));

};