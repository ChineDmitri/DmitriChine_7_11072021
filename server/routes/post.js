const express = require("express");
const router = express.Router();

// controllers
const postCtrl = require("../controllers/post");

// middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.post("/", auth, postCtrl.getAllPost);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/create", auth, multer, auth, postCtrl.createPost);
router.put("/:id", auth, multer, auth, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.patch("/:id/vote", auth, postCtrl.votePost);
router.get("/user/:id", auth, postCtrl.getAllPostForUser);
router.post("/user/", auth, postCtrl.getAllPostForUser);

module.exports = router;
