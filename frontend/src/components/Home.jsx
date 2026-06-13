import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuCard from "./MenuCard";
import SortingFilter from "./SortingFilter";
import ItemModal from "./ItemModal";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { FaEarthAfrica } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdGridView } from "react-icons/md";
import { TfiViewListAlt } from "react-icons/tfi";
import { FaSearch } from "react-icons/fa";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  const navigate = useNavigate();
  const fetchHotelName = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/setting/hotel-name"
      );
      setHotelName(res.data.hotelName);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchHotelName();
    fetchCart();
    Promise.all([
      axios.get("http://localhost:5000/menu/with-category"),
      axios.get("http://localhost:5000/category"),
    ])
      .then(([itemRes, catRes]) => {
        setMenuItems(itemRes.data);
        setCategories(catRes.data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const fetchCart = async () => {
    if (!userId || !token) {
      navigate("/auth");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  const sortedItems = [...menuItems].sort((a, b) => {
    if (sortBy === "low-high") return a.price - b.price;
    if (sortBy === "high-low") return b.price - a.price;
    if (sortBy === "top-rated") return b.rating - a.rating;
    return 0;
  });

  const filteredItems = sortedItems.filter((item) => {
    const nameMatch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descriptionMatch = item.description
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const categoryText =
      typeof item.category === "object" ? item.category?.name : item.category;
    const categoryMatch = categoryText
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return nameMatch || categoryMatch || descriptionMatch;
  });

  const groupedItems = {};
  filteredItems.forEach((item) => {
    const category =
      typeof item.category === "object"
        ? item.category?.name
        : item.category || "Others";
    if (!groupedItems[category]) groupedItems[category] = [];
    groupedItems[category].push(item);
  });

  const handleLoginClick = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/myprofile");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2">
          
          {hotelName ? hotelName : "Loading..."} Restaurant
        </h1>

        <div className="flex items-center gap-4">
         <div className="relative mt-2">
            {!showSearch ? (
              <button
                onClick={() => setShowSearch(true)}
                className="text-gray-700 hover:text-orange-500"
              >
                <FaSearch className="text-xl" />
              </button>
            ) : (
              <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1 w-full md:w-64 bg-white focus-within:ring-2 focus-within:ring-orange-400 transition-all">
                <FaSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  className="flex-1 outline-none bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (searchQuery === "") {
                      setShowSearch(false);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <FaEarthAfrica className="text-2xl hover:text-orange-500 cursor-pointer text-gray-700" />
          <FaShoppingCart
            onClick={() => navigate("/cartpage")}
            className="text-2xl text-gray-700 hover:text-orange-500 cursor-pointer"
          />
          <IoMdLogIn
            onClick={handleLoginClick}
            className="text-2xl text-gray-700 hover:text-orange-500 cursor-pointer"
          />
        </div>
      </header>

      {/* Search + Sorting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <SortingFilter sortBy={sortBy} setSortBy={setSortBy} />
        <div>
          <div className="flex items-center gap-4">
            {/* Grid View Button */}
            <button className="relative group" onClick={() => setView("grid")}>
              <MdGridView
                className={`text-3xl transition  ${
                  view === "grid" ? "text-orange-600" : "text-gray-500"
                }`}
              />
              {/* Tooltip */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                Grid
              </div>
            </button>

            {/* List View Button */}
            <button className="relative group" onClick={() => setView("list")}>
              <TfiViewListAlt
                className={`text-2xl transition ${
                  view === "list" ? "text-orange-600" : "text-gray-500"
                }`}
              />
              {/* Tooltip */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                List
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Grouped Items */}
      {Object.keys(groupedItems).length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No menu items found.</p>
      ) : (
        Object.entries(groupedItems).map(([category, items]) =>
          items.length > 0 ? (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-orange-200 pb-1 capitalize">
                🍲 {category}
              </h2>
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                    : "flex flex-col gap-5"
                }
              >
                {items.map((item) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    view={view}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </div>
          ) : null
        )
      )}

      {/* Modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      {/* Floating Mini Cart Summary */}
      {menuItems.length > 0 && cartItems?.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-xl border border-orange-300 rounded-lg px-4 py-3 z-50 max-w-xs w-full">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-lg text-orange-700">
              🛒 {cartItems.length} Items
            </h4>
            <button
              onClick={() => navigate("/cartpage")}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Proceed to Pay
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto text-sm text-gray-700">
            {cartItems.slice(0, 3).map((item) => (
              <div key={item._id} className="flex justify-between mb-1">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            {cartItems.length > 3 && (
              <p className="text-right text-xs text-gray-500">...and more</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;