import dataStore from '../storage/dataStore.js';

// @desc    Get orders (Admin: all, Farmer: theirs, Buyer: theirs)
// @route   GET /api/orders
// @access  Private
export async function getOrders(req, res) {
  try {
    const user = req.user;
    let filter = {};

    if (user.role === 'farmer') {
      filter = {
        $or: [
          { farmerId: user.id },
          { farmerName: user.name },
          { 'items.farmerId': user.id },
          { 'items.farmerName': user.name },
        ],
      };
    } else if (user.role === 'buyer') {
      filter = {
        $or: [
          { customerEmail: user.email.toLowerCase() },
          { customerId: user.id },
        ],
      };
    }
    // Admin has empty filter => gets all orders

    const orders = await dataStore.getOrders(filter);

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders.',
    });
  }
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (or Public guest checkout)
export async function createOrder(req, res) {
  try {
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      discount,
    } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Order items and shipping address are required.',
      });
    }

    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const deliveryFee = subtotal > 800 ? 0 : 70;
    const discountVal = Number(discount) || 0;
    const total = Math.max(0, subtotal + deliveryFee - discountVal);

    // Get farmer details from first item or default
    const firstItem = items[0] || {};
    const farmerId = firstItem.farmerId || 'farmer-1';
    const farmerName = firstItem.farmerName || 'Ramesh Patel';

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await dataStore.createOrder({
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      customerName: customerName || (req.user ? req.user.name : 'AgriConnect Buyer'),
      customerEmail: customerEmail || (req.user ? req.user.email : 'buyer@example.com'),
      customerPhone: customerPhone || (req.user ? req.user.phone : '+91 98765 43210'),
      shippingAddress,
      farmerId,
      farmerName,
      items,
      subtotal,
      deliveryFee,
      discount: discountVal,
      total,
      status: 'Pending',
      paymentMethod: paymentMethod || 'Direct Farm Pay (COD / UPI)',
    });

    return res.status(201).json({
      success: true,
      message: `Order #${orderId} confirmed successfully!`,
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order.',
    });
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer or Admin)
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Dispatched', 'Delivered', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await dataStore.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    return res.json({
      success: true,
      message: `Order #${id} status updated to: ${status}`,
      order: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
    });
  }
}

