const express = require("express");
const router = express.Router();

const commentCtrl = require("../controllers/comment");

// middlewares
const auth = require('../middleware/auth');

router.post("/create/post/:id_post", auth, commentCtrl.createCommentForPost);
router.post("/all/post/:id_post", auth, commentCtrl.getAllCommentsForPost);
router.delete("/:id_comment", auth, commentCtrl.deleteCommentForPost);

module.exports = router;