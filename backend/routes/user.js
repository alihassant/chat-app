const express = require("express");

const userController = require("../controller/user");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/getUser", isAuth, userController.getUser);

router.get("/getUserChats/:userId", isAuth, userController.getUserChats);

router.get("/searchUsers/:username", isAuth, userController.searchUser);

router.post("/addFriend", isAuth, userController.addFriend);

router.post("/sendMessage", isAuth, userController.sendMessage);

router.put("/markMessagesRead", isAuth, userController.markMessagesRead);

module.exports = router;
