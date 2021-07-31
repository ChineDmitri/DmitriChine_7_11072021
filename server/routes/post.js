const express = require("express");
const router = express.Router();

const postCtrl = require("../controllers/post");

router.get("/", postCtrl.getAllPost);
router.get("/:id", postCtrl.getOnePost);
router.post("/", postCtrl.createPost);
router.put("/:id", postCtrl.modifyPost);
router.delete("/", postCtrl.deletePost);
router.patch("/like", postCtrl.votePost);

router.get("/post/test", postCtrl.test);

module.exports = router;
