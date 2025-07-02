
"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      console.log("Signing in with", { email, password });
    } else {
      console.log("Signing up with", { email, password });
    }
    setEmail("");
    setPassword("");
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col justify-evenly min-h-screen">
      <h1 className="text-3xl text-white text-center">
        Welcome to Test Reddit App
      </h1>

      <form className="max-w-sm w-full mx-auto mb-16">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2.5 border rounded-lg"
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email }

          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2.5 border rounded-lg"
            placeholder="•••••••••"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 p-2.5 rounded-lg"
          onClick={handleSubmit}
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </button>
        <button type="button" className="text-white hover:underline cursor-pointer flex w-full p-4 justify-center items-center" onClick={() => setIsSignIn(!isSignIn)}>
          Switch to {isSignIn ? "Sign Up" : "Sign In"}
        </button>
      </form>
    </div>
    
  );
}
