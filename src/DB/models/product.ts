import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  creationDate: Number,
  link: {
    type: String,
    required: [true, 'A product must have a link'],
    unique: [true, 'A product must be unique']
  },
  searchterm: {
    type: String,
    required: [true, 'A product must have a searchterm']
  },
  title: {
    type: String,
    required: [true, 'A product must have a title'],
    unique: [true, 'A product must be unique']
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  ratingStars: {
    type: String
  },
  ratingCount: {
    type: Number
  },
  featureBullets: {
    type: Array
  },
  technicalDetails: {
    type: Map
  },
  description: {
    type: String
  },

  imgs: [
    {
      mediumImgs: Array,
      largeImgs: Array
    }
  ]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
