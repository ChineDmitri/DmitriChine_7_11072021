const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// middlewares
const auth = require('../middleware/auth');

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getOneUser);


module.exports = router;