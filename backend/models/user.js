const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roles = ["user", "admin"];

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: roles,
    },
    status: {
      type: String,
      default: "I am new!",
    },
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    friends: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        messages: [
          {
            type: Schema.Types.ObjectId,
            ref: "Message",
          },
        ],
        updatedAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
