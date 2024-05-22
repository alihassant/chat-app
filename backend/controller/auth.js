const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

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

exports.signup = async (req, res, next) => {
  const { name, email: emailBody, username: usernameBody, password } = req.body;

  const email = emailBody.toLowerCase();
  const username = usernameBody.toLowerCase();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        errors.array()[0].msg || "User Registration Failed."
      );
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    // Check if the user already exists
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      errorMessageStatus("Email is already registered!!!", 409);
    }

    const checkUsername = await User.findOne({ username });

    if (checkUsername) {
      errorMessageStatus("Username is already registered!!!", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      username,
    });

    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { username: usernameBody, password } = req.body;
  const username = usernameBody.toLowerCase();

  try {
    const user = await User.findOne({ username });
    if (!user) {
      errorMessageStatus("User not found!!!", 404);
    }

    // Check if the password matches
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      errorMessageStatus("Wrong password!!!", 401);
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    generalPromiseError(err);
    next(err);
  }
};
