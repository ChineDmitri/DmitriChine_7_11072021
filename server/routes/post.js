const express = require("express");
const router = express.Router();

const likeStatus = require("../middleware/likeStatus");
const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAllPost);
router.get("/:id", postCtrl.getOnePost);
router.post("/", postCtrl.createPost);
router.delete("/", postCtrl.deletePost);
router.put("/like", postCtrl.votePost);

router.get("/post/test", postCtrl.test);

module.exports = router;
