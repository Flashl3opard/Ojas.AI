import React, { useState, useRef, useEffect, useCallback } from "react";
import { TbMessageChatbot } from "react-icons/tb";
// Define constants for the Gemini API
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const modelName = "gemini-2.5-flash-preview-05-20"; // Standard model for text generation
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

// --- Type Definitions ---

interface Message {
  role: "user" | "bot";
  text: string;
}

// API Content types for conversational history
interface ApiPart {
  text: string;
}

interface ApiContent {
  role: "user" | "model"; // Gemini API expects 'model' role for bot responses
  parts: ApiPart[];
}

// System instruction for the chatbot persona
const SYSTEM_INSTRUCTION: string = `
  You are Ojas AI — a friendly and supportive chatbot specializing in Ayurveda. 
  Answer only Ayurveda-related queries (natural remedies, herbs, doshas, wellness guidance). 
  If the user asks a question unrelated to Ayurveda, politely steer the conversation back.
  Keep responses warm, encouraging, and easy to understand.
  `;

// --- Icon Components ---
const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// --- Helper function to call Gemini API ---
const callGeminiApi = async (conversation: Message[]): Promise<string> => {
  const maxRetries = 5;
  const baseDelay = 1000;

  const contents: ApiContent[] = conversation.map((msg) => ({
    role: msg.role === "bot" ? "model" : "user",
    parts: [{ text: msg.text }],
  }));

  const payload = {
    contents,
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
  };

  let lastError: unknown = null;

  for (let i = 0; i < maxRetries; i++) {
    const delay = baseDelay * 2 ** i;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) return text;
      throw new Error("Received empty text response from model.");
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

// --- Main ChatBot Component ---
const App: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "🌿 Namaste! I’m Ojas AI, your Ayurveda assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(true);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
      }, 50);
    }
  }, []);
  useEffect(() => {
    if (open) {
      setHasNewMessage(false);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    const userMessageText = input.trim();
    if (!userMessageText) return;

    const newUserMessage: Message = { role: "user", text: userMessageText };
    const messagesWithUser: Message[] = [...messages, newUserMessage];
    setMessages(messagesWithUser);
    setInput("");
    setLoading(true);

    try {
      const reply = await callGeminiApi(messagesWithUser);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", text: reply },
      ]);
      if (!open) {
        setHasNewMessage(true);
      }
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "bot",
          text: "⚠️ Sorry, I couldn’t process that right now due to a network or API issue. Please try again.",
        },
      ]);
      if (!open) {
        setHasNewMessage(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className=" ">
      {/* Floating Bot Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-green-600 p-4 rounded-full shadow-xl cursor-pointer transition-transform duration-300 ${
          !open ? "animate-bounce" : "rotate-45"
        }`}
        onClick={() => setOpen(!open)}
        title="Toggle Ojas AI Chatbot"
      >
        <TbMessageChatbot className="text-white text-3xl h-7 w-7" />
        {!open && hasNewMessage && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 animate-ping-slow"></span>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed inset-0 md:inset-auto z-50 h-full w-full p-0 md:p-0 flex flex-col overflow-hidden transition-all duration-300 transform scale-100 
       bg-white shadow-none md:shadow-2xl rounded-none md:rounded-2xl border-0 
       md:bottom-20 md:right-6 md:max-w-sm md:h-[600px] md:w-auto"
        >
          {/* Header */}
          <div className="bg-green-700 text-white px-4 py-3 text-lg font-bold flex items-center justify-between shadow-md">
            <span className="flex items-center">
              <span className="text-2xl mr-2">🌿</span> Ojas AI - Ayurveda
              Assistant
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-green-200 transition-colors"
              title="Close Chat"
            >
              &times;
            </button>
          </div>

          {/* Messages Container */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-green-50/70"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-sm shadow-md transition-all duration-300 ease-out ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-green-300 rounded-tl-none"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="text-gray-500 text-xs py-2 px-3 bg-white border border-green-300 rounded-xl rounded-tl-none shadow-sm">
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">◷</span> Ojas AI is
                    thinking...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex items-center border-t-2 border-green-200 p-3 bg-white">
            <input
              type="text"
              placeholder="Ask about Ayurveda..."
              className="flex-1 px-3 py-2 outline-none text-sm border-2 border-gray-200 focus:border-green-500 rounded-lg transition-colors"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className={`p-3 ml-2 rounded-lg transition-all duration-200 ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-md"
              }`}
              disabled={loading}
              title="Send Message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
