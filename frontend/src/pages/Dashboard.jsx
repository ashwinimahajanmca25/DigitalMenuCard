import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar"; // adjust path as needed
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    topCategory: null
  });
  const [hotelName, setHotelName] = useState("");
    const navigate = useNavigate();
  
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) navigate("/login");
    fetchDashboardStats();
    fetchHotelName();
  }, [navigate]);
 

  const fetchHotelName = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/setting/hotel-name");
      setHotelName(res.data.hotelName);
    } catch (error) {
      console.error(error);
    }
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

const toggleSidebar = () => {
  setSidebarVisible(!sidebarVisible);
};


  const updateHotelName = async () => {
    try {
      await axios.put("http://localhost:5000/api/setting/hotel-name", { hotelName });
      alert("Hotel name updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update hotel name.");
    }
  };
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/dashboard/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
  <div className="md:hidden p-4 bg-gray-100">
  <button onClick={toggleSidebar} className="text-2xl">
    &#9776; {/* hamburger icon */}
  </button>
</div>
<AdminSidebar visible={sidebarVisible} toggleSidebar={toggleSidebar} />


  {/* Main Content */}
  <div className="flex-1 p-4">
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Menu Card Dashboard</h1>
      
      <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Hotel Name</h2>
      <input
        type="text"
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
        placeholder="Enter new hotel name"
      />
      <button onClick={updateHotelName} className="bg-blue-500 text-white p-2 rounded">
        Update Name
      </button>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">📁 Total Categories</h2>
          <p className="text-2xl text-blue-600">{stats.totalCategories}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🍽️ Total Menu Items</h2>
          <p className="text-2xl text-green-600">{stats.totalItems}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">🔥 Top Category</h2>
          {stats.topCategory ? (
            <p className="text-lg">
              {stats.topCategory.categoryName} ({stats.topCategory.itemCount} items)
            </p>
          ) : (
            <p className="text-gray-500 italic">No data</p>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;
