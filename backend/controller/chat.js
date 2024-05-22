const Chat = require("../models/chat");
const User = require("../models/user");

const generalPromiseError = (err) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
};

const errorMessageStatus = (errorMessage, errorStatusCode) => {
  const error = new Error(errorMessage);
  error.statusCode = errorStatusCode;
  throw error;
};

exports.createChat = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User Id are required" });
  }

  try {
    const chat = new Chat({
      users: { userId, role: "admin" },
    });

    const result = await chat.save();

    const user = await User.findById(userId);
    user.chats.push(result._id);
    await user.save();

    res.status(201).json({ message: "Chat created!", chatId: result._id });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  const { chatId, userToAdd, userId } = req.body;

  if (!chatId || !userToAdd || !userId) {
    return res
      .status(400)
      .json({ error: "ChatId, userId and userToAdd are required" });
  }
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.users.find((user) => user.userId == userId).role !== "admin") {
      return res.status(403).json({ error: "Only admin can add users" });
    }

    const user = await User.findOne({ username: userToAdd });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    chat.users.push(user._id);
    user.chats.push(chatId);

    await chat.save();
    await user.save();

    res.status(200).json({ message: "User added to chat" });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.removeUser = async (req, res, next) => {
  const { chatId, userId, userToRemove } = req.body;

  if (!chatId || !userId || !userToRemove) {
    return res
      .status(400)
      .json({ error: "ChatId, userId and userToRemove are required" });
  }
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.users.find((user) => user.userId == userId).role !== "admin") {
      return res.status(403).json({ error: "Only admin can remove users" });
    }

    const user = await User.findOne({ username: userToRemove });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    chat.users.pull(user._id);
    user.chats.pull(chatId);

    await chat.save();
    await user.save();

    res.status(200).json({ message: "User removed from chat" });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.changeUserRole = async (req, res, next) => {
  const { chatId, userId, userToChange, role } = req.body;

  if (!chatId || !userId || !userToChange || !role) {
    return res
      .status(400)
      .json({ error: "ChatId, userId, userToChange and role are required" });
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.users.find((user) => user.userId == userId).role !== "admin") {
      return res.status(403).json({ error: "Only admin can change roles" });
    }

    const user = await User.findOne({ username: userToChange });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userInChat = chat.users.find((user) => user.userId == user._id);
    userInChat.role = role;

    await chat.save();

    res.status(200).json({ message: "User role changed" });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
