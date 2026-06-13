import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "../components/AdminSidebar"; // adjust path as needed

const Cateogery = () => {
  const [cateogery, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const catperpage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCateogeries();
  }, []);

  const fetchCateogeries = () => {
    axios
      .get("http://localhost:5000/admin/category/with-counts")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error loading categories", err));
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      Swal.fire("Warning", "Please fill all fields", "warning");
      return;
    }
    axios
      .post("http://localhost:5000/admin/category/addcat", newCategory)
      .then(() => {
        Swal.fire("Success", "Category added successfully", "success");
        setNewCategory({ name: "", description: "" });
        fetchCateogeries();
      })
      .catch(() => Swal.fire("Error", "Failed to add category", "error"));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/admin/category/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Category deleted successfully.", "success");
            fetchCateogeries();
          })
          .catch(() => Swal.fire("Error", "Error deleting category", "error"));
      }
    });
  };

  const handleUpdate = () => {
    axios
      .put(
        `http://localhost:5000/admin/category/${editingItem._id}`,
        editingItem
      )
      .then(() => {
        Swal.fire("Success", "Category updated successfully", "success");
        setEditingItem(null);
        fetchCateogeries();
      })
      .catch(() => Swal.fire("Error", "Failed to update category", "error"));
  };

  const indexOfLastItem = currentPage * catperpage;
  const indexOfFirstItem = indexOfLastItem - catperpage;
  const currentCateogeries = cateogery.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cateogery.length / catperpage);

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
        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-6">
          <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

          {/* Add Category */}
          <div className="bg-white p-4 mb-6 rounded shadow">
            <h2 className="text-xl mb-2 font-semibold">Add New Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="border p-2 mr-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="border p-2 mr-2 rounded"
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Category Name</th>
                  <th className="py-3 px-6 text-left">Description</th>
                  <th className="py-3 px-6 text-left">Total Items</th>{" "}
                  {/* New Column */}
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCateogeries.length > 0 ? (
                  currentCateogeries.map((cat, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 px-6">
                        {editingItem?._id === cat._id ? (
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="py-3 px-6">
                        {editingItem?._id === cat._id ? (
                          <input
                            type="text"
                            value={editingItem.description}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                description: e.target.value,
                              })
                            }
                          />
                        ) : (
                          cat.description
                        )}
                      </td>
                      <td className="py-3 px-6">{cat.itemCount || 0}</td>

                      <td className="py-3 px-6 text-center space-x-2">
                        {editingItem?._id === cat._id ? (
                          <>
                            <button
                              onClick={handleUpdate}
                              className="text-green-600 font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-600"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingItem(cat)}
                              className="text-blue-500"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              className="text-red-500"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cateogery;
