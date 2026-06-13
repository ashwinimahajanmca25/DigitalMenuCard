import React, { useEffect, useState } from "react";
import UserSidebar from "./UserSidebar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
const UserProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    contact: "",
    birthdate: "",
    gender: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Load user info from token and fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
 const email = localStorage.getItem("email");
 const role = localStorage.getItem("role");
    if (!token || !email || !role) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      setUserId(id);

      axios
        .get(`http://localhost:5000/api/users/${id}`)
        .then((res) => {
          const data = res.data;
          setFormData({
            name: data.name || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "India",
            contact: data.contact || "",
            birthdate: data.birthdate ? data.birthdate.slice(0, 10) : "",
            gender: data.gender || "",
          });
          setOriginalData({
            ...data,
            birthdate: data.birthdate ? data.birthdate.slice(0, 10) : "",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          alert("Could not load profile.");
        });
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, formData);
      alert("Profile updated successfully!");
      setOriginalData(formData); // update the backup
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
         <button
      onClick={() => navigate("/")}
      className="flex items-center text-blue-600 hover:underline mt-4"
    >
      <FaArrowLeft className="mr-2" /> Back to Home
    </button>
      <UserSidebar />
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8">
          Welcome, {formData.name || "User"}!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} editable={isEditing} />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} editable={isEditing} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} editable={isEditing} />
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} editable={isEditing} />
          <Input label="City" name="city" value={formData.city} onChange={handleChange} editable={isEditing} />
          <Input label="State" name="state" value={formData.state} onChange={handleChange} editable={isEditing} />
          <Input label="Country" name="country" value={formData.country} onChange={handleChange} editable={isEditing} />
          <Input label="Contact" name="contact" value={formData.contact} onChange={handleChange} editable={isEditing} />
          <Input label="Birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} editable={isEditing} />

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="text-center mt-10 flex gap-4 justify-center">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, editable, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={!editable}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${!editable && "bg-gray-100"}`}
    />
  </div>
);

export default UserProfile;
