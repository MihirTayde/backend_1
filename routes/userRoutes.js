const express = require("express");
const AuthController = require("../controllers/userAuthController");
const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// router.get(
//   "/admin/users",
//   authenticateToken,
//   authorize("admin"),
//   getUsers
// );

module.exports = router;
