"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (username.trim()) {
      localStorage.setItem("username", username);
      router.push("/notes");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-background to-muted">
      <div className="relative flex place-items-center mb-16 group">
        {/* Cool animated graphic */}
        <div className="w-48 h-48 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform"></div>
          <div className="absolute inset-0 bg-background rounded-lg transform -rotate-3 group-hover:-rotate-6 transition-transform flex items-center justify-center">
            <svg
              className="w-24 h-24 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Welcome to Note Taker
      </h1>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={handleStart}
          className="w-full"
          size="lg"
          disabled={!username.trim()}
        >
          Start Taking Notes
        </Button>
      </div>
    </main>
  );
}
