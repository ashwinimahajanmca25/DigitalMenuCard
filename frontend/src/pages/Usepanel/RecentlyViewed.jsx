import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const RecentlyViewed = () => {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('recentItems')) || [];
    setRecentItems(storedItems.reverse()); // latest first
  }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <UserSidebar />
      <h2 className="text-3xl font-bold mb-6 text-center text-green-700">
        Recently Viewed Items
      </h2>

      {recentItems.length === 0 ? (
        <p className="text-center text-gray-500">You haven't viewed any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recentItems.map((item, index) => (
            <Link
              to={`/${item._id}`}
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
            >
              <img
              src={`http://localhost:5000/imageuploads/image/${item._id}/${index}`}
                alt={item.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-blue-600 font-bold mt-2">₹{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
