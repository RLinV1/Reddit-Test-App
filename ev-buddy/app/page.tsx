"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; // Adjust the import path as necessary
import { FirebaseError } from "firebase/app";
import axios from "axios";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      console.log("Signing in with", { email, password });
      handleSignIn();
    } else {
      console.log("Signing up with", { email, password, username });
      handleSignUp();
    }
  };

  const handleSignIn = async () => {
    try {
     
      const userData = await signInWithEmailAndPassword(auth, email, password);
      const user = userData.user;
      console.log("User signed in:", user);
      console.log("User signed in successfully");
      router.push("/dashboard");
      setEmail("");
      setPassword("");
      setUsername("");
      setError("");
    } catch (error) {
      console.error("Error signing in:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
        if (error.code === "auth/user-not-found") {
          setError("User not found. Please check your email or sign up.");
        }
        if (error.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        }
        if (error.code === "auth/invalid-email") {
          setError("Invalid email format. Please check your email.");
        }
      }
      
    }
  };

  const handleSignUp = async () => {
    try {
      // generate a new user
      
      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const mongoDBuser = await axios.post("http://localhost:8000/api/users/", {
        email,
        username,
        isAdmin: false, // Default to false for regular users
        uid: userData.user.uid, // Use Firebase UID for MongoDB
      })
    
      const user = userData.user;
      console.log("User created:", user);
      await updateProfile(user, {
        displayName: username,
      });

      console.log("User signed up successfully");
      router.push("/dashboard");
      setEmail("");
      setPassword("");
      setUsername("");
      setError("");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
        if (error.code === "auth/email-already-in-use") {
          setError("Email already in use. Please use a different email.");
        }
        if (error.code === "auth/invalid-email") {
          setError("Invalid email format. Please check your email.");
        }
        if (error.code === "auth/weak-password") {
          setError("Weak password. Please use a stronger password.");
        }
      }
     
    }
  };
  return (
    // Login and Sign Up Form
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col justify-evenly min-h-screen">
      <h1 className="text-3xl text-white text-center">
        Welcome to Test Reddit App
      </h1>

      <form className="max-w-sm w-full mx-auto mb-16">
        {!isSignIn && (
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2.5 border rounded-lg"
              placeholder="Your Username"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
        )}
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
            value={email}
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
        <button
          type="button"
          className="text-white hover:underline cursor-pointer flex w-full p-4 justify-center items-center"
          onClick={() => setIsSignIn(!isSignIn)}
        >
          Switch to {isSignIn ? "Sign Up" : "Sign In"}
        </button>
        <div className="text-center text-red-500 mt-4">{error}</div>
      </form>
    </div>
  );
}
