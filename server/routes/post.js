const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");
const commentCtrl = require("../controllers/comment")

router.get("/", postCtrl.getAllPost);
router.get("/:id", postCtrl.getOnePost);
router.post("/", postCtrl.createPost);
router.put("/:id", postCtrl.modifyPost);
router.delete("/:id", postCtrl.deletePost);
router.patch("/like", postCtrl.votePost);

module.exports = router;
