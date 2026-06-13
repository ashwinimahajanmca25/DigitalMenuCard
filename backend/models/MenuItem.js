const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  images: String,
  description: String,
  rating: Number,
  available: Boolean,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cateogery'  // यामुळे populate() काम करतो
  },
  half_plate_discount: {
    type: Number,
    default: 0
  },
  full_plate_discount: {
    type: Number,
    default: 0
  },
});


module.exports = mongoose.model('MenuItem', menuItemSchema);
