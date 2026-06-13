import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar"; // adjust path as needed
import Swal from "sweetalert2";

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    images: [],
    description: "",
    rating: "",
    available: true,
    half_plate_discount: "", // 👈
    full_plate_discount: "", // 👈
  });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) navigate("/login");
    fetchItems();
    fetchCategories(); // fetch categories
  }, [navigate]);

  const fetchItems = () => {
    axios
      .get("http://localhost:5000/menuitems")

      .then((res) => {
        if (Array.isArray(res.data)) {
          setItems(res.data);
        } else {
          console.error("Expected array but got:", res.data);
          setItems([]); // fallback to empty list
        }
      })
      .catch((err) => {
        console.error("Error fetching menu items:", err);
        setItems([]); // avoid crash
      });
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories", err));
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("categoryId", form.categoryId);
    formData.append("description", form.description);
    formData.append("rating", form.rating);
    formData.append("available", form.available);
    formData.append("half_plate_discount", form.half_plate_discount);
    formData.append("full_plate_discount", form.full_plate_discount);

    // Add images as needed
    if (form.images && form.images.length > 0) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/menu/${editingId}`, formData);
        Swal.fire("Updated!", "Item updated successfully.", "success");
      } else {
        await axios.post("http://localhost:5000/imageuploads", formData);
        Swal.fire("Success!", "Item added successfully.", "success");
      }

      setForm({
        name: "",
        price: "",
        categoryId: "",
        images: [],
        description: "",
        rating: "",
        available: true,
        half_plate_discount: 0,
        full_plate_discount: 0,
      });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Submit Error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while submitting!",
      });
    }
  };
  const calculateDiscountedPrice = (price, discount, plateType) => {
    if (plateType === "half") {
      return price * (1 - discount / 100);
    } else if (plateType === "full") {
      return price * (1 - discount / 100);
    }
    return price;
  };

  // Example usage in the frontend to display prices
  const discountedHalfPlatePrice = calculateDiscountedPrice(
    items.price,
    items.half_plate_discount,
    "half"
  );
  const discountedFullPlatePrice = calculateDiscountedPrice(
    items.price,
    items.full_plate_discount,
    "full"
  );

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/menu/${id}`);
        Swal.fire("Deleted!", "Item successfully deleted!", "success");
        fetchItems();
      }
    });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      ...item,
      categoryId: item.categoryId,
      images: [], // Important: keep this empty unless user selects new images
      existingImages: item.images || [], // 👈 Add this
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 mb-6 rounded shadow grid md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={(e) =>
                setForm((prev) => ({ ...prev, images: e.target.files }))
              }
              className="p-2 border rounded"
            />

            {editingId && form.existingImages?.length > 0 && (
              <div className="md:col-span-2 flex gap-2 flex-wrap">
                {form.existingImages.map((_, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/imageuploads/image/${editingId}/${index}`}
                    alt={`existing-${index}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, existingImages: [] }))
                  }
                  className="text-sm text-red-600 underline"
                >
                  Remove existing images
                </button>
              </div>
            )}

            <input
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="p-2 border rounded md:col-span-2"
            />
            <input
              name="half_plate_discount"
              type="number"
              placeholder="Half Plate Discount (%)"
              value={form.half_plate_discount}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="full_plate_discount"
              type="number"
              placeholder="Full Plate Discount (%)"
              value={form.full_plate_discount}
              onChange={handleChange}
              className="p-2 border rounded"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded md:col-span-2"
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </form>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Rating</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, catitems) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">₹{item.price}</td>
                    <td className="p-2">
                      {categories.find((cat) => cat._id === item.categoryId)
                        ?.name || "Uncategorized"}
                    </td>

                    <td className="p-2 flex gap-2">
                      {Array.isArray(item.images) && item.images.length > 0 ? (
                        item.images.map((_, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000/imageuploads/image/${item._id}/${index}`}
                            alt={`item-${index}`}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ))
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>

                    <td className="p-2">⭐ {item.rating}</td>
                    <td className="p-2">{item.available ? "✅" : "❌"}</td>
                    <td className="p-2">
                      <p>Original Price: ₹{item.price}</p>
                      {item.half_plate_discount && (
                        <p>
                          Half Plate Price: ₹
                          {(
                            item.price *
                            (1 - item.half_plate_discount / 100)
                          ).toFixed(2)}
                        </p>
                      )}
                      {item.full_plate_discount && (
                        <p>
                          Full Plate Price: ₹
                          {(
                            item.price *
                            (1 - item.full_plate_discount / 100)
                          ).toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
