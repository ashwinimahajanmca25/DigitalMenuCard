// 📁 src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);
      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          required
        />
       <div className="relative mb-3">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    value={form.password}
    onChange={handleChange}
    placeholder="Password"
    className="w-full p-2 border rounded pr-10"
    required
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
  >
    {showPassword ? "🙈" : "👁️"}
  </span>
</div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;