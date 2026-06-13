// src/utils/auth.js
import jwtDecode from "jwt-decode";

export const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (err) {
    return null;
  }
};
