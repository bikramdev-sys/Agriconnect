import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Farmer from '../models/Farmer.js';

dotenv.config();

const map = {
  'Ramesh Patel': '/avatars/ramesh-patel.jpg',
  'Rameshwar Patil': '/avatars/ramesh-patel.jpg',
  'Lakshmi Devi': '/avatars/lakshmi-devi.jpg',
  'Lakshmi Narayanan': '/avatars/lakshmi-devi.jpg',
  'Gurpreet Singh': '/avatars/gurpreet-singh.jpg',
  'Suresh Kumar': '/avatars/suresh-kumar.jpg',
  'Ananya Sharma': '/avatars/ananya-sharma.jpg'
};

async function run() {
  if (!process.env.MONGO_URI) {
    console.log('No MONGO_URI');
    process.exit(0);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    for (const [name, avatar] of Object.entries(map)) {
      const prodRes = await Product.updateMany(
        { farmerName: name },
        { $set: { farmerAvatar: avatar } }
      );
      if (prodRes.modifiedCount > 0) {
        console.log(`Updated ${prodRes.modifiedCount} products for ${name}`);
      }

      const farmRes = await Farmer.updateMany(
        { name: name },
        { $set: { avatar: avatar } }
      );
      if (farmRes.modifiedCount > 0) {
        console.log(`Updated ${farmRes.modifiedCount} farmers for ${name}`);
      }
    }

    console.log('MongoDB Atlas avatar sync complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.warn('MongoDB sync skipped (network/offline):', err.message);
    process.exit(0);
  }
}

run();

