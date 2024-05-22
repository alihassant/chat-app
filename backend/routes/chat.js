const express = require("express");

const chatController = require("../controller/chat");

const router = express.Router();

router.post("/createChat", chatController.createChat);

router.post("/addUser", chatController.addUser);

router.post("/removeUser", chatController.removeUser);

router.post("/changeUserRole", chatController.changeUserRole);

module.exports = router;
