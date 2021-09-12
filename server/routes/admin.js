const express = require("express");
const router = express.Router();

const adminCtrl = require("../controllers/admin");

// middlewares
const authAdmin = require('../middleware/authAdmin');

router.get("/users/", authAdmin, adminCtrl.getAllUsers);
router.put("/profil/", authAdmin, adminCtrl.changeProfil);
router.put("/status/", authAdmin, adminCtrl.desavivationAndActivationUser);
router.delete("/deleteUser/:id", authAdmin, adminCtrl.deleteUser);

module.exports = router;