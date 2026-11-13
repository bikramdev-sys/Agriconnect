import dataStore from '../storage/dataStore.js';
import { generateToken } from '../middleware/auth.js';
import { sendFarmerRegistrationNotification } from '../services/emailService.js';

// @desc    Register a new Buyer or Farmer (Public)
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res) {
  try {
    const { name, email, password, role, phone, location, farmName, buyerType, bio, specialties, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // Disallow public registration as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Platform administrator accounts cannot be self-registered publicly.',
      });
    }

    const assignedRole = role === 'farmer' ? 'farmer' : 'buyer';
    const isFarmer = assignedRole === 'farmer';

    // Check if user already exists
    const existing = await dataStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Use uploaded custom avatar if provided, otherwise default to a personalized cartoon avatar
    const defaultCartoonAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    const finalAvatar = avatar && typeof avatar === 'string' && avatar.trim() ? avatar.trim() : defaultCartoonAvatar;

    console.log(`\n🔑 [PUBLIC AUTH] Registration attempt: ${email} as ${assignedRole.toUpperCase()}`);
    // Create user (Farmers default to verified: false until approved by Admin)
    const newUser = await dataStore.createUser({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      location: location || '',
      farmName: farmName || (isFarmer ? `${name}'s Organic Farm` : ''),
      buyerType: buyerType || 'Individual Customer',
      bio: bio || '',
      specialties: specialties || ['Vegetables'],
      avatar: finalAvatar,
      verified: isFarmer ? false : true, // Farmers require admin verification
    });

    // If farmer registered, send email alert to admin
    if (isFarmer) {
      sendFarmerRegistrationNotification({
        name,
        email,
        phone: phone || '',
        farmName: farmName || `${name}'s Organic Farm`,
        location: location || 'India',
        specialties: specialties || ['Vegetables'],
      }).catch((emailErr) => {
        console.error('Farmer registration email alert error:', emailErr.message);
      });
    }

    const token = generateToken(newUser);
    console.log(`   ✅ [PUBLIC AUTH] Registered new ${assignedRole.toUpperCase()}: ${newUser.name} (${newUser.email}) - Verified: ${newUser.verified}`);

    const safeUser = {
      id: newUser.id || newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      location: newUser.location,
      farmName: newUser.farmName,
      buyerType: newUser.buyerType,
      avatar: newUser.avatar,
      verified: Boolean(newUser.verified),
      bio: newUser.bio,
    };

    return res.status(201).json({
      success: true,
      message: isFarmer
        ? `Farmer profile created successfully! Your account is pending Administrator Verification. 🌾`
        : `Buyer account created successfully! 🛒`,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message,
    });
  }
}

// @desc    Public Login for Buyers and Farmers
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res) {
  try {
    const { email, password, requestedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    console.log(`\n🔑 [PUBLIC AUTH] Sign-in attempt: ${email} (requestedRole: ${requestedRole || 'default'})`);
    const user = await dataStore.findUserByEmail(email);
    if (!user) {
      console.log(`   ❌ [PUBLIC AUTH] Failed: No account found for "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    // Strict boundary: Admin accounts cannot sign in through public buyer/farmer login
    if (user.role === 'admin') {
      console.log(`   🚫 [PUBLIC AUTH BLOCKED] Admin user "${email}" attempted public /login. Redirected to /admin.`);
      return res.status(403).json({
        success: false,
        isAdminAccount: true,
        message: 'Administrative credentials detected. Administrators must log in through the secure admin gateway at /admin.',
      });
    }

    // Verify password
    const isMatch = await dataStore.verifyPassword(password, user);
    if (!isMatch) {
      console.log(`   ❌ [PUBLIC AUTH] Failed: Invalid password for "${email}"`);
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please check your credentials.',
      });
    }

    const token = generateToken(user);
    console.log(`   ✅ [PUBLIC AUTH] Authentication success: ${user.name} (${user.role.toUpperCase()})`);

    const safeUser = {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      farmName: user.farmName,
      buyerType: user.buyerType,
      avatar: user.avatar,
      verified: user.verified,
      bio: user.bio,
    };

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message,
    });
  }
}

// @desc    Get Current Logged In User
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
    });
  }
}

