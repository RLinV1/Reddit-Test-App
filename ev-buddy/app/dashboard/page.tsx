"use client";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import axios from "axios";

const Dashboard = () => {

  type Post = {
    _id: number;
    title: string;
    content: string;
    username: string;
    upvotes: number;
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    setUser(firebaseUser);
    console.log("User state changed:", firebaseUser);
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    const data = axios.get("http://localhost:8000/api/posts")
      .then((response: AxiosResponse) => {
        setPosts(response.data);
      }
      )
      .catch((error: Error) => {
        console.error("Error fetching posts:", error);
      });

      if (user) {
      axios.get(`http://localhost:8000/api/users/${user?.uid}`)
        .then((response: AxiosResponse) => {
          setUser(response.data);
        })
        .catch((error: Error) => {
          console.error("Error fetching user:", error);
          router.push("/");
        });
      }
  }, [user]);

  const handleUpvote = async (postId: number) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/posts/upvote`, {
        id: postId,
        uid: auth.currentUser?.uid,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, upvotes: response.data.upvotes } : post
        ).sort((a, b) => b.upvotes - a.upvotes)
      );
    } catch (error) {
      console.error("Error upvoting post:", error);
      setError("Failed to upvote post. You can only upvote once.");
    }
  };

  const handleDownvote = async (postId: number) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/posts/downvote`, {
        id: postId,
        uid: auth.currentUser?.uid,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, upvotes: response.data.upvotes } : post
        ).sort((a, b) => b.upvotes - a.upvotes)
      );
    } catch (error) {
      console.error("Error downvoting post:", error);
      setError("Failed to downvote post. You can only downvote once.");
    }
  };
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
      setError("Failed to sign out.");
    }
  };
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/posts", {
      title,
      content,
      username: auth.currentUser?.displayName || "Anonymous",
    });
    setTitle("");
    setContent("");
    setShowModal(false);

    const response = await axios.get("http://localhost:8000/api/posts");
    setPosts(response.data);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);




  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col min-h-screen p-4 text-black dark:text-white">
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 flex justify-between items-center z-50">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold ml-4 cursor-pointer">
            X
          </button>
        </div>
      )}

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
                  <div className="absolute right-0 mt-2 w-fit bg-white rounded dark:bg-gray-700">
                    <ul className="py-2 text-gray-700 dark:text-gray-200">
                      {user.isAdmin && <li>
                        <a
                          onClick={() => router.push("/admin")}
                          className="block px-4 py-2 cursor-pointer text-nowrap hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Admin Dashboard
                        </a>
                      </li> }
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
          {posts.map(({ _id, title, content, username, upvotes }) => (
            <div
              key={_id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 m-4 flex"
            >
              <div className="flex flex-col items-center justify-center gap-4 mr-8">
                <button className="cursor-pointer" onClick={() => handleUpvote(_id)}>⬆️</button>
                <span>{upvotes}</span>
                <button className="cursor-pointer" onClick={() => handleDownvote(_id)}>⬇️</button>
              </div>
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
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                required
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Content or link"
                rows={4}
                className="p-2 rounded border dark:bg-gray-700 dark:text-white"
                onChange={(e) => setContent(e.target.value)}
              
                required
              ></textarea>
              <button
                type="submit"
                className="cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                onClick={handlePostSubmit}
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
