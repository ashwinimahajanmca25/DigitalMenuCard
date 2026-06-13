import React, { useEffect,useState } from "react";
import Home from "../components/Home";
import "./BookStyle.css";
import axios from "axios";
const BookWrapper = () => {
  const [flipped, setFlipped] = useState(false);
  const [hotelName, setHotelName] = useState("");

  useEffect(() => {
    fetchHotelName();
  }, []);

  const fetchHotelName = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/setting/hotel-name");
      setHotelName(res.data.hotelName);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="book-flip-container">
      <div className={`book-flip ${flipped ? "flipped" : ""}`}>
        {/* Book Cover (Front) */}
        <div className="book-cover-page" onClick={() => setFlipped(true)}>
  {/* Optional fallback text if image fails */}
  <h1 className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 font-bold cursor-pointer text-2xl">Tap Here</h1>
  <h1 className="cover-title">{hotelName ? hotelName : "Loading..."}</h1>
</div>


        {/* Book Inner Page (Back Side) */}
        <div className="book-inner-page">
          <Home />
        </div>
      </div>
    </div>
  );
};

export default BookWrapper;
