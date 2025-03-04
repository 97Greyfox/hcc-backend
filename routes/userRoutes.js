const express = require("express");
const { uploads } = require("../confg/avatarMulterConfg.js");
const {
  addUser,
  modifyUser,
  deleteUser,
  userLogin,
  getAllUsers,
  getUserById,
  uploadAvatar,
  setNewPassword,
  getUserByFilter,
} = require("../controllers/userController.js");
const {
  loginValidation,
  // signupValidation,
} = require("../middleware/authValidation.js");
const router = express.Router();

router.get("/allusers", getAllUsers);
router.get("/user/:id", getUserById);
router.get("/user/", getUserByFilter);
router.post("/signup", uploads,  addUser);
router.put("/modify/:id", uploads, modifyUser);
router.put("/setpassword/:id", setNewPassword);
router.delete("/delete/:id", deleteUser);
router.post("/login", loginValidation, userLogin);

router.patch("/user/upload-avatar/:id", uploadAvatar);

module.exports = router;
