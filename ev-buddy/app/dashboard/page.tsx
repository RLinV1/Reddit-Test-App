"use client";
import { useState } from "react";
import { auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out.");
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const fakePosts = [
    {
      id: 1,
      title: "Why React is Awesome",
      content:
        "React makes building UIs a breeze. Learn more: https://react.dev",
      user: "user123",
      upvotes: 120,
    },
    {
      id: 2,
      title: "Understanding JavaScript Closures",
      content:
        "Closures are a fundamental concept in JavaScript that every dev should understand.",
      user: "js_lover",
      upvotes: 95,
    },
  ];



  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col min-h-screen p-4 text-black dark:text-white">
      <nav className="border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-black dark:text-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-4">
          <a href="#" className="flex items-center space-x-3">
            <img src="reddit.svg" className="h-8" alt="Reddit Logo" />
            <span className="self-center text-2xl font-semibold dark:text-white">
              Reddit
            </span>
          </a>

          <div className="flex items-center text-xl">
            <div
              onClick={() => setShowModal(true)}
              className="text-gray-900 dark:text-white font-semibold px-4 py-2 rounded-md bg-orange-500 hover:bg-gray-200 dark:hover:bg-gray-800 mx-12 cursor-pointer"
            >
              Create Post
            </div>
            <ul className="flex justify-center items-center">
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center py-2 px-3 text-xl text-gray-900 rounded-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded dark:bg-gray-700">
                    <ul className="py-2 text-gray-700 dark:text-gray-200">
                      <li>
                        <a
                          onClick={handleSignOut}
                          className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
        </div>
      </nav>

      {/* Feed */}
      <div>
        <h1 className="text-3xl font-bold text-center mt-6">Current Posts</h1>
        <div className="max-w-5xl mx-auto p-4">
          {fakePosts.map(({ id, title, content, user, upvotes }) => (
            <div
              key={id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 m-4 flex"
            >
              <div className="flex flex-col items-center justify-center gap-4 mr-8">
                <button>⬆️</button>
                <span>{upvotes}</span>
                <button>⬇️</button>
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4 break-all">
                  {linkify(content)}
                </p>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Posted by <strong>{user}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full dark:bg-gray-950 bg-opacity-50 flex justify-center items-center z-50 "
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-2xl fade-in "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold dark:text-white">Create Post</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-2xl hover:text-gray-800 dark:hover:text-white cursor-pointer"
              >
                X
              </button>
            </div>
            <form  className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                required
              />
              <textarea
                placeholder="Content or link"
                rows={4}
                className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
