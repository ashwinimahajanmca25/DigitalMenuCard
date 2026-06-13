import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    const fetchCartItems = async () => {
       const handleCartClick = () => { 
       if (!userId || !token) {
      navigate("/auth");
      return;
    }

  };

      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data);
      } catch (error) {
        console.error("❌ Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, token]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:5000/api/cart/update/${id}`, {
        quantity: newQuantity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems(prev =>
        prev.map(item =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxes = +(subTotal * 0.08).toFixed(2);
  const grandTotal = subTotal + taxes;

  const handlePayment = () => {
    alert("💳 you had make succefully Payment Total: ₹" + grandTotal.toFixed(2));
    // Here you'd redirect to Razorpay / Stripe or process order.
  };

  if (loading) return <p className="text-center mt-10">Loading your cart...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-blue-600 hover:underline mt-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Home
      </button>
      <h2 className="text-3xl font-bold mb-6">🛒 Cart & Billing Summary</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-2 bg-gray-200 rounded hover:bg-gray-300">-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-2 bg-gray-200 rounded hover:bg-gray-300">+</button>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BILLING SUMMARY */}
          <div className="bg-white p-4 rounded shadow-md h-fit">
            <h4 className="text-xl font-bold mb-4">💰 Billing Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (8%):</span>
                <span>₹{taxes}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Proceed to Pay ₹{grandTotal.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
