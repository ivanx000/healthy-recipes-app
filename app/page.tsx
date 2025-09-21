"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  type: "user" | "ai";
  text: string;
  image?: string; // optional image for AI messages
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer for loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage: Message = { type: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setPrompt("");
    setError(null);

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        const recipeText = Array.isArray(data.recipe) ? data.recipe.join("\n") : data.recipe;
        const lines = recipeText.split("\n").filter(Boolean);

        // Add AI message with empty text
        const aiMessage: Message = { type: "ai", text: "" };
        setMessages((prev) => [...prev, aiMessage]);

        // Typing effect
        for (let i = 0; i < lines.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 ? { ...msg, text: prev[idx].text + lines[i] + "\n" } : msg
            )
          );
        }

        // Attach image to the last AI message
        if (data.image) {
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 ? { ...msg, image: data.image } : msg
            )
          );
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center px-4 py-6">
      {/* Initial center content */}
      <div
        className={`flex flex-col items-center justify-center transition-all duration-500 ${
          messages.length ? "h-0 overflow-hidden" : "flex-grow -mt-10"
        }`}
      >
        <header className="text-center w-full max-w-2xl mb-6">
          <h1 className="font-bold text-4xl">What recipe would you like to make?</h1>
        </header>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleSubmit}
              placeholder="Enter your recipe prompt..."
              className="w-full pr-12 p-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              ➤
            </button>
          </div>
        </form>
      </div>

      {/* Title at top after messages */}
      <header
        className={`text-center w-full max-w-2xl transition-all duration-500 ${
          messages.length ? "mb-4" : "h-0 overflow-hidden"
        }`}
      >
        <h1 className="font-bold text-2xl">What recipe would you like to make?</h1>
      </header>

      {/* Chat / Messages */}
      <main
        className={`w-full flex flex-col gap-4 overflow-auto transition-all duration-500 ${
          messages.length ? "flex-grow mb-4" : "h-0 overflow-hidden"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl break-words w-full max-w-2xl ${
              msg.type === "user" ? "bg-gray-700 self-end text-white" : "bg-gray-800 self-start text-white"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
            {msg.image && (
              <div className="mt-4">
                <img src={msg.image} alt="Generated dish" className="rounded-md shadow-md w-full" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="p-4 rounded-xl w-full max-w-2xl bg-gray-800 self-start text-gray-300">
            AI is typing{'.'.repeat((elapsedTime % 3) + 1)} (≈ {elapsedTime}s)
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </main>

      {/* Input at bottom after messages */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl transition-all duration-500 ${messages.length ? "mt-auto" : "h-0 overflow-hidden"}`}
      >
        <div className="relative w-full">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleSubmit}
            placeholder="Enter your recipe prompt..."
            className="w-full pr-12 p-3 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
