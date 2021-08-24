-- Obtenir tout les post et leur photo;
SELECT post.*, post_photo.url FROM post LEFT JOIN post_photo ON post.id=post_photo.post_id

-- poter un post
START TRANSACTION;

SET AUTOCOMMIT = 0;

INSERT INTO Post (date_publication, title, discription) 
VALUES (NOW(), 'title5', 'DISC5');
SET @a=LAST_INSERT_ID();

INSERT INTO post_photo (url, post_id) 
VALUES
('photo1post5.jpg', @a),
('photo2post5.jpg', @a),
(NULL, @a);

INSERT INTO account_posts (user_id, post_id)
VALUES (1, @a);

COMMIT;

-- exo pour routines
INSERT INTO Post (date_publication, title, discription) 
VALUES (NOW(), title, discription);
SET @a=LAST_INSERT_ID();

INSERT INTO post_photo (url, post_id) 
VALUES
(url0, @a),
(url1, @a),
(url2, @a);

INSERT INTO account_posts (user_id, post_id)
VALUES (user_id, @a);

-------------------


// Suppretion d'un post par son ID
exports.deletePost = (req, res, next) => {
    qPost.queryOnePost(req.params.id, req.body.userId)
        .then((post) => {
            modules.deleteImg(post[0].profil_img_url)
        })
        .catch((err) => res.status(404).json(err));

    qPost.queryDeletePost(req.body.userId, req.params.id)
        .then(() => res.status(200).json({ message: "Post deleted!" }))
        .catch((err) => res.status(400).json(err));

};


const fs = require('fs');

// fonction pour supprimé photo de utilisateur dans le file system
exports.deleteImg = (objWithKey) => {

    return new Promise((resolve, reject) => {

        const fileName = objWithKey.split('/images/')[1];
        fs.unlink(`images/${fileName}`, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve()
            }
        });

    })

}