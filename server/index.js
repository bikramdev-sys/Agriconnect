import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isMongoActive } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (Production & Local Development)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detailed Real-time Terminal Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusIcon = status < 300 ? '✅' : status < 400 ? '🔀' : status === 401 ? '🔒' : status === 403 ? '🚫' : '❌';
    console.log(`[${time}] ${statusIcon} ${req.method.padEnd(6)} ${req.originalUrl} -> HTTP ${status} (${duration}ms)`);
  });

  next();
});

// Root Server Ping (Ensures Render and uptime checkers detect service as healthy)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgriConnect REST API Server',
    environment: process.env.NODE_ENV || 'production',
    health: '/api/health',
    docs: '/api',
    timestamp: new Date().toISOString(),
  });
});

// Connect to Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: isMongoActive() ? 'MongoDB Connected' : 'Active Local Store',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root API welcome
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to AgriConnect Direct Agriculture REST API',
    endpoints: {
      auth: '/api/auth (Farmer & Buyer Auth)',
      admin: '/api/admin (Hidden Administrator Gateway)',
      products: '/api/products',
      orders: '/api/orders',
      farmers: '/api/farmers',
      contact: '/api/contact',
    },
  });
});

// 404 Handler for undefined API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: `API route not found: ${req.originalUrl}`,
    });
  }
  res.status(404).send('Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log('\n================================================================');
  console.log('🌾 AGRICONNECT BACKEND SERVER RUNNING WITH DETAILED LOGGING');
  console.log('================================================================');
  console.log(`📍 Port:             ${PORT}`);
  console.log(`🔗 API Base:         http://localhost:${PORT}/api`);
  console.log(`🛡️  Admin Portal:     http://localhost:${PORT}/api/admin/auth/login`);
  console.log(`👥 Public Auth:      http://localhost:${PORT}/api/auth/login`);
  console.log(`📂 Client Allowed:   ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`🔐 JWT Engine:       Non-expiring Secure Tokens Active`);
  console.log('----------------------------------------------------------------');
  console.log('📋 MOUNTED ROUTE DIRECTORY:');
  console.log('   POST /api/auth/login              -> Public Buyer/Farmer login');
  console.log('   POST /api/auth/register           -> Public Buyer/Farmer registration');
  console.log('   GET  /api/auth/me                 -> User session verification');
  console.log('   POST /api/admin/auth/login        -> Dedicated Hidden Admin login');
  console.log('   GET  /api/admin/stats             -> Platform analytics & GMV volume');
  console.log('   GET  /api/admin/users             -> Registered accounts management');
  console.log('   PUT  /api/admin/farmers/:id/verify-> Verify farmer profile');
  console.log('   GET  /api/products                -> Produce catalog with filters');
  console.log('   POST /api/products                -> Farmer adds produce listing');
  console.log('   GET  /api/orders                  -> Buyer/Farmer order status');
  console.log('   POST /api/orders                  -> Buyer checkout creation');
  console.log('   POST /api/contact                 -> Inquiries to farmers & platform');
  console.log('================================================================\n');
});
