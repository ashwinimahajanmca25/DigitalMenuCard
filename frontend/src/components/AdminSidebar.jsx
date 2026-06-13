// AdminSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ visible, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
     localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <div
      className={`fixed md:static top-0 left-0 min-h-screen z-50 bg-gray-800 text-white p-6 shadow-md w-64 transition-transform transform ${
        visible ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button onClick={toggleSidebar} className="text-white text-xl">
          &times;
        </button>
      </div>
      <ul className="space-y-4">
        <li>
          <button
            onClick={() => navigate("/admin")}
            className="hover:text-gray-400 transition duration-200"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/adminpanel")}
            className="hover:text-gray-400 transition duration-200"
          >
            Manage Items
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/admincat")}
            className="hover:text-gray-400 transition duration-200"
          >
            Categories
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/adminchnpwd")}
            className="hover:text-gray-400 transition duration-200"
          >
            Change Password
          </button>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
