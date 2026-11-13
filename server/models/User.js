import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'farmer', 'admin'],
      default: 'buyer',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Farmer&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    },
    // Farmer specific fields
    farmName: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    specialties: {
      type: [String],
      default: ['Vegetables'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    // Buyer specific fields
    company: {
      type: String,
      default: '',
    },
    buyerType: {
      type: String,
      default: 'Individual Customer',
    },
    // Admin specific fields
    title: {
      type: String,
      default: 'Platform Administrator',
    },
    permissions: {
      type: [String],
      default: ['all_access'],
    },
  },
  {
    timestamps: true,
  }
);

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash password (Mongoose 8 async hook without next parameter)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;

