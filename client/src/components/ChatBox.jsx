// components/ChatBox.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMessageCircle } from "react-icons/fi";

const ChatBox = ({ roomCode, socket, userName }) => {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <motion.div 
            className="h-full flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FiMessageCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Live Chat
                </h2>
                <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Messages Container */}
            <div 
                ref={chatContainerRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
                <AnimatePresence>
                    {messages.length === 0 ? (
                        <motion.div 
                            className="text-center py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiMessageCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No messages yet. Start the conversation!
                            </p>
                        </motion.div>
                    ) : (
                        messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                className={`flex ${msg.user === userName ? 'justify-end' : 'justify-start'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={`max-w-[75%] ${msg.user === userName ? 'order-2' : 'order-1'}`}>
                                    <div className={`rounded-lg px-4 py-2 ${
                                        msg.user === userName 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    }`}>
                                        {msg.user !== userName && (
                                            <div className="text-xs font-semibold mb-1 text-blue-600 dark:text-blue-400">
                                                {msg.user}
                                            </div>
                                        )}
                                        <p className="text-sm break-words">{msg.text}</p>
                                        <div className="text-xs mt-1 opacity-75">
                                            {formatTime(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent"
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                        <FiSend className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                    {chatInput.length}/500
                </div>
            </form>
        </motion.div>
    );
};

export default ChatBox;
