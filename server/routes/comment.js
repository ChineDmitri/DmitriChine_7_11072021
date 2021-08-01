const express = require("express");
const router = express.Router();

const commentCtrl = require("../controllers/comment");

router.post("/post/:id_post", commentCtrl.createCommentForPost);

module.exports = router;