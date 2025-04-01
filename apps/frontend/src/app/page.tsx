"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { login } = useAuth();

    useEffect(() => {
      // This runs only on the client side
      
    }, []);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
    
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  

  return (
    <main className="relative min-h-screen overflow-hidden bg-black ">
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_2px_#fff,inset_0_0_1px_#fff,0_0_8px_#fff,0_0_20px_#fff]"
            animate={{
              x: [
                Math.random() * windowSize.width,
                Math.random() * windowSize.width,
              ],
              y: [
                Math.random() * windowSize.height,
                Math.random() * windowSize.height,
              ],
              scale: [1, 1.5, 1],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              opacity: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              scale: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        ))}
      </div>

     
      

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-24">
        <motion.div
          className="relative flex place-items-center mb-16 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-48 h-48 relative"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-slate-500 to-zinc-500 rounded-lg opacity-80"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ type: "spring" }}
            />
            <div className="absolute inset-0 bg-black/100 rounded-lg -rotate-3 flex items-center justify-center backdrop-blur-sm border border-zinc-800">
              <motion.svg
                className="w-24 h-24 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                whileHover={{ scale: 1.2 }}
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </motion.svg>
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-zinc-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Note Taker
        </motion.h1>
        
        <motion.div
          className="flex flex-col items-center gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={login}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-slate-600 to-zinc-600 hover:from-slate-700 hover:to-zinc-700 text-white shadow-lg"
              size="lg"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                animate={{
                  x: [-100, 200],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative" onClick={login}>Start Taking Notes</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
