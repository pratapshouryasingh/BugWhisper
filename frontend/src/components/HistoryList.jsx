import { useEffect, useState } from "react";
import { useAuthorizedFetch } from "../utils/useAuthorizedFetch";
import { motion } from "framer-motion";

export default function HistoryList({ setResponse }) {
  const fetchAuth = useAuthorizedFetch();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetchAuth("/search?page=1&limit=50");
        const res = await r.json();
        const arr =
          Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.history)
            ? res.history
            : [];
        setHistory(arr);
      } catch (e) {
        console.error("History fetch failed", e);
      }
    };
    load();
  }, []);

  return (
    <aside className="w-64 h-[calc(100vh-72px)] bg-[#0F172A]/80 backdrop-blur-lg border-r border-white/10 p-4 overflow-y-auto">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setResponse("")}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 mb-4 rounded-lg font-medium transition-all duration-300 shadow-lg"
      >
        ➕ New Chat
      </motion.button>

      <h2 className="text-lg font-semibold mb-4 px-2 text-gray-300">History</h2>

      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
        {history.map((h, index) => (
          <motion.div
            key={h._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            title={h.query}
            onClick={() => setResponse(h.result)}
            className="cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/20 p-1 rounded-full">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="truncate text-sm">{h.query}</p>
            </div>
          </motion.div>
        ))}
        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 text-gray-400 text-sm"
          >
            No history yet. Start a new chat!
          </motion.div>
        )}
      </div>
    </aside>
  );
}