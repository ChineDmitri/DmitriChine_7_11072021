const express = require("express");
const router = express.Router();

// controllers
const postCtrl = require("../controllers/post");

// middlewares
const auth = require('../middleware/auth');

router.get("/", auth, postCtrl.getAllPost);
router.get("/:id", postCtrl.getOnePost);
router.post("/", postCtrl.createPost);
router.put("/:id", postCtrl.modifyPost);
router.delete("/:id", postCtrl.deletePost);
router.patch("/like", postCtrl.votePost);

module.exports = router;
