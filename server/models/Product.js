import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    farmerId: {
      type: String,
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerAvatar: {
      type: String,
      default: '/avatars/ramesh-patel.jpg',
    },
    location: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: '',
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableQuantity: {
      type: Number,
      default: 50,
    },
    minOrderQty: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    harvestDate: {
      type: String,
      default: 'Freshly Harvested',
    },
    shelfLife: {
      type: String,
      default: '1-2 weeks',
    },
    description: {
      type: String,
      default: '',
    },
    nutrition: {
      type: Object,
      default: {},
    },
    featured: {
      type: Boolean,
      default: false,
    },
    todaysPick: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

