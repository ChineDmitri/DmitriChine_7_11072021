const qComment = require("../mysql/queryComment");


// creation d'un commentaire pour la post
exports.createCommentForPost = (req, res, next) => {

    const body = {
        text: req.body.text,
        userId: req.body.userId
    }

    qComment.queryCreateCommentForPost(body, req.params.id_post)
        .then(() => res.status(201).json({
            message: "Commentaire created!",
            created: true
        }))
        .catch((err) => res.status(400).json(err));

};


// obtenir par deux commentaire plus recents
exports.getAllCommentsForPost = (req, res, next) => {

    let body = {
        userId: req.body.userId,
        postCounter: req.body.postCounter
    };

    qComment.queryAllCommentsForPost(body, req.params.id_post)
        .then((object) => {
            let result = [
                req.body.userId,
                object
            ]

            res.status(200).json(result)
        })
        .catch((err) => res.status(404).json(err));

};


// supprimé un commentaire 
exports.deleteCommentForPost = (req, res, next) => {

    qComment.queryDeleteCommentForPost(req.body.userId, req.params.id_comment, req.params.id_post)
        .then(() => res.status(200).json({ message: "Comment deleted!" }))
        .catch((err) => res.status(400).json(err));

};


// modification d'un commentaire 
exports.modifyCommentForPost = (req, res, next) => {

    const body = {
        userId: req.body.userId,
        text: req.body.text
    }

    qComment.queryModifyCommentForPost(body, req.params.id_comment)
        .then(() => res.status(200).json({
            message: "Comment modify!",
            modified : true
        }))
        .catch((err) => res.status(400).json(err));

};