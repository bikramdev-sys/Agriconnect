import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { isMongoActive } from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Farmer from '../models/Farmer.js';
import Setting from '../models/Setting.js';
import Contact from '../models/Contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT_SETTINGS = {
  commissionRate: 0,
  instantPayouts: true,
  inspectionRequired: false,
  bannerAnnouncement: '🌾 Direct Farm Trade Protocol: 0% Platform Commission active across all harvests.',
};

// Ensure db.json exists
function initLocalStore() {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const emptyData = {
      users: [],
      farmers: [],
      products: [],
      orders: [],
      settings: DEFAULT_SETTINGS,
      contacts: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(emptyData, null, 2), 'utf8');
  }
}

function readLocalData() {
  try {
    initLocalStore();
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db.json:', err);
    return { users: [], farmers: [], products: [], orders: [], settings: DEFAULT_SETTINGS, contacts: [] };
  }
}

function writeLocalData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local db.json:', err);
  }
}

// Data Store object providing uniform API for Controllers
export const dataStore = {
  // USER METHODS
  async findUserByEmail(email) {
    const lowerEmail = email.toLowerCase().trim();
    if (isMongoActive()) {
      return await User.findOne({ email: lowerEmail });
    }
    const data = readLocalData();
    return data.users.find((u) => u.email.toLowerCase() === lowerEmail) || null;
  },

  async findUserById(id) {
    if (isMongoActive()) {
      try {
        let user = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
          user = await User.findById(id);
        }
        if (!user) {
          user = await User.findOne({ id });
        }
        return user;
      } catch {
        return null;
      }
    }
    const data = readLocalData();
    return data.users.find((u) => u.id === id || u._id === id) || null;
  },

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const isFarmer = userData.role === 'farmer';
    const isVerified = isFarmer ? false : Boolean(userData.verified !== undefined ? userData.verified : true);

    if (isMongoActive()) {
      const user = new User({
        ...userData,
        password: userData.password,
        verified: isVerified,
      });
      const savedUser = await user.save();

      // If registered as a farmer, also upsert corresponding Farmer record in MongoDB
      if (isFarmer) {
        const farmerId = savedUser._id.toString();
        await Farmer.findOneAndUpdate(
          { $or: [{ id: farmerId }, { email: savedUser.email }] },
          {
            id: farmerId,
            name: savedUser.name,
            email: savedUser.email,
            farmName: savedUser.farmName || `${savedUser.name}'s Organic Farm`,
            location: savedUser.location || 'India',
            phone: savedUser.phone || '',
            avatar: savedUser.avatar,
            verified: false, // Requires Admin Verification
            rating: 5.0,
            totalProduce: 0,
            experience: '1+ years',
            specialties: savedUser.specialties || ['Vegetables'],
          },
          { upsert: true, new: true }
        );
      }

      return savedUser;
    }

    const data = readLocalData();
    const newUser = {
      id: userData.id || `user-${Date.now()}`,
      _id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      role: userData.role || 'buyer',
      phone: userData.phone || '',
      location: userData.location || '',
      farmName: userData.farmName || '',
      buyerType: userData.buyerType || 'Individual Customer',
      avatar: userData.avatar || (isFarmer ? '/avatars/ramesh-patel.jpg' : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userData.name || 'User')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`),
      verified: isVerified,
      bio: userData.bio || '',
      specialties: userData.specialties || ['Vegetables'],
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);

    if (isFarmer) {
      const newFarmer = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        farmName: newUser.farmName || `${newUser.name}'s Farm`,
        location: newUser.location || 'India',
        state: newUser.location ? newUser.location.split(',')[1]?.trim() || '' : '',
        avatar: newUser.avatar,
        coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviewsCount: 1,
        experienceYears: 1,
        specialties: newUser.specialties,
        bio: newUser.bio || 'Sustainable farmer on AgriConnect.',
        verified: false, // PENDING ADMIN VERIFICATION
        totalHarvestsSold: '0 kg',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        phone: newUser.phone,
      };
      data.farmers.push(newFarmer);
    }

    writeLocalData(data);
    return newUser;
  },

  async verifyPassword(enteredPassword, user) {
    if (isMongoActive()) {
      return await user.matchPassword(enteredPassword);
    }
    return await bcrypt.compare(enteredPassword, user.password);
  },

  async getAllUsers() {
    if (isMongoActive()) {
      return await User.find({}, '-password');
    }
    const data = readLocalData();
    return data.users.map(({ password: _, ...u }) => u);
  },

  // PRODUCT METHODS
  async getProducts(filter = {}) {
    if (isMongoActive()) {
      return await Product.find(filter).sort({ createdAt: -1 });
    }
    const data = readLocalData();
    let list = [...data.products];

    if (filter.category && filter.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.farmerId) {
      list = list.filter((p) => p.farmerId === filter.farmerId);
    }
    if (filter.isOrganic !== undefined) {
      list = list.filter((p) => p.isOrganic === Boolean(filter.isOrganic));
    }
    return list;
  },

  async getProductById(id) {
    if (isMongoActive()) {
      return await Product.findOne({ id }) || await Product.findById(id).catch(() => null);
    }
    const data = readLocalData();
    return data.products.find((p) => p.id === id || p._id === id) || null;
  },

  async createProduct(productData) {
    const id = productData.id || `prod-${Date.now()}`;
    if (isMongoActive()) {
      const prod = new Product({ ...productData, id });
      return await prod.save();
    }
    const data = readLocalData();
    const newProd = {
      id,
      ...productData,
      createdAt: new Date().toISOString(),
    };
    data.products.unshift(newProd);
    writeLocalData(data);
    return newProd;
  },

  async updateProduct(id, updates) {
    if (isMongoActive()) {
      return await Product.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        updates,
        { new: true }
      );
    }
    const data = readLocalData();
    const index = data.products.findIndex((p) => p.id === id || p._id === id);
    if (index === -1) return null;

    data.products[index] = { ...data.products[index], ...updates };
    writeLocalData(data);
    return data.products[index];
  },

  async deleteProduct(id) {
    if (isMongoActive()) {
      return await Product.findOneAndDelete({ $or: [{ id }, { _id: id }] });
    }
    const data = readLocalData();
    const initialLen = data.products.length;
    data.products = data.products.filter((p) => p.id !== id && p._id !== id);
    writeLocalData(data);
    return data.products.length < initialLen;
  },

  // ORDER METHODS
  async getOrders(filter = {}) {
    if (isMongoActive()) {
      return await Order.find(filter).sort({ createdAt: -1 });
    }
    const data = readLocalData();
    let list = [...data.orders];

    if (filter.$or) {
      list = list.filter((o) => {
        return filter.$or.some((clause) => {
          if (clause.farmerId && o.farmerId === clause.farmerId) return true;
          if (clause.farmerName && o.farmerName && o.farmerName.toLowerCase() === clause.farmerName.toLowerCase()) return true;
          if (clause['items.farmerId'] && Array.isArray(o.items) && o.items.some((i) => i.farmerId === clause['items.farmerId'])) return true;
          if (clause['items.farmerName'] && Array.isArray(o.items) && o.items.some((i) => i.farmerName && i.farmerName.toLowerCase() === clause['items.farmerName'].toLowerCase())) return true;
          if (clause.customerEmail && o.customerEmail && o.customerEmail.toLowerCase() === clause.customerEmail.toLowerCase()) return true;
          if (clause.customerId && o.customerId === clause.customerId) return true;
          return false;
        });
      });
    } else {
      if (filter.farmerId) {
        list = list.filter((o) => o.farmerId === filter.farmerId);
      }
      if (filter.customerEmail) {
        list = list.filter((o) => o.customerEmail && o.customerEmail.toLowerCase() === filter.customerEmail.toLowerCase());
      }
    }
    return list;
  },

  async createOrder(orderData) {
    const id = orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    if (isMongoActive()) {
      let existingOrd = await Order.findOne({ $or: [{ id }, { _id: id }] });
      if (existingOrd) {
        Object.assign(existingOrd, orderData);
        return await existingOrd.save();
      }

      const ord = new Order({ ...orderData, id });
      const savedOrd = await ord.save();

      // Deduct stock in MongoDB Product collection
      if (Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          const prod = await Product.findOne({ $or: [{ id: item.id }, { _id: item.id }] });
          if (prod) {
            prod.availableQuantity = Math.max(0, (prod.availableQuantity || 0) - (Number(item.quantity) || 1));
            prod.isAvailable = prod.availableQuantity > 0;
            await prod.save();
          }
        }
      }

      return savedOrd;
    }
    const data = readLocalData();
    const existingIdx = data.orders.findIndex((o) => o.id === id || o._id === id);
    if (existingIdx !== -1) {
      data.orders[existingIdx] = { ...data.orders[existingIdx], ...orderData };
      writeLocalData(data);
      return data.orders[existingIdx];
    }

    const newOrd = {
      id,
      ...orderData,
      date: orderData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    data.orders.unshift(newOrd);

    // Update quantities of products
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach((item) => {
        const prod = data.products.find((p) => p.id === item.id || p._id === item.id);
        if (prod) {
          prod.availableQuantity = Math.max(0, (Number(prod.availableQuantity) || 0) - (Number(item.quantity) || 1));
          prod.isAvailable = prod.availableQuantity > 0;
        }
      });
    }

    writeLocalData(data);
    return newOrd;
  },

  async updateOrderStatus(id, status) {
    if (isMongoActive()) {
      const existing = await Order.findOne({ $or: [{ id }, { _id: id }] });
      const oldStatus = existing ? existing.status : null;
      const updated = await Order.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        { status },
        { new: true }
      );

      // If rejected, restore stock in MongoDB Product collection
      if (status === 'Rejected' && oldStatus !== 'Rejected' && existing && Array.isArray(existing.items)) {
        for (const item of existing.items) {
          const prod = await Product.findOne({ $or: [{ id: item.id }, { _id: item.id }] });
          if (prod) {
            prod.availableQuantity = (Number(prod.availableQuantity) || 0) + (Number(item.quantity) || 1);
            prod.isAvailable = true;
            await prod.save();
          }
        }
      }

      return updated;
    }
    const data = readLocalData();
    const index = data.orders.findIndex((o) => o.id === id || o._id === id);
    if (index === -1) return null;

    const oldStatus = data.orders[index].status;
    data.orders[index].status = status;

    // If rejected, restore stock in db.json
    if (status === 'Rejected' && oldStatus !== 'Rejected' && Array.isArray(data.orders[index].items)) {
      data.orders[index].items.forEach((item) => {
        const prod = data.products.find((p) => p.id === item.id || p._id === item.id);
        if (prod) {
          prod.availableQuantity = (Number(prod.availableQuantity) || 0) + (Number(item.quantity) || 1);
          prod.isAvailable = true;
        }
      });
    }

    writeLocalData(data);
    return data.orders[index];
  },

  // FARMERS DIRECTORY METHODS
  async getFarmers() {
    if (isMongoActive()) {
      const farmers = await Farmer.find().lean();
      const farmerUsers = await User.find({ role: 'farmer' }).lean();

      const farmerEmails = new Set(farmers.map((f) => (f.email || '').toLowerCase()));

      // Incorporate any farmer registered as a User that might not be in Farmer collection yet
      for (const u of farmerUsers) {
        if (!farmerEmails.has((u.email || '').toLowerCase())) {
          farmers.push({
            id: u._id.toString(),
            _id: u._id,
            name: u.name,
            email: u.email,
            farmName: u.farmName || `${u.name}'s Organic Farm`,
            location: u.location || 'India',
            phone: u.phone || '',
            avatar: u.avatar || '/avatars/ramesh-patel.jpg',
            verified: Boolean(u.verified),
            rating: 5.0,
            totalProduce: 0,
            experience: '1+ years',
            specialties: u.specialties || ['Vegetables'],
            createdAt: u.createdAt,
          });
        }
      }

      return farmers;
    }
    const data = readLocalData();
    return data.farmers;
  },

  async toggleFarmerVerification(id) {
    if (isMongoActive()) {
      let farmer = await Farmer.findOne({ $or: [{ id }, { _id: id }] });
      if (farmer) {
        farmer.verified = !farmer.verified;
        await farmer.save();
        // Keep User collection strictly synchronized
        await User.updateMany(
          { $or: [{ _id: id }, { email: farmer.email }] },
          { $set: { verified: farmer.verified } }
        );
        return farmer;
      }

      // If registered under User collection
      const user = await User.findOne({ $or: [{ _id: id }, { id }] });
      if (user && user.role === 'farmer') {
        user.verified = !user.verified;
        await user.save();

        const farmerDoc = await Farmer.findOneAndUpdate(
          { $or: [{ id: user._id.toString() }, { email: user.email }] },
          {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            farmName: user.farmName || `${user.name}'s Organic Farm`,
            location: user.location || 'India',
            phone: user.phone || '',
            avatar: user.avatar,
            verified: user.verified,
            specialties: user.specialties || ['Vegetables'],
          },
          { upsert: true, new: true }
        );
        return farmerDoc;
      }
      return null;
    }
    const data = readLocalData();
    const farmer = data.farmers.find((f) => f.id === id);
    if (!farmer) return null;
    farmer.verified = !farmer.verified;
    const u = data.users.find((u) => u.id === id || u.email === farmer.email);
    if (u) u.verified = farmer.verified;
    writeLocalData(data);
    return farmer;
  },

  async deleteFarmer(id) {
    if (isMongoActive()) {
      const f = await Farmer.findOneAndDelete({ $or: [{ id }, { _id: id }] });
      if (f?.email) {
        await User.findOneAndDelete({ email: f.email });
      } else {
        await User.findOneAndDelete({ $or: [{ _id: id }, { id }] });
      }
      return true;
    }
    const data = readLocalData();
    const removedFarmer = data.farmers.find((f) => f.id === id);
    data.farmers = data.farmers.filter((f) => f.id !== id);
    if (removedFarmer?.email) {
      data.users = data.users.filter((u) => u.email !== removedFarmer.email);
    }
    writeLocalData(data);
    return true;
  },

  // SETTINGS METHODS
  async getSettings() {
    if (isMongoActive()) {
      let s = await Setting.findOne();
      if (!s) {
        s = await Setting.create(DEFAULT_SETTINGS);
      }
      return s;
    }
    const data = readLocalData();
    return data.settings || DEFAULT_SETTINGS;
  },

  async updateSettings(newSettings) {
    if (isMongoActive()) {
      let s = await Setting.findOne();
      if (!s) {
        return await Setting.create(newSettings);
      }
      Object.assign(s, newSettings);
      return await s.save();
    }
    const data = readLocalData();
    data.settings = { ...data.settings, ...newSettings };
    writeLocalData(data);
    return data.settings;
  },

  // CONTACT INQUIRIES
  async createContact(contactData) {
    if (isMongoActive()) {
      const c = new Contact(contactData);
      return await c.save();
    }
    const data = readLocalData();
    const newContact = {
      id: `cnt-${Date.now()}`,
      ...contactData,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    data.contacts.push(newContact);
    writeLocalData(data);
    return newContact;
  },

  async getContacts() {
    if (isMongoActive()) {
      return await Contact.find().sort({ createdAt: -1 });
    }
    const data = readLocalData();
    return data.contacts || [];
  },

  async updateContactStatus(id, status) {
    if (isMongoActive()) {
      return await Contact.findOneAndUpdate(
        { $or: [{ _id: id }, { id }] },
        { status },
        { new: true }
      );
    }
    const data = readLocalData();
    const contact = (data.contacts || []).find((c) => c.id === id || c._id === id);
    if (contact) {
      contact.status = status;
      writeLocalData(data);
    }
    return contact || null;
  },

  async deleteContact(id) {
    if (isMongoActive()) {
      return await Contact.findOneAndDelete({ $or: [{ _id: id }, { id }] });
    }
    const data = readLocalData();
    data.contacts = (data.contacts || []).filter((c) => c.id !== id && c._id !== id);
    writeLocalData(data);
    return true;
  },
};

export default dataStore;
