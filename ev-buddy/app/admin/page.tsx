"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";

const Admin = () => {
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [postID, setPostID] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("User state changed:", firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
   if (!user) {
      setDbUser(null);
      return;
    }

      axios
        .get(`http://localhost:8000/api/users/${user?.uid}`)
        .then((response: AxiosResponse) => {
          setDbUser(response.data);
          if (response.data.isAdmin !== true) {
            console.error("User is not an admin");
            router.push("/");
          }
        })
        .catch((error: Error) => {
          console.error("Error fetching user:", error);
          router.push("/");
        });
    

    const data = axios
      .get("http://localhost:8000/api/posts")
      .then((response: AxiosResponse) => {
        setPosts(response.data);
      })
      .catch((error: Error) => {
        console.error("Error fetching posts:", error);
      });
  }, [user]);
  function linkify(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          className="text-blue-600 underline break-all"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  }
  type Post = {
    _id: number;
    title: string;
    content: string;
    username: string;
    upvotes: number;
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out.");
    }
  };
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleDeletePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postID) {
      // Implement delete post functionality
      console.log("Deleting post with ID:", postID);
      axios
        .delete(`http://localhost:8000/api/posts/${postID}`)
        .then(() => {
          setPosts(posts.filter((post) => post._id !== postID));
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
        });
    }
    setShowModal(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl">Unauthorized</h1>
      </div>
    );
  }

  
  if (!dbUser || dbUser.isAdmin !== true) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl">Unauthorized</h1>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col min-h-screen p-4 text-black dark:text-white">
      <nav className="border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-black dark:text-white">
        {error && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 flex justify-between items-center z-50">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="font-bold ml-4 cursor-pointer"
            >
              X
            </button>
          </div>
        )}

        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4">
          <a href="#" className="flex items-center space-x-3">
            <img src="reddit.svg" className="h-8" alt="Reddit Logo" />
            <span className="self-center text-2xl font-semibold dark:text-white">
              Reddit
            </span>
          </a>

          <ul className="flex justify-center items-center">
            <div className="text-2xl semi-bold dark:text-white self-center mr-8">
              <a
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer hover:text-gray-500 dark:hover:text-gray-300"
              >
                Posts
              </a>
            </div>
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center py-2 px-3 text-2xl text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                {auth.currentUser?.displayName || "User"}
                <svg
                  className="w-4 h-4 ms-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white rounded dark:bg-gray-700">
                  <ul className="py-2 text-gray-700 dark:text-gray-200">
                    <li>
                      <a
                        onClick={handleSignOut}
                        className="block px-3 py-2 text-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <div>
        <div className="text-3xl flex-col items-center dark:text-white flex justify-center">
          Admin Dashboard
          <p className="text-lg">Manage posts</p>
        </div>
        <div className="max-w-5xl mx-auto p-4">
          {posts.map(({ _id, title, content, username, upvotes }) => (
            <div
              key={_id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 m-4 flex justify-between "
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4 break-all">
                  {linkify(content)}
                </p>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Posted by <strong>{username}</strong>
                </div>
              </div>
              <div className="flex justify-start items-start">
                <button
                  onClick={() => {
                    setShowModal(true);
                    setPostID(_id);
                  }}
                  className="text-red-500 text-2xl hover:underline ml-4 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full dark:bg-gray-950 bg-opacity-50 flex justify-center items-center z-50 ">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-2xl fade-in "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold dark:text-white">
                Create Post
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-2xl hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                X
              </button>
            </div>
            <form className="flex flex-col gap-4">
              <div className="text-xl">Do you wish to delete this post?</div>
              <div className="flex justify-between items-center w-full gap-8">
                <button
                  type="submit"
                  className="bg-red-600 text-white py-2 w-full rounded hover:bg-red-700 cursor-pointer"
                  onClick={handleDeletePost}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="bg-blue-600  py-2 rounded w-full  hover:bg-blue-700 text-white cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  No
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
