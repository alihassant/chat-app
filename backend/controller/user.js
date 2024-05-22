const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");

const io = require("../socket");

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

exports.getUser = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "_id messages",
      },
    });
    if (!user) {
      errorMessageStatus("User not found", 404);
    }
    res.status(200).json({ user });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.getUserChats = async (req, res, next) => {
  //   const userId = req.userId;
  const { userId } = req;

  try {
    const user = await User.findById(userId).populate({
      path: "chats",
      populate: {
        path: "users",
      },
    });

    if (!user) {
      errorMessageStatus("User not found", 404);
    }

    res.status(200).json({ chats: user.chats, user });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.addFriend = async (req, res, next) => {
  const { userId } = req;
  const { friendUsername } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      errorMessageStatus("User not found", 404);
    }

    if (user.username === friendUsername) {
      errorMessageStatus("You cannot add yourself as a friend", 409);
    }

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      errorMessageStatus("Friend not found", 404);
    }

    if (user.friends.includes(friend._id)) {
      errorMessageStatus("Friend already added", 409);
    }

    user.friends.push(friend);
    await user.save();

    friend.friends.push(user);
    await friend.save();

    const userNotification = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "_id messages",
      },
    });

    io.emitToUser(userId, "addFriend", {
      action: "add",
      message: "Friend added",
      user: userNotification,
      createdAt: new Date().toISOString(),
    });

    const friendNotification = await User.findById(friend._id).populate({
      path: "friends",
      populate: {
        path: "_id messages",
      },
    });

    io.emitToUser(friend._id, "addFriend", {
      action: "add",
      message: "Friend added",
      user: friendNotification,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Friend added", user });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      errorMessageStatus("User not found", 404);
    }
    res.status(200).json({ user });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  const { userId } = req;
  const { receiverId, chatId, message } = req.body;

  try {
    const sender = await User.findById(userId);
    if (!sender) {
      errorMessageStatus("Sender not found", 404);
    }

    if (!sender.friends.find((friend) => friend._id == receiverId)) {
      errorMessageStatus("You are not friends with this user", 403);
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      errorMessageStatus("Receiver not found", 404);
    }

    const newMessage = new Message({
      sender: userId,
      receiver: receiverId,
      chatId,
      message,
    });

    await newMessage.save();

    const senderFriend = sender.friends.find(
      (friend) => friend._id == receiverId
    );
    senderFriend.messages.push(newMessage);
    senderFriend.updatedAt = new Date(); // Update sender's updatedAt

    const receiverFriend = receiver.friends.find(
      (friend) => friend._id == userId
    );
    receiverFriend.messages.push(newMessage);
    receiverFriend.updatedAt = new Date(); // Update receiver's updatedAt

    await sender.save();
    await receiver.save();

    const senderNotification = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "_id messages",
      },
    });

    io.emitToUser(userId, "newMessage", {
      action: "newMessage",
      message: "Friend added",
      user: senderNotification,
      createdAt: new Date().toISOString(),
    });

    const receiverNotification = await User.findById(receiverId).populate({
      path: "friends",
      populate: {
        path: "_id messages",
      },
    });

    io.emitToUser(receiverId, "newMessage", {
      action: "newMessage",
      message: "Friend added",
      user: receiverNotification,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Message sent" });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.markMessagesRead = async (req, res, next) => {
  const { userId } = req;
  const { friendId } = req.body;
  console.log(friendId);

  try {
    const messages = await Message.find({ receiver: userId, sender: friendId });
    if (!messages) {
      errorMessageStatus("Messages not found", 404);
    }

    for (const message of messages) {
      if (message.receiver == userId) {
        message.read = true;
      }
      await message.save();
    }
    console.log("called");

    const user = await User.findById(userId).populate({
      path: "friends",
      populate: {
        path: "_id messages",
      },
    });

    io.emitToUser(userId, "markMessagesRead", {
      action: "markMessagesRead",
      message: "Messages marked as read",
      user,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
