import React, { useState } from "react";
import Slider from "react-slick";


const MenuCard = ({ item, view, onClick }) => {
  const [items, setItems] = useState([]);
  const [plateType, setPlateType] = useState('full'); // default to full plate

  
  const cardClass =
    "bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer";
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
    
  const settings = {
    // dots: true,
    infinite: true,
    autoplay: true,
    // autoplaySpeed: 25000,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const imageSlider = (
    <Slider {...settings}>
      {Array.isArray(item.images) && item.images.length > 0 ? (
        item.images.map((_, index) => (
          <img
            key={index}
            src={`http://localhost:5000/imageuploads/image/${item._id}/${index}`}
            alt={`item-${index}`}
            className="w-full h-40 object-cover rounded-lg"
          />
        ))
      ) : (
        <img
          src="https://media.istockphoto.com/id/873539518/photo/deep-fried-bread-spicy-chickpeas-curry-and-salad.jpg?s=1024x1024&w=is&k=20&c=09OHCgh8HINbB3Whd8wFaxzg930GEyRQWhizb5P4ET8="
          alt="default"
          className="w-full h-40 object-cover rounded-lg"
        />
      )}
    </Slider>
  );

  if (view === "list") {
    return (
      <div
        onClick={onClick}
        className={`flex gap-4 items-start ${cardClass}`}
      >
        <div className="w-1/2">{imageSlider}</div>
        <div className="flex flex-col justify-between w-1/2">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-gray-600 text-sm line-clamp-1">
              {item.description}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Category: <span className="capitalize">{item.category}</span>
            </p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-green-600 font-semibold text-lg">
              ₹{item.price}
            </span>
            {item.rating && (
              <span className="text-yellow-500 font-medium">
                ⭐ {item.rating}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cardClass}
    >
      {imageSlider}
      <h2 className="text-xl font-bold text-gray-800 mt-2">{item.name}</h2>
      <p className="text-gray-600 text-sm line-clamp-1">{item.description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-green-600 font-semibold text-lg">
          ₹{item.price}
        </span>
        {item.rating && (
          <span className="text-yellow-500 font-medium">⭐ {item.rating}</span>
        )}
      </div>

{/* Show Half Plate Price if there's a discount */}
 {item.half_plate_discount > 0 && (
<p className="text-sm text-gray-600">
Half Plate: <span className="line-through text-red-400">₹{halfPrice}</span>{" "}
   <span className="text-green-600 font-bold ml-2">
     ₹{getDiscountedPrice(item, 'half')}
   </span>
   <span className="text-yellow-500">({item.half_plate_discount}% off)</span>
   </p>
  )}
 
 {/* Show Full Plate Price if there's a discount */}
  {item.full_plate_discount > 0 && (
    <p className="text-sm text-gray-600">
      Full Plate: <span className="line-through text-red-400">₹{item.price}</span>{" "}
  <span className="text-green-600 font-bold ml-2">
    ₹{getDiscountedPrice(item, 'full')}
  </span>
 
      <span className="text-yellow-500">({item.full_plate_discount}% off)</span>
    </p>
  )}

 </div>
  );
};

export default MenuCard;
