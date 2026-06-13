import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Login from "./components/Login";
import AdminPanel from "./pages/AdminPanel";
import Cateogery from "./pages/Cateogery";
import Dashboard from "./pages/Dashboard";
import BookWrapper from "./pages/BookWrapper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/Usepanel/UserProfile";
import UserSidebar from "./pages/Usepanel/UserSidebar";
import FeedbackPage from "./pages/Usepanel/FeedbackPage";
import RecentlyViewed from "./pages/Usepanel/RecentlyViewed";
import ChangePassword from "./pages/Usepanel/ChangePassword";
import { CartProvider } from "./context/CartContext";
import CartPage from "./components/CartPage";
import BillingPage from "./components/BillingPage";

function App() {
  return (
    <BrowserRouter>
     <CartProvider>
      <Routes>
        <Route path="/" element={<BookWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admincat" element={<Cateogery />} />
        <Route path="/adminpanel" element={<AdminPanel />} />

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/usersidebar" element={<UserSidebar />} />
        <Route path="/myprofile" element={<UserProfile />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/recently-viewed" element={<RecentlyViewed />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        <Route path="/cartcontext" element={<CartProvider />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="/billingpage" element={<BillingPage/>} />





      </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
