import React, { useEffect, useState } from "react";
import { FaUser, FaBars, FaTimes, FaBoxOpen, FaEye, FaUserLock } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const UserSidebar = () => {
  const [username, setUsername] = useState("User");
  const [currentTime, setCurrentTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Set username from localStorage (email)
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");

    if (storedEmail) {
      const namePart = storedEmail.split("@")[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      setUsername(capitalized);
    } else {
      setUsername("User");
    }
  }, []);

  // ✅ Set live time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      setCurrentTime(formattedTime);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Menu Icon */}
      <div className="relative w-min p-2 text-white bg-green-800 md:hidden top-12 left-0 z-50 rounded-md">
        <button onClick={() => setIsSidebarOpen(true)}>
          <FaBars size={19} />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-green-800 text-white p-6 rounded-lg shadow-lg transition-transform duration-300 md:relative md:translate-x-0 md:block md:w-64 lg:w-72 xl:w-80 md:h-min md:mt-28 absolute top-12 md:top-8 md:left-10 left-0 h-full w-72 z-50 md:z-0
             ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close Button (Mobile Only) */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center mb-8">
          <div className="bg-green-700 rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold tracking-wide hover:bg-lime-600 hover:text-white transition duration-300 ease-in-out px-4 py-2">
            {username[0]?.toUpperCase()}
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-xl">{username}</h2>
            <p className="text-sm">{currentTime}</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav>
          <ul className="space-y-2 text-lg font-semibold text-white">
            <li
              className="flex items-center px-4 py-2 tracking-wide hover:bg-lime-600 transition duration-300 ease-in-out rounded hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Link to="/myprofile" className="flex items-center w-full">
                <FaUser className="mr-3 h-5 w-5" /> My Profile
              </Link>
            </li>
            <li
              className="flex items-center px-4 py-2 tracking-wide hover:bg-lime-600 transition duration-300 ease-in-out rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Link to="/orderspage">
                <FaBoxOpen className="h-6 w-6 mr-3 inline-block" />
                My Orders
              </Link>
            </li>
            <li
              className="flex items-center px-4 py-2 tracking-wide hover:bg-lime-600 transition duration-300 ease-in-out rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Link to="/recently-viewed">
                <FaEye className="inline-block h-6 w-6 mr-2" /> Recently Viewed
              </Link>
            </li>
            <li
              className="flex items-center px-4 py-2 tracking-wide hover:bg-lime-600 transition duration-300 ease-in-out rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Link to="/change-password">
                <FaUserLock className="inline-block h-6 w-6 mr-2" /> Change Password
              </Link>
            </li>
            <li
              className="flex items-center px-4 py-2 tracking-wide hover:bg-lime-600 transition duration-300 ease-in-out cursor-pointer rounded"
              onClick={() => {
                handleLogout();
                setIsSidebarOpen(false);
              }}
            >
              <IoLogOut className="inline-block h-7 w-7 mr-2" /> Log Out
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default UserSidebar;
