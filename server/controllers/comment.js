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
        .then(() => res.status(200).json({
            message: "Comment deleted!"
        }))
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
            modified: true
        }))
        .catch((err) => res.status(400).json(err));

};


// pour le vote d'un commentaire
exports.voteComment = (req, res, next) => {

    const body = {
        userId: req.body.userId,
        commentId: Number(req.params.id), // en params: String il faut transferer
        status: req.body.status,
    };


    qComment.queryRecon(body)
        // si était jamais liké ou disliké crée nouveau INSERT
        .then((result) => {
            console.log(body)

            if (result.length === 0) {

                qComment.pushStatus(body)
                    .then(() => res.status(200).json({
                        message: "Comment status added!",
                        stat: body.status
                    }))
                    .catch((err) => res.status(400).json(err));

            } else {
                if (result[0].status === body.status) {
                    return qComment.updateStatus(body, 0)
                        .then(res.status(200).json({
                            message: "Comment status added!",
                            // stat: ("IN: " + req.body.status + " | OUT: " + (req.body.status * 0))
                            stat: 0
                        }))
                        .catch((err) => res.status(404).json(err));

                } else {
                    switch (body.status) {
                        case -1:

                            qComment.updateStatus(body, -1)
                                .then(res.status(200).json({
                                    message: "Comment status added! switch -1",
                                    stat: -1
                                }))
                                .catch((err) => res.status(404).json(err));

                            break;
                        case 1:

                            qComment.updateStatus(body, 1)
                                .then(res.status(200).json({
                                    message: "Comment status added!  switch 1",
                                    stat: 1
                                }))
                                .catch((err) => res.status(404).json(err));

                            break;
                        case 0:

                            qComment.updateStatus(body, 0)
                                .then(res.status(200).json({
                                    message: "Comment status added!",
                                    stat: body.status
                                }))
                                .catch((err) => res.status(404).json(err));

                            break;
                        default: res.status(400).json({ message: "ERROR" });
                    };
                };
            }
        })
        .catch((err) => res.status(404).json(err));

};