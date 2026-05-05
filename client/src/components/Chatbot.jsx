import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Minus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([
    {
      role: "bot",
      text: "Hello! I'm your Idle Wheels Assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useAppContext();
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const userMessage = msg;
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/chat/chat`, {
        message: userMessage,
      });

      if (res.data.success) {
        setChat((prev) => [...prev, { role: "bot", text: res.data.reply }]);
      } else {
        setChat((prev) => [
          ...prev,
          {
            role: "bot",
            text: "I'm having a bit of trouble. Please try again later.",
          },
        ]);
      }
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Connection interrupted. Please check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-[380px] md:w-[480px] rounded-[2.5rem] border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col mb-4 bg-[#0a0f1a]/98 backdrop-blur-3xl transition-all duration-500 ${isMinimized ? "h-[80px]" : "h-[650px]"}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-black font-heading text-sm uppercase tracking-tight">
                    AI
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus className="text-white w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="text-white w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#030712]/60">
                  {chat.map((c, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[88%] px-8 py-4 rounded-[2rem] text-sm break-words leading-relaxed font-semibold ${
                          c.role === "user"
                            ? "bg-primary text-white rounded-br-none shadow-[0_15px_30px_-10px_rgba(245,158,11,0.4)]"
                            : "bg-white/10 text-white border border-white/10 rounded-bl-none shadow-2xl"
                        }`}
                      >
                        <div
                          className="leading-relaxed font-medium font-heading tracking-tight text-white/90 chatbot-content"
                          dangerouslySetInnerHTML={{ __html: c.text }}
                        />
                        <style>{`
                          .chatbot-content ul { list-style-type: disc; margin-left: 1.2rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
                          .chatbot-content li { margin-bottom: 0.4rem; }
                          .chatbot-content b { color: #fff; font-weight: 900; display: inline-block; margin-top: 0.2rem; }
                        `}</style>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 px-8 py-5 rounded-[2rem] rounded-bl-none border border-white/5">
                        <div className="flex gap-2">
                          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>
 
                {/* Input Area */}
                <form
                  onSubmit={sendMessage}
                  className="p-5 bg-[#0a0f1a] border-t border-white/5 flex gap-4"
                >
                  <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Establish communication..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] px-10 py-5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/60 transition-all font-bold tracking-tight"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center hover:bg-secondary transition-all shadow-[0_10px_25px_-5px_rgba(245,158,11,0.6)] disabled:opacity-50 group"
                  >
                    <Send className="text-white w-6 h-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-[0_8px_30px_-5px_rgba(245,158,11,0.5)] border border-white/20 relative group"
        >
          <div className="absolute inset-0 bg-white/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          <Sparkles className="text-white w-6 h-6 relative z-10" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030712] animate-pulse" />
        </motion.button>
      )}
    </div>
  );
};

export default Chatbot;
