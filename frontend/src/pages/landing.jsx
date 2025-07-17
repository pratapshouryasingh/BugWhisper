// src/pages/landing.jsx
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Landing() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Intersection Observer hooks for scroll animations
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const [whyRef, whyInView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Background animation effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;
      
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F19] to-[#1E293B] text-white scroll-smooth overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMTI1MzAiIG9wYWNpdHk9IjAuNCI+PHBhdGggZD0iTTM2IDM0YTIgMiAwIDEgMSAwLTQgMiAyIDAgMCAxIDAgNHptMCAyYTQgNCAwIDEgMC0zLjQ3Ni0zLjk5NEE0LjAwMSA0LjAwMSAwIDAgMCAzNiAzNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0B0F19] opacity-30" 
             style={{ transform: 'translate(calc(var(--mouse-x, 0.5) * 10%), calc(var(--mouse-y, 0.5) * 10%))' }}></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float-delay"></div>
      </div>

      <Navbar />

      {/* Home Section */}
      <section id="home" className="relative pt-46 py-40 px-6 md:px-16 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-7xl lg:text-8xl mt-6 font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome to BugWhisper
          </h1>
          <p className="text-gray-300 p-6 md:p-12 mt-8 text-lg md:text-2xl lg:text-3xl mb-8 max-w-5xl">
            Your AI-powered coding assistant for debugging all your projects in seconds.
          </p>
          <Link to="/app" className="mt-10 mb-10 block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-9 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-lg"
            >
              Get Started →
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating animated code snippets */}
        <div className="absolute top-1/4 left-10 opacity-20 animate-float">
          <div className="bg-gray-700 p-2 rounded-md text-xs font-mono w-24 h-16"></div>
        </div>
        <div className="absolute bottom-1/3 right-10 opacity-20 animate-float-delay">
          <div className="bg-gray-700 p-2 rounded-md text-xs font-mono w-24 h-16"></div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        ref={featuresRef}
        className="relative py-20 px-6 md:px-16 bg-[#0F172A]/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Say goodbye to scattered debugging
          </motion.h2>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          >
            <motion.div 
              variants={item}
              className="space-y-6 p-8 bg-[#1E293B]/50 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold">Auto Bug Detection</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Upload or link your GitHub repo. BugWhisper analyzes and highlights code issues instantly.
              </p>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-xl overflow-hidden border border-gray-700 shadow-lg"
              >
                <img src="one.png" alt="Bug Detection" className="w-full object-cover" />
              </motion.div>
            </motion.div>

            <motion.div 
              variants={item}
              className="space-y-6 p-8 bg-[#1E293B]/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold">Your 24/7 Smart Debug Assistant</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Powered by AI, BugWhisper helps you manage, fix, and learn from code issues anytime, anywhere.
              </p>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-xl overflow-hidden border border-gray-700 shadow-lg"
              >
                <img src="second.png" alt="AI Assistant" className="w-full object-cover" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why BugWhisper Section */}
      <section 
        id="why" 
        ref={whyRef}
        className="relative py-20 px-6 md:px-16 bg-[#0B0F19]/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={container}
            initial="hidden"
            animate={whyInView ? "show" : "hidden"}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div 
              variants={item}
              className="flex-1 rounded-xl overflow-hidden border border-gray-700 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500"
              whileHover={{ y: -10 }}
            >
              <img src="three.png" alt="Why BugWhisper" className="w-full object-cover" />
            </motion.div>
            
            <motion.div 
              variants={item}
              className="flex-1 text-white space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Why Choose BugWhisper?
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                Automate debugging, get intelligent suggestions, and accelerate your development workflow with an assistant that understands your code.
              </p>
              
              <motion.ul 
                className="space-y-4 text-lg text-gray-300"
                variants={container}
              >
                {[
                  { icon: '🧠', text: 'AI-Powered Code Analysis' },
                  { icon: '🚀', text: 'Instant Fix Suggestions' },
                  { icon: '🔍', text: 'Smart Bug Search' },
                  { icon: '🔐', text: 'Secure & Private' },
                  { icon: '📦', text: 'Works with GitHub & local zip' }
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    variants={item}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1E293B]/50 transition-colors duration-200"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8"
              >
                <Link to="/app" className="inline-block">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-lg">
                    Try It Now
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-8 rounded-2xl bg-[#0F172A]/50 backdrop-blur-sm border border-gray-700/50"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Debugging?</h2>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Join thousands of developers who save hours every week with BugWhisper's AI-powered debugging.
          </p>
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-16 bg-[#0B0F19] border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BugWhisper</h3>
            <p className="text-gray-400">Your AI-powered debugging assistant for faster, smarter coding.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/support" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} BugWhisper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}