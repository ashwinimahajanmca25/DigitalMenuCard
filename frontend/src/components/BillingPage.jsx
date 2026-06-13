import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const BillingPage = () => {
  const { cartItems } = useContext(CartContext);
const navigate = useNavigate();
  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxes = +(subTotal * 0.08).toFixed(2); // Example: 8% GST
  const grandTotal = subTotal + taxes;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
       <button
                  onClick={() => navigate("/cartpage")}
                  className="flex items-center text-blue-600 hover:underline mt-4"
                >
                  <FaArrowLeft className="mr-2" /> Back to Home
                </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Billing Summary</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">₹{item.price}</td>
                <td className="p-4">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right space-y-2">
        <p className="text-lg">Subtotal: ₹{subTotal.toFixed(2)}</p>
        <p className="text-lg">Taxes (8%): ₹{taxes}</p>
        <p className="text-xl font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</p>
        <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
