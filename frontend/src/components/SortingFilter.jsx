import React, { useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";

const SortingFilter = ({ sortBy, setSortBy }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (type) => {
    setSortBy((prev) => (prev === type ? "default" : type));
    setShowFilters(false); // Close filter after selection (optional)
  };

  const buttonClass = (type) =>
    `px-4 py-2 rounded transition font-medium ${
      sortBy === type
        ? "bg-orange-600 text-white shadow"
        : "bg-gray-200 text-gray-800 hover:bg-orange-300"
    }`;

  return (
    <div className="flex items-center gap-3">
      {/* Main Sort Button */}
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="flex items-center gap-2 bg-gray-200 hover:bg-orange-300 px-4 py-2 rounded-md shadow transition font-semibold text-gray-700"
      >
        <FaSortAmountDown />
        Sort
      </button>

      {/* Horizontal Filter Buttons */}
      {showFilters && (
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("low-high")}
            className={buttonClass("low-high")}
          >
            ₹ Low to High
          </button>
          <button
            onClick={() => handleSort("high-low")}
            className={buttonClass("high-low")}
          >
            ₹ High to Low
          </button>
          <button
            onClick={() => handleSort("top-rated")}
            className={buttonClass("top-rated")}
          >
            ⭐ Top Rated
          </button>
        </div>
      )}
    </div>
  );
};

export default SortingFilter;