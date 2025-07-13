// components/ChatBox.jsx
import { useState, useEffect } from "react";

const ChatBox = ({ roomCode, socket, userName }) => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleChatMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on("chat-message", handleChatMessage);

        return () => {
            socket.off("chat-message", handleChatMessage);
        };
    }, [socket]);

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const message = {
            user: userName || "Anonymous",
            text: chatInput,
            timestamp: Date.now(),
        };

        socket.emit("chat-message", { roomId: roomCode, message });
        setChatInput("");
    };

    return (
        <div className="bg-gray-800 h-[600px] rounded-xl shadow-md p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-1">
                💬 Live Chat
            </h2>
            <div className="flex-1 bg-gray-900 border border-gray-700 rounded mb-3 p-3 overflow-y-auto">
                {messages.length === 0 ? (
                    <p className="text-gray-400 italic text-sm text-center">No messages yet.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <span className="text-blue-400 font-semibold">{msg.user}:</span>{" "}
                            <span>{msg.text}</span>
                            <span className="text-gray-500 text-xs ml-2">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2 mt-2">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-white"
                >
                    Send
                </button>
            </form>

        </div>
    );
};

export default ChatBox;
