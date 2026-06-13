// File: src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

    try {
      const res = await axios.post(url, payload);
      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user)); // 👈 includes _id
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);

      // Optional: decode token to extract user ID
      const decoded = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("user", JSON.stringify({ id: decoded.id }));

      // Navigate based on role
      if (res.data.role === "customer") {
        navigate("/myprofile");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
           
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
   <button
            onClick={() => navigate("/")}
            className="flex items-center text-blue-600 hover:underline mt-4"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <label className="block font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 pr-10"
              required
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-6"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:underline ml-1 font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
