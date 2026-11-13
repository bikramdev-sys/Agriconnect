import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      default: '',
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    farmerId: {
      type: String,
      default: '',
    },
    farmerName: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Dispatched', 'Delivered', 'Rejected'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'Direct Farm Pay (UPI on Delivery)',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

