import dataStore from '../storage/dataStore.js';

// @desc    Get orders (Admin: all, Farmer: theirs, Buyer: theirs)
// @route   GET /api/orders
// @access  Private
export async function getOrders(req, res) {
  try {
    const user = req.user;
    let filter = {};

    if (user && user.role === 'farmer') {
      filter = {
        $or: [
          { farmerId: user.id },
          { farmerName: user.name },
          { 'items.farmerId': user.id },
          { 'items.farmerName': user.name },
        ],
      };
    } else if (user && user.role === 'buyer') {
      filter = {
        $or: [
          { customerEmail: user.email.toLowerCase() },
          { customerId: user.id },
        ],
      };
    }
    // Admin or public query: empty filter => gets all orders

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
      id,
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      discount,
      farmerId: reqFarmerId,
      farmerName: reqFarmerName,
      status: reqStatus,
      date: reqDate,
      total: reqTotal,
      subtotal: reqSubtotal,
      deliveryFee: reqDeliveryFee,
    } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Order items and shipping address are required.',
      });
    }

    const calculatedSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const subtotal = reqSubtotal !== undefined ? Number(reqSubtotal) : calculatedSubtotal;
    const deliveryFee = reqDeliveryFee !== undefined ? Number(reqDeliveryFee) : (subtotal > 800 ? 0 : 70);
    const discountVal = Number(discount) || 0;
    const total = reqTotal !== undefined ? Number(reqTotal) : Math.max(0, subtotal + deliveryFee - discountVal);

    // Get farmer details from first item or request
    const firstItem = items[0] || {};
    const farmerId = reqFarmerId || firstItem.farmerId || 'farmer-1';
    const farmerName = reqFarmerName || firstItem.farmerName || 'Ramesh Patel';

    // Preserve client order ID if provided so client and server share the exact same ID
    const orderId = id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await dataStore.createOrder({
      id: orderId,
      date: reqDate || new Date().toISOString().split('T')[0],
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
      status: reqStatus || 'Pending',
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
    const { status, order: fullOrder } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Dispatched', 'Delivered', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    let updated = await dataStore.updateOrderStatus(id, status);

    // If order was not found in dataStore but fullOrder is provided, upsert it!
    if (!updated && fullOrder) {
      updated = await dataStore.createOrder({
        ...fullOrder,
        id,
        status,
      });
    }

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
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status.',
    });
  }
}

