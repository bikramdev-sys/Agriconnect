import dataStore from '../storage/dataStore.js';
import { generateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

// @desc    Dedicated Hidden Admin Login
// @route   POST /api/admin/auth/login
// @access  Public (Hidden Gateway)
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log(`\n🛡️  [HIDDEN ADMIN GATEWAY] Admin authentication attempt for: ${email}`);

    if (!email || !password) {
      console.log('   ❌ [ADMIN GATEWAY] Missing email or password.');
      return res.status(400).json({
        success: false,
        message: 'Admin email and master password are required.',
      });
    }

    const user = await dataStore.findUserByEmail(email);

    if (!user) {
      console.log(`   ❌ [ADMIN GATEWAY] Admin account not found for "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Administrative profile not found.',
      });
    }

    // Role check: ONLY administrators are permitted through this endpoint
    if (user.role !== 'admin') {
      console.log(`   🚫 [ADMIN GATEWAY BLOCKED] Access Denied: User "${email}" has role "${user.role}", not "admin"!`);
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This portal is strictly restricted to platform administrators. Buyers and farmers must use /login.',
      });
    }

    // Verify password
    const isMatch = await dataStore.verifyPassword(password, user);
    if (!isMatch) {
      console.log(`   ❌ [ADMIN GATEWAY] Password mismatch for "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Invalid administrator password.',
      });
    }

    const token = generateToken(user);
    console.log(`   ✅ [ADMIN GATEWAY CLEARANCE GRANTED] Welcome Chief Administrator: ${user.name} (${user.email})`);

    const safeAdmin = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: 'admin',
      title: user.title || 'Platform Chief Administrator',
      location: user.location,
      phone: user.phone,
      avatar: user.avatar,
      permissions: user.permissions || ['all_access'],
    };

    return res.json({
      success: true,
      message: 'Administrative clearance granted. Welcome, Administrator.',
      token,
      user: safeAdmin,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during administrative authentication.',
    });
  }
}

// @desc    Get Platform Administration Metrics
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
export async function getStats(req, res) {
  try {
    const orders = await dataStore.getOrders();
    const farmers = await dataStore.getFarmers();
    const products = await dataStore.getProducts();
    const users = await dataStore.getAllUsers();

    const totalOrders = orders.length;
    const totalVolume = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const verifiedFarmers = farmers.filter((f) => f.verified).length;
    const inStockProducts = products.filter((p) => p.availableQuantity > 0).length;

    return res.json({
      success: true,
      stats: {
        totalOrders,
        totalVolume,
        totalFarmers: farmers.length,
        verifiedFarmers,
        totalProducts: products.length,
        inStockProducts,
        totalUsers: users.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative statistics.',
    });
  }
}

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private (Admin Only)
export async function getAllUsers(req, res) {
  try {
    const users = await dataStore.getAllUsers();
    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch platform users.',
    });
  }
}

// @desc    Toggle Farmer Verification
// @route   PUT /api/admin/farmers/:id/verify
// @access  Private (Admin Only)
export async function toggleFarmerVerification(req, res) {
  try {
    const { id } = req.params;
    const updated = await dataStore.toggleFarmerVerification(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Farmer not found.' });
    }
    return res.json({
      success: true,
      message: `Farmer verification updated to: ${updated.verified ? 'Verified ✅' : 'Pending ⏳'}`,
      farmer: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update farmer verification.' });
  }
}

// @desc    Delete Farmer
// @route   DELETE /api/admin/farmers/:id
// @access  Private (Admin Only)
export async function deleteFarmer(req, res) {
  try {
    const { id } = req.params;
    await dataStore.deleteFarmer(id);
    return res.json({
      success: true,
      message: 'Farmer removed from directory.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete farmer.' });
  }
}

// @desc    Get Platform Settings
// @route   GET /api/admin/settings
// @access  Public / Private
export async function getSettings(req, res) {
  try {
    const settings = await dataStore.getSettings();
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load settings.' });
  }
}

// @desc    Update Platform Settings
// @route   PUT /api/admin/settings
// @access  Private (Admin Only)
export async function updateSettings(req, res) {
  try {
    const updated = await dataStore.updateSettings(req.body);
    return res.json({
      success: true,
      message: 'Platform settings updated successfully.',
      settings: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
}

