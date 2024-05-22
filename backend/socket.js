const { Server } = require("socket.io");

let io;
const userSocketArray = []; // Array to store user IDs and socket IDs

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
      },
    });
    console.log("userSocketArray", userSocketArray);
    // Handle user connections
    io.on("connection", (socket) => {
      console.log("Client connected!");
      // Handle when a user connects
      socket.on("userId", (userId) => {
        // Store the userId and socketId
        const existingEntry = userSocketArray.find(
          (entry) => entry.userId === userId
        );
        if (existingEntry) {
          // If the user already has a socketId, update the socketId
          existingEntry.socketId = socket.id;
        } else {
          // If the user is connecting for the first time, add the entry
          userSocketArray.push({ userId, socketId: socket.id });
        }
        io.to(socket.id).emit("notification", {
          message: "You are connected to the server!",
        });
        console.log(userSocketArray);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("Client disconnected!");
        // Remove the entry for the disconnected socket
        const index = userSocketArray.findIndex(
          (entry) => entry.socketId === socket.id
        );
        if (index !== -1) {
          userSocketArray.splice(index, 1);
        }
      });
    });

    if (!io) {
      throw new Error("Socket.io not initialized");
    }

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  },

  // Method to emit a notification to a specific user
  emitToUser: (userId, event, data) => {
    if (!userId) return console.log("No userId provided");
    userSocketArray.forEach((entry) => {
      if (entry.userId === userId) {
        io.to(entry.socketId).emit(event, data);
        console.log(`Notification sent to user ${userId}`);
      }
    });
  },
};
