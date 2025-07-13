module.exports = (io) => {
  const roomStates = {};      // roomId → { time, isPlaying }
  const roomHosts = {};       // roomId → socket.id

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.joinedRooms = new Set();

    // Join Room
    socket.on("join-room", (roomId) => {
      if (!roomId) return;

      if (!socket.joinedRooms.has(roomId)) {
        socket.join(roomId);
        socket.joinedRooms.add(roomId);
        console.log(`${socket.id} joined room ${roomId}`);

        // First user becomes host
        if (!roomHosts[roomId]) {
          roomHosts[roomId] = socket.id;
          console.log(`Host set for room ${roomId}: ${socket.id}`);
        }
      }
    });

    // Sync request
    socket.on("request-sync", (roomId) => {
      const state = roomStates[roomId] || { time: 0, isPlaying: false };
      socket.emit("initial-sync", state);
      console.log(`Sent initial sync state to ${socket.id} for room ${roomId}:`, state);
    });

    // Play (Only Host)
    socket.on("play-video", ({ roomId, time }) => {
      if (socket.id !== roomHosts[roomId]) return;
      roomStates[roomId] = { time, isPlaying: true };
      socket.to(roomId).emit("sync-play", { time });
    });

    // Pause (Only Host)
    socket.on("pause-video", ({ roomId, time }) => {
      if (socket.id !== roomHosts[roomId]) return;
      roomStates[roomId] = { time, isPlaying: false };
      socket.to(roomId).emit("sync-pause", { time });
    });

    // Seek (Only Host)
    socket.on("seek-video", ({ roomId, time }) => {
      if (socket.id !== roomHosts[roomId]) return;
      roomStates[roomId] = { ...roomStates[roomId], time };
      socket.to(roomId).emit("sync-seek", { time });
    });

    // Chat
    socket.on("chat-message", ({ roomId, message }) => {
      if (!roomId || !message?.text) return;
      const chatMessage = {
        user: message.user || "Anonymous",
        text: message.text,
        timestamp: message.timestamp || new Date().toISOString(),
      };
      io.to(roomId).emit("chat-message", chatMessage);
    });

    // Disconnect cleanup
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);

      // If host disconnects, remove host assignment
      for (const roomId of socket.joinedRooms) {
        if (roomHosts[roomId] === socket.id) {
          console.log(`Host ${socket.id} left room ${roomId}`);
          delete roomHosts[roomId];
        }
      }
    });
  });
};
