const express = require("express");
const router = express.Router();

const commentCtrl = require("../controllers/comment");

// middlewares
const auth = require('../middleware/auth');

router.post("/create/post/:id_post", auth, commentCtrl.createCommentForPost);
router.post("/all/post/:id_post", auth, commentCtrl.getAllCommentsForPost);
router.delete("/:id_comment/post/:id_post", auth, commentCtrl.deleteCommentForPost);
router.put("/:id_comment/post/:id_post", auth, commentCtrl.modifyCommentForPost);
router.patch("/:id/vote", auth, commentCtrl.voteComment);
router.get("/user/:id", auth, commentCtrl.getAllCommentsForUser);
router.get("/user/", auth, commentCtrl.getAllCommentsForUser);


module.exports = router;