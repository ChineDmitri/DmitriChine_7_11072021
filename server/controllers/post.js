const qPost = require("../mysql/queryPost");


// Obtenir tout les post
exports.getAllPost = (req, res, next) => {

    let body = new Object({
        userId: req.body.userId,
        postCounter: req.body.postCounter
    })

    qPost.queryAllPost(body)
        .then((object) => {
            let result = [
                req.body.userId,
                object
            ]

            res.status(200).json(result)
        })
        .catch((err) => res.status(404).json(err));

};


// Obtenir un post !attantion! en forme d'un Array (donc object[0])
exports.getOnePost = (req, res, next) => {

    qPost.queryOnePost(req.params.id, req.body.userId)
        .then((object) => res.status(200).json(object[0]))
        .catch((err) => res.status(404).json(err));

};


// Pour creation d'un post
exports.createPost = (req, res, next) => {

    const postObject = req.file ? {
        userId: req.body.userId,
        title: req.body.title,
        discription: req.body.discription,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : {
        userId: req.body.userId,
        title: req.body.title,
        discription: req.body.discription,
        imageUrl: null,
    }

    qPost.queryCreatePost(postObject)
        .then(() => res.status(201).json({
            message: "Post created!",
            status: true
        }))
        .catch((err) => res.status(400).json(err));

};


// Modification d'un post
exports.modifyPost = (req, res, next) => {

    qPost.queryOnePost(req.params.id)
        .then((ArrPost) => {
            let post = ArrPost[0];
            if (req.body.userId !== post.user_id) {
                throw 'Acces is denied';
            }
            qPost.queryModifyPost(req.params.id, req.body)
                .then(() => res.status(200).json({ message: "Post modified!" }))
                .catch((err) => res.status(404).json(err));
        })
        .catch((err) => res.status(403).json({ error: err | 'Forbidden!' }));

}


// Suppretion d'un post par son ID
exports.deletePost = (req, res, next) => {

    qPost.queryDeletePost(req.body.userId, req.params.id)
        .then(() => res.status(200).json({ message: "Post deleted!" }))
        .catch((err) => res.status(400).json(err));

};


// like or dislike d'un post
exports.votePost = (req, res, next) => {

    const body = {
        userId: req.body.userId,
        postId: req.body.postId, // si avac params faute de CORS
        status: req.body.status,
    };

    qPost.queryRecon(body)
        // si était jamais liké ou disliké crée nouveau INSERT
        .then((result) => {
            if (result.length === 0) {

                qPost.pushStatus(req.body)
                    .then(() => res.status(200).json({
                        message: "Post status added!",
                        stat: req.body.status
                    }))
                    .catch((err) => res.status(409).json(err));

            } else {
                if (result[0].status === req.body.status) {
                    return qPost.updateStatus(req.body, 0)
                        .then(res.status(200).json({
                            message: "Post status added!",
                            // stat: ("IN: " + req.body.status + " | OUT: " + (req.body.status * 0))
                            stat: 0
                        }))
                        .catch((err) => res.status(409).json(err));

                } else {
                    switch (req.body.status) {
                        case -1:

                            qPost.updateStatus(req.body, -1)
                                .then(res.status(200).json({
                                    message: "Post status added! switch -1",
                                    stat: -1
                                }))
                                .catch((err) => res.status(402).json(err));

                            break;
                        case 1:

                            qPost.updateStatus(req.body, 1)
                                .then(res.status(200).json({
                                    message: "Post status added!  switch 1",
                                    stat: 1
                                }))
                                .catch((err) => res.status(403).json(err));

                            break;
                        case 0:

                            qPost.updateStatus(req.body, 0)
                                .then(res.status(200).json({
                                    message: "Post status added!",
                                    stat: req.body.status
                                }))
                                .catch((err) => res.status(403).json(err));

                            break;
                        default: res.status(400).json({ message: "ERROR" });
                    };
                };
            }
        })
        .catch((err) => res.status(400).json(err));

};