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

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dataStore.findUserById(decoded.id);

    if (!user) {
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

// Require one of the specified roles
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
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

