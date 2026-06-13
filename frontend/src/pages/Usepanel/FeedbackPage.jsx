import React, { useState } from 'react';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '',
    message: '',
    file: null,
  });

  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate backend API here
    console.log(formData);
    setSuccess('Thank you for your feedback!');
    setFormData({
      name: '',
      email: '',
      rating: '',
      message: '',
      file: null,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Feedback</h2>

      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Rating</label>
          <select
            name="rating"
            required
            value={formData.rating}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="">Select rating</option>
            <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
            <option value="4">⭐⭐⭐⭐ - Good</option>
            <option value="3">⭐⭐⭐ - Average</option>
            <option value="2">⭐⭐ - Poor</option>
            <option value="1">⭐ - Terrible</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Message</label>
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us about your experience..."
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Upload Image (optional)</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;