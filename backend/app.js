// node packages
const fs = require("fs");
const path = require("path");

// third party packages
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/user");

const app = express();

const SERVER_PORT = 8080;
const LOCAL_MONGO_SERVER = "mongodb://127.0.0.1:27017/chatApp";

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(process.env.MONGO_URL)
  // .connect(LOCAL_MONGO_SERVER)
  .then(() => {
    console.log("DB Connected!!");
    const server = app.listen(SERVER_PORT, () => {
      console.log(`Live at port ${SERVER_PORT}`);
    });
    const io = require("./socket").init(server);
  })
  .catch((err) => console.log(err));
