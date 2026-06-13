import React, { useState,useContext,useEffect } from "react";
import Modal from "react-modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
 
const ItemModal = ({ item, onClose }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addToCart } = useCart();
  const navigate= useNavigate();
   useEffect(() => {
    if (item) {
      const stored = JSON.parse(localStorage.getItem("recentItems")) || [];

      const isAlreadyViewed = stored.some((i) => i._id === item._id);
      let updated;

      if (!isAlreadyViewed) {
        updated = [item, ...stored];
      } else {
        updated = [item, ...stored.filter((i) => i._id !== item._id)];
      }

      if (updated.length > 10) updated = updated.slice(0, 10);

      localStorage.setItem("recentItems", JSON.stringify(updated));
    }
  }, [item]);
   const handleAddToCart = () => {
    
    const cartItem = {
      id: item._id, // MongoDB ID
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: 1,
    };
    addToCart(cartItem);
    // navigate("/cartpage");
    alert("Item added successfully to cart");
    onClose(); // Close the modal after adding to cart
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const toggleDescription = () => setShowFullDescription((prev) => !prev);

  const descriptionToShow = showFullDescription
    ? item.description
    : item.description.slice(0, 150);

  const settings = {
    infinite: true,
    autoplay: true,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const originalPrice = item.price;
  const halfPrice = originalPrice / 2;
  const getDiscountedPrice = (item, plateType) => {
  
    let discountedPrice = originalPrice;
  
    if (plateType === "half") {
     
      if (item.half_plate_discount) {
        discountedPrice = halfPrice - (halfPrice * item.half_plate_discount) / 100;
      } else {
        discountedPrice = halfPrice;
      }
    } else if (plateType === "full") {
      if (item.full_plate_discount) {
        discountedPrice = originalPrice - (originalPrice * item.full_plate_discount) / 100;
      }
    }
  
    return discountedPrice.toFixed(2);
  };
  

  const imageSlider = (
    <Slider {...settings}>
      {Array.isArray(item.images) && item.images.length > 0 ? (
        item.images.map((_, index) => (
          <img
            key={index}
            src={`http://localhost:5000/imageuploads/image/${item._id}/${index}`}
            alt={`item-${index}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))
      ) : (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}
    </Slider>
  );

  return (
     <div

  >
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      // shouldCloseOnOverlayClick={true} // ✅ click outside to close
      // shouldCloseOnEsc={true} // optional: press Esc to close
      onClick={handleBackdropClick}
   
      ariaHideApp={false}
      // ✨ This enables background scroll
      
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        },
        content: {
          pointerEvents: "auto",
          inset: "50% auto auto 50%",
          transform: "translate(-50%, -50%)",
          padding: 0,
          border: "none",
          background: "transparent",
        },
      }}
    >
      
      <div className="relative bg-white max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 w-[90vw] max-w-md">
        <button
          onClick={onClose}
          className="absolute top-0 right-2 text-red-600 text-lg font-bold"
        >
          ✕
        </button>

        {imageSlider}

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>

        <p className="text-gray-700 mb-1">
          {descriptionToShow}
          {item.description.length > 150 && (
            <span
              className="text-blue-600 cursor-pointer ml-1"
              onClick={toggleDescription}
            >
              {showFullDescription ? "Read Less" : "...Read More"}
            </span>
          )}
        </p>

        <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>

        {item.half_plate_discount > 0 && (
          <p className="text-sm text-gray-600">
            Half Plate:
            <span className="line-through text-red-400 ml-1">₹{halfPrice}</span>
            <span className="text-green-600 font-bold ml-2">
              ₹{getDiscountedPrice(item, "half")}
            </span>
            <span className="text-yellow-500 ml-1">
              ({item.half_plate_discount}% off)
            </span>
          </p>
        )}

        {item.full_plate_discount > 0 && (
          <p className="text-sm text-gray-600">
            Full Plate:
            <span className="line-through text-red-400 ml-1">₹{item.price}</span>
            <span className="text-green-600 font-bold ml-2">
              ₹{getDiscountedPrice(item, "full")}
            </span>
            <span className="text-yellow-500 ml-1">
              ({item.full_plate_discount}% off)
            </span>
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-green-600 font-bold text-lg">₹{item.price}</span>
          {item.rating && <span className="text-yellow-500">⭐ {item.rating}</span>}
        </div>
        
        <div className="flex justify-between items-center mt-4">
        <button
        onClick={handleAddToCart}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Add to Cart
      </button>
        </div>
          <h2 onClick= {()=>navigate("/cartpage")}className="text-sm  text-blue-800 underline px-4 mt-2">Go to Cart</h2>
      </div>
     
    </Modal>
    </div>
  );
};

export default ItemModal;
