import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dataStore from '../storage/dataStore.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'agriconnect_super_secret_jwt_key_2026';

// Generate JWT token (non-expiring)
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET
  );
}

// Verify JWT token middleware
export async function verifyToken(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  // Pre-approved Admin tokens (offline / fallback / master clearances)
  if (token === 'demo-admin-token' || token === 'admin-token') {
    req.user = {
      id: 'admin-1',
      name: 'Bikram Dev',
      email: 'admin@agriconnect.org',
      role: 'admin',
      title: 'Platform Chief Administrator',
      location: 'National Agricultural Directorate, Pune',
      phone: '+91 99887 76655',
      permissions: ['all_access', 'farmer_verification', 'dispute_resolution', 'analytics', 'pricing_policy'],
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dataStore.findUserById(decoded.id);

    if (!user) {
      // Fallback for admin if ID was admin-1 or role admin
      if (decoded.id === 'admin-1' || decoded.role === 'admin') {
        req.user = {
          id: 'admin-1',
          name: decoded.name || 'Bikram Dev',
          email: decoded.email || 'admin@agriconnect.org',
          role: 'admin',
          permissions: ['all_access'],
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid token: User no longer exists.',
      });
    }

    // Attach user (without password) to request
    req.user = {
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
      permissions: user.permissions || [],
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Token is invalid or expired.',
      error: error.message,
    });
  }
}

// Optional token verification (e.g. for GET /api/orders)
export async function optionalVerifyToken(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  if (token === 'demo-admin-token' || token === 'admin-token') {
    req.user = {
      id: 'admin-1',
      name: 'Bikram Dev',
      email: 'admin@agriconnect.org',
      role: 'admin',
      permissions: ['all_access'],
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dataStore.findUserById(decoded.id);
    if (user) {
      req.user = {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } else if (decoded.role === 'admin' || decoded.id === 'admin-1') {
      req.user = {
        id: 'admin-1',
        name: decoded.name || 'Bikram Dev',
        email: decoded.email || 'admin@agriconnect.org',
        role: 'admin',
      };
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }
  next();
}

// Require one of the specified roles
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Platform administrator has master clearance across all roles
    if (req.user.role === 'admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Requires one of [${allowedRoles.join(', ')}] role. Current role: ${req.user.role}`,
      });
    }

    next();
  };
}

// Require Admin only
export const requireAdmin = requireRole('admin');

// Require Farmer only
export const requireFarmer = requireRole('farmer');

// Require Buyer only
export const requireBuyer = requireRole('buyer');

