const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter");
const authConroller = require("../controllers/authConroller");

router.route("/").post(loginLimiter, authConroller.login);

router.route("/refresh").get(authConroller.refresh);

router.route("/logout").post(authConroller.logout);

module.exports = router;
