import React, { useState } from 'react';
import UserSidebar from './UserSidebar';
import axios from 'axios';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const togglePassword = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^()])[A-Za-z\d@$!%*?#&^()]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and a special character.'
      );
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:5000/api/users/change-password',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage('Password changed successfully.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(response.data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Server error. Try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <UserSidebar />
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

      {message && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-1">Current Password</label>
          <input
            type={show.current ? 'text' : 'password'}
            name="currentPassword"
            required
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:border-blue-500 pr-10"
          />
          <span
            onClick={() => togglePassword('current')}
            className="absolute top-9 right-3 cursor-pointer text-gray-500 text-sm"
          >
            {show.current ? '🙈' : '👁️'}
          </span>
        </div>

        {/* New Password */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <input
            type={show.new ? 'text' : 'password'}
            name="newPassword"
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:border-blue-500 pr-10"
          />
          <span
            onClick={() => togglePassword('new')}
            className="absolute top-9 right-3 cursor-pointer text-gray-500 text-sm"
          >
            {show.new ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
          <input
            type={show.confirm ? 'text' : 'password'}
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring focus:border-blue-500 pr-10"
          />
          <span
            onClick={() => togglePassword('confirm')}
            className="absolute top-9 right-3 cursor-pointer text-gray-500 text-sm"
          >
            {show.confirm ? '🙈' : '👁️'}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
