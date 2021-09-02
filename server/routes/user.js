const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/logout", userCtrl.logout);
router.get("/info", auth, userCtrl.getInfo);
router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getOneUser);
router.put("/", auth, multer, auth, userCtrl.modifyInfoUser);
router.delete("/", auth, userCtrl.deleteUser);

module.exports = router;