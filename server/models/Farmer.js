import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    farmName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalProduce: {
      type: Number,
      default: 1,
    },
    experience: {
      type: String,
      default: '5+ years',
    },
    specialties: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Farmer = mongoose.model('Farmer', farmerSchema);
export default Farmer;

