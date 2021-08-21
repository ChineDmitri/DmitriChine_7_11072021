const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/info", auth, userCtrl.getInfo);
router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getOneUser);
router.put("/", multer, auth, userCtrl.modifyInfoUser);



module.exports = router;