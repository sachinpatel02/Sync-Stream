module.exports = (io) => {
    // Store room states (video time and play status)
    const roomStates = {};
  
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);
  
      // Handle join-room event
      socket.on("join-room", (roomId) => {
        if (!roomId) {
          console.error("Invalid roomId:", roomId);
          return;
        }
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}`);
  
        // Handle request-sync event for initial video state
        socket.on("request-sync", (roomId) => {
          const state = roomStates[roomId] || { time: 0, isPlaying: false };
          socket.emit("initial-sync", state);
          console.log(`Sent initial sync state to ${socket.id} for room ${roomId}:`, state);
        });
      });
  
      // Play and sync video
      socket.on("play-video", ({ roomId, time }) => {
        if (!roomId || typeof time !== "number") {
          console.error("Invalid play-video data:", { roomId, time });
          return;
        }
        roomStates[roomId] = { time, isPlaying: true };
        socket.to(roomId).emit("sync-play", { time });
        console.log(`Play event in room ${roomId} at time ${time}`);
      });
  
      // Pause and sync video
      socket.on("pause-video", ({ roomId, time }) => {
        if (!roomId || typeof time !== "number") {
          console.error("Invalid pause-video data:", { roomId, time });
          return;
        }
        roomStates[roomId] = { time, isPlaying: false };
        socket.to(roomId).emit("sync-pause", { time });
        console.log(`Pause event in room ${roomId} at time ${time}`);
      });
  
      // Seek and sync video
      socket.on("seek-video", ({ roomId, time }) => {
        if (!roomId || typeof time !== "number") {
          console.error("Invalid seek-video data:", { roomId, time });
          return;
        }
        roomStates[roomId] = { ...roomStates[roomId], time };
        socket.to(roomId).emit("sync-seek", { time });
        console.log(`Seek event in room ${roomId} to time ${time}`);
      });
  
      // Chat feature
      socket.on("chat-message", ({ roomId, message }) => {
        if (!roomId || !message || !message.text) {
          console.error("Invalid chat-message data:", { roomId, message });
          return;
        }
        // Ensure timestamp is included if not provided
        const chatMessage = {
          user: message.user || "Anonymous",
          text: message.text,
          timestamp: message.timestamp || new Date().toISOString(),
        };
        io.to(roomId).emit("chat-message", chatMessage);
        console.log(`Chat message in room ${roomId}:`, chatMessage);
      });
  
      // Handle disconnect
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  };