import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A product must have a title']
  },
  description: {
    type: String,
    required: [true, 'A product must have a description']
  },
  stars: {
    type: String,
    required: [true, 'A product must have a star rating']
  },
  img: {
    type: String,
    required: [true, 'A product must have an image']
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
