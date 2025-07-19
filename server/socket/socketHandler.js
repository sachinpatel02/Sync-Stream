module.exports = (io) => {
  const roomStates = new Map();      // roomId → { time, isPlaying }
  const roomHosts = new Map();       // roomId → socket.id

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
        if (!roomHosts.has(roomId)) {
          roomHosts.set(roomId, socket.id);
          roomStates.set(roomId, { time: 0, isPlaying: false });
          console.log(`Host set for room ${roomId}: ${socket.id}`);
        }
      }
    });

    // Sync request
    socket.on("request-sync", (roomId) => {
      const state = roomStates.get(roomId) || { time: 0, isPlaying: false };
      io.in(roomId).emit("video-sync", state);
    });

    // Regular sync update from host
    socket.on("sync-status", ({ roomId, time, isPlaying }) => {
      if (socket.id !== roomHosts.get(roomId)) return;
      const state = { time, isPlaying };
      roomStates.set(roomId, state);
      io.in(roomId).emit("video-sync", state);
    });

    // Play (Only Host)
    socket.on("play-video", ({ roomId, time }) => {
      if (socket.id !== roomHosts.get(roomId)) return;
      const state = { time, isPlaying: true };
      roomStates.set(roomId, state);
      io.in(roomId).emit("video-sync", state);
    });

    // Pause (Only Host)
    socket.on("pause-video", ({ roomId, time }) => {
      if (socket.id !== roomHosts.get(roomId)) return;
      const state = { time, isPlaying: false };
      roomStates.set(roomId, state);
      io.in(roomId).emit("video-sync", state);
    });

    // Seek (Only Host)
    socket.on("seek-video", ({ roomId, time }) => {
      if (socket.id !== roomHosts.get(roomId)) return;
      const currentState = roomStates.get(roomId) || { time: 0, isPlaying: false };
      const state = { ...currentState, time };
      roomStates.set(roomId, state);
      io.in(roomId).emit("video-sync", state);
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
        if (roomHosts.get(roomId) === socket.id) {
          console.log(`Host ${socket.id} left room ${roomId}`);
          roomHosts.delete(roomId);
          roomStates.delete(roomId);
        }
      }
    });
  });
};
