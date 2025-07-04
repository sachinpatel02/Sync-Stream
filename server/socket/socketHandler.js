module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connectd', socket.id);

        //join the room
        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`${socket.id} joined room: ${roomId}`);
        })

        //play and sync video
        socket.on('play-video', ({ roomId, time }) => {
            socket.to(roomId).emit('sync-play', { time });
        });

        //pause in sync
        socket.on('pause-video', ({ roomId, time }) => {
            socket.to(roomId).emit('sync-pause', { time });
        });

        //seek in sync
        socket.on('seek-video', ({ roomId, time }) => {
            socket.to(roomId).emit('sync-seek', { time });
        });

        //chat feature
        socket.on('chat-message', ({ roomId, user, message }) => {
            const timestamp = new Date().toISOString();
            io.to(roomId).emit('receive-message', { user, message, timestamp });
        });

        //user disconnect
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });

    });
};