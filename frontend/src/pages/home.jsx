import { useState } from "react";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import AuthRoutes from "../components/AuthRoutes";
import HistoryList from "../components/HistoryList";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For navigation

export default function App() {
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] to-[#1A1D24] text-white">
      {/* Top bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center px-6 py-3 bg-[#0F172A]/80 backdrop-blur-lg border-b border-white/10"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md border border-white/10 transition-all duration-200"
          >
            ←
          </button>

          <img 
            src="/logo.png" 
            alt="BugWhisper Logo" 
            className="h-10 transition-transform hover:scale-105 duration-300" 
          />
          <span className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            BugWhisper
          </span>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </SignInButton>
            <SignUpButton>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(96, 165, 250, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-300"
              >
                Sign Up
              </motion.button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9",
                    userButtonPopoverCard: "bg-[#0F172A] border border-white/10"
                  }
                }}
              />
            </motion.div>
          </SignedIn>
        </div>
      </motion.div>

      {/* Layout: sidebar + main */}
      <div className="flex">
        <div className="hidden md:block">
          <AnimatePresence>
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
            >
              <HistoryList setResponse={setResponse} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex-1 p-6">
          <AuthRoutes response={response} setResponse={setResponse} />
        </div>
      </div>
    </div>
  );
}
