import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import useSectionSpy from "./useSectionSpy";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const active = useSectionSpy(["home", "features", "why"]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = (id) =>
    `px-4 py-2 rounded-full transition-all duration-300 relative group ${
      active === id
        ? "text-blue-400 font-semibold"
        : "text-white hover:text-blue-300"
    }`;

  const navVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`w-full px-6 md:px-12 py-4 flex items-center justify-between fixed top-0 left-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-[#0B0F19]/90 border-b border-white/10" : "bg-[#0B0F19]/60"
      }`}
    >
      {/* Logo */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="text-xl font-bold flex items-center gap-2"
      >
        <img 
          src="/logo.png" 
          alt="BugWhisper Logo" 
          className="h-10 transition-transform duration-300 hover:scale-110" 
        />
        <span className="hidden md:inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          BugWhisper
        </span>
      </motion.div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-2">
        {['home', 'features', 'why'].map((item) => (
          <motion.a
            key={item}
            href={`#${item}`}
            className={linkClass(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
            {active === item && (
              <motion.span
                layoutId="navUnderline"
                className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
          </motion.a>
        ))}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              Login
            </motion.button>
          </SignInButton>
          <SignUpButton>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 15px rgba(96, 165, 250, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Sign Up
            </motion.button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link to="/app">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 15px rgba(96, 165, 250, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Dashboard
            </motion.button>
          </Link>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                  userButtonPopoverCard: "bg-[#0F172A] border border-white/10"
                }
              }}
            />
          </motion.div>
        </SignedIn>
      </div>
    </motion.nav>
  );
}