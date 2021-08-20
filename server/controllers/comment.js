const qComment = require("../mysql/queryComment");


// creation d'un commentaire pour la post
exports.createCommentForPost = (req, res, next) => {

    const body = {
        text: req.body.text,
        userId: req.body.userId
    }

    qComment.queryCreateCommentForPost(body, req.params.id_post)
        .then(() => res.status(201).json({ message: "Commentaire created!" }))
        .catch((err) => res.status(421).json(err));

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

            res.status(201).json(result)
        })
        .catch((err) => res.status(421).json(err));

};