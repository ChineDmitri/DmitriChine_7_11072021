const qPost = require("../mysql/queryPost");


exports.getAllPost = (req, res, next) => {
    qPost.queryAllPost(req.body)
        .then((object) => res.status(200).json(object))
        .catch((err) => res.status(404).json(err));
};


exports.getOnePost = (req, res, next) => {
    qPost.queryOnePost(req.params.id, req.body.userId)
        .then((object) => res.status(200).json(object))
        .catch((err) => res.status(404).json(err));
};


exports.createPost = (req, res, next) => {
    qPost.queryCreatePost(req.body)
        .then(() => res.status(201).json({ message: "Post created!" }))
        .catch((err) => res.status(400).json(err));
};


exports.deletePost = (req, res, next) => {
    qPost.queryDeletePost(req.body)
        .then(() => res.status(200).json({ message: "Post deleted!" }))
        .catch((err) => res.status(400).json(err));
};


exports.votePost = (req, res, next) => {

    qPost.queryRecon(req.body)
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
                            stat: ("IN: " + req.body.status + " | OUT: " + (req.body.status * 0))
                        }))
                        .catch((err) => res.status(409).json(err));
                } else {
                    switch (req.body.status) {
                        case -1:
                            qPost.updateStatus(req.body, -1)
                                .then(res.status(200).json({
                                    message: "Post status added!",
                                    stat: "DISLIKE"
                                }))
                                .catch((err) => res.status(402).json(err));
                            break;
                        case 1:
                            qPost.updateStatus(req.body, 1)
                                .then(res.status(200).json({
                                    message: "Post status added!",
                                    stat: "LIKE"
                                }))
                                .catch((err) => res.status(403).json(err));
                            break;
                        case 0:
                            qPost.updateStatus(req.body, 0)
                                .then(res.status(200).json({
                                    message: "Post status added!",
                                    stat: "AUCUNE"
                                }))
                                .catch((err) => res.status(403).json(err));
                            break;
                        default: res.status(400).json({ message: "ERROR" });
                    };
                };
            }
        })
        .catch((err) => res.status(400).json(err));

    // qPost.queryRecon(req.body)
    //     .then((result) => {
    //         // si était jamais liké ou disliké crée nouveau INSERT
    //         if (result.length === 0) {
    //             console.log(result.length)
    //             qPost.pushStatus(req.body)
    //                 .then(() => res.status(200).json({
    //                     message: "Post status added!",
    //                     stat: req.body.status
    //                 }))
    //                 .catch((err) => res.status(409).json(err));
    //             // si non on verifie quelle status
    //         } else {
    //             qPost.queryRecon(req.body)
    //                 .then((result) => {
    //                     // si deja like/dislike on enleve like/dislike
    //                     if (result[0].status === req.body.status) {
    //                         return qPost.updateStatus(req.body, 0)
    //                             .then(res.status(200).json({
    //                                 message: "Post status added!",
    //                                 stat: ("IN: " + req.body.status + " | OUT: " + (req.body.status * 0))
    //                             }))
    //                             .catch((err) => res.status(409).json(err));
    //                     } else {
    //                         switch (req.body.status) {
    //                             case -1:
    //                                 qPost.updateStatus(req.body, -1)
    //                                     .then(res.status(200).json({
    //                                         message: "Post status added!",
    //                                         stat: "DISLIKE"
    //                                     }))
    //                                     .catch((err) => res.status(402).json(err));
    //                                 break;
    //                             case 1:
    //                                 qPost.updateStatus(req.body, 1)
    //                                     .then(res.status(200).json({
    //                                         message: "Post status added!",
    //                                         stat: "LIKE"
    //                                     }))
    //                                     .catch((err) => res.status(403).json(err));
    //                                 break;
    //                             case 0:
    //                                 qPost.updateStatus(req.body, 0)
    //                                     .then(res.status(200).json({
    //                                         message: "Post status added!",
    //                                         stat: "AUCUNE"
    //                                     }))
    //                                     .catch((err) => res.status(403).json(err));
    //                                 break;
    //                             default: res.status(400).json({ message: "ERROR" });
    //                         };
    //                     };
    //                 })
    //                 .catch((err) => res.status(404).json(err));
    //         };
    //     })
    //     .catch((err) => res.status(405).json(err));
};


exports.test = (req, res, next) => {
    qPost.queryRecon(req.body)
        .then((result) => {
            // if (result.lenght == 0) {
            console.log(result.length);
            res.status(204).json(result);
            // }
        })
        .catch((err) => res.status(409).json(err));
}