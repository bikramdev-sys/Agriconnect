import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { initialProducts } from '../data/products';
import { farmers as initialFarmers } from '../data/farmers';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const INITIAL_ORDERS = [];

export function CartProvider({ children }) {
  const { user } = useAuth();
  // Products list (supports farmer & admin CRUD)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Farmers list (supports admin verification & management)
  const [farmersList, setFarmersList] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_farmers');
      return saved ? JSON.parse(saved) : initialFarmers;
    } catch {
      return initialFarmers;
    }
  });

  // Cart items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorite product IDs
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_favorites');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  });

  // Orders list
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('agriconnect_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Platform Commission Policy (Admin configurable)
  const [platformSettings, setPlatformSettings] = useState({
    commissionRate: 0, // 0% by default (Fair direct trade)
    instantPayouts: true,
    inspectionRequired: false,
    bannerAnnouncement: '🌾 Direct Farm Trade Protocol: 0% Platform Commission active across all harvests.'
  });

  // Fetch fresh synchronized data from backend
  const refreshData = async () => {
    try {
      const prodRes = await api.products.getAll();
      if (Array.isArray(prodRes?.products)) {
        setProducts(prodRes.products);
      }
    } catch (e) {
      // use local
    }

    try {
      const farmRes = await api.farmers.getAll();
      if (Array.isArray(farmRes?.farmers)) {
        setFarmersList(farmRes.farmers);
      }
    } catch (e) {
      // use local
    }

    try {
      const setRes = await api.admin.getSettings();
      if (setRes?.settings) {
        setPlatformSettings(setRes.settings);
      }
    } catch (e) {
      // use local
    }

    try {
      const ordRes = await api.orders.getAll();
      if (Array.isArray(ordRes?.orders)) {
        setOrders(ordRes.orders);
      }
    } catch (e) {
      // use local
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('agriconnect_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('agriconnect_farmers', JSON.stringify(farmersList));
  }, [farmersList]);

  useEffect(() => {
    if (user?.role === 'admin') {
      localStorage.removeItem('agriconnect_cart');
    } else {
      localStorage.setItem('agriconnect_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    localStorage.setItem('agriconnect_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('agriconnect_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle logout and user switches
  const prevUserEmailRef = useRef(user?.email);

  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
      localStorage.removeItem('agriconnect_cart');
    };
    window.addEventListener('agriconnect_logout', handleLogout);
    return () => window.removeEventListener('agriconnect_logout', handleLogout);
  }, []);

  useEffect(() => {
    // If user logged out or changed account
    if (prevUserEmailRef.current && (!user || user.email !== prevUserEmailRef.current)) {
      setCartItems([]);
      localStorage.removeItem('agriconnect_cart');
    }
    // If current logged-in user is an administrator, ensure cart is always empty
    if (user?.role === 'admin') {
      setCartItems([]);
      localStorage.removeItem('agriconnect_cart');
    }
    prevUserEmailRef.current = user?.email;
  }, [user]);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    // Guard: Administrators cannot add to cart
    if (user?.role === 'admin') {
      toast.error('Platform Administrators cannot add produce to cart or make purchases.', {
        icon: '🛡️',
        duration: 4000
      });
      return false;
    }

    const existing = cartItems.find((item) => item.id === product.id);
    const currentQtyInCart = existing ? existing.quantity : 0;
    const targetQty = currentQtyInCart + quantity;

    if (targetQty > product.availableQuantity) {
      toast.error(`Only ${product.availableQuantity} ${product.unit} available from this farm!`);
      return false;
    }

    setCartItems((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: product.unit,
          image: product.image,
          farmerId: product.farmerId,
          farmerName: product.farmerName,
          location: product.location,
          isOrganic: product.isOrganic,
          availableQuantity: product.availableQuantity,
          quantity: quantity
        }
      ];
    });

    toast.success(`Added ${quantity} ${product.unit} of ${product.name} to cart!`);
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);
    const maxQty = product ? product.availableQuantity : 999;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > maxQty) {
      toast.error(`Maximum available harvest stock is ${maxQty}!`);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
    if (item) {
      toast(`${item.name} removed from cart.`, { icon: '🗑️' });
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Favorites operations
  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        toast('Removed from saved produce.', { icon: '🤍' });
        return prev.filter((id) => id !== productId);
      } else {
        toast('Added to favorite produce! 🌱', { icon: '💚' });
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? (subtotal > 800 ? 0 : 70) : 0;
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Create Order
  const createOrder = (orderDetails) => {
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const firstItem = cartItems[0] || {};
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString().split('T')[0],
      customerName: orderDetails.customerName || 'AgriConnect Buyer',
      customerEmail: orderDetails.customerEmail || 'buyer@example.com',
      customerPhone: orderDetails.customerPhone || '+91 98765 43210',
      shippingAddress: orderDetails.address || 'Standard Delivery Address',
      farmerId: orderDetails.farmerId || firstItem.farmerId || '',
      farmerName: orderDetails.farmerName || firstItem.farmerName || '',
      items: [...cartItems],
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: orderDetails.discount || 0,
      total: Math.max(0, subtotal + deliveryFee - (orderDetails.discount || 0)),
      status: 'Pending',
      paymentMethod: orderDetails.paymentMethod || 'Direct Farm Pay (COD / UPI)'
    };

    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cartItems.find((item) => item.id === prod.id);
        if (cartItem) {
          const remaining = Math.max(0, prod.availableQuantity - cartItem.quantity);
          return {
            ...prod,
            availableQuantity: remaining,
            isAvailable: remaining > 0
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to backend database
    api.orders.create(newOrder).catch((err) => {
      console.warn('Backend order sync:', err.message);
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#14532D', '#FACC15', '#4ADE80']
      });
    } catch {
      // ignore
    }

    toast.success(`Order #${newOrderId} placed successfully!`);
    return newOrder;
  };

  // Order status actions (accessible by farmer and admin)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      )
    );
    api.orders.updateStatus(orderId, newStatus).catch(() => {});
    toast.success(`Order ${orderId} status set to: ${newStatus}`);
  };

  // Farmer / Admin Product CRUD
  const addProduct = (newProdData) => {
    const newId = `prod-${Date.now()}`;
    const newProduct = {
      id: newId,
      name: newProdData.name,
      category: newProdData.category || 'Vegetables',
      price: Number(newProdData.price) || 30,
      unit: newProdData.unit || 'kg',
      farmerId: newProdData.farmerId || 'farmer-1',
      farmerName: newProdData.farmerName || 'Ramesh Patel',
      farmerAvatar: newProdData.farmerAvatar || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=150&q=80',
      location: newProdData.location || 'Nashik, Maharashtra',
      state: newProdData.state || 'Maharashtra',
      isOrganic: Boolean(newProdData.isOrganic),
      isAvailable: Number(newProdData.availableQuantity) > 0,
      availableQuantity: Number(newProdData.availableQuantity) || 50,
      minOrderQty: Number(newProdData.minOrderQty) || 1,
      image: newProdData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      images: [newProdData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
      rating: 5.0,
      reviewsCount: 1,
      harvestDate: newProdData.harvestDate || 'Freshly Harvested',
      shelfLife: newProdData.shelfLife || '1-2 weeks',
      description: newProdData.description || 'Freshly harvested produce directly from the farm.',
      nutrition: {
        calories: 'Natural produce',
        highlights: 'Chemical-free soil'
      },
      featured: Boolean(newProdData.featured),
      todaysPick: Boolean(newProdData.todaysPick)
    };

    setProducts((prev) => [newProduct, ...prev]);
    api.products.create(newProduct).catch(() => {});
    toast.success(`Listing for "${newProduct.name}" created!`);
    return newProduct;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === productId) {
          const updated = { ...prod, ...updatedFields };
          if (updatedFields.availableQuantity !== undefined) {
            updated.availableQuantity = Number(updatedFields.availableQuantity);
            updated.isAvailable = updated.availableQuantity > 0;
          }
          if (updatedFields.price !== undefined) {
            updated.price = Number(updatedFields.price);
          }
          return updated;
        }
        return prod;
      })
    );
    api.products.update(productId, updatedFields).catch(() => {});
    toast.success('Produce listing updated successfully.');
  };

  const deleteProduct = (productId) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    api.products.delete(productId).catch(() => {});
    toast(`${prod ? prod.name : 'Product'} listing deleted.`, { icon: '🗑️' });
  };

  // ADMIN SPECIFIC OPERATIONS
  const toggleProductFeatured = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = !p.featured;
          toast.success(`${p.name} is now ${updated ? 'Featured on Homepage 🌟' : 'Unfeatured'}`);
          api.products.update(productId, { featured: updated }).catch(() => {});
          return { ...p, featured: updated };
        }
        return p;
      })
    );
  };

  const toggleProductTodaysPick = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = !p.todaysPick;
          toast.success(`${p.name} set as ${updated ? "Today's Fresh Pick 🔥" : 'Standard Listing'}`);
          api.products.update(productId, { todaysPick: updated }).catch(() => {});
          return { ...p, todaysPick: updated };
        }
        return { ...p, todaysPick: false }; // Only 1 can be Today's Pick
      })
    );
  };

  const toggleFarmerVerification = (farmerId) => {
    setFarmersList((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          const nextState = !f.verified;
          toast.success(`Farmer "${f.name}" verification set to: ${nextState ? 'VERIFIED ✓' : 'UNVERIFIED ⚠️'}`);
          return { ...f, verified: nextState };
        }
        return f;
      })
    );
    api.admin.toggleFarmerVerification(farmerId).catch(() => {});
  };

  const deleteFarmer = (farmerId) => {
    const f = farmersList.find((item) => item.id === farmerId);
    setFarmersList((prev) => prev.filter((item) => item.id !== farmerId));
    api.admin.deleteFarmer(farmerId).catch(() => {});
    toast.success(`Farmer profile for "${f?.name || farmerId}" removed from directory.`);
  };

  const updatePlatformSettings = (newSettings) => {
    setPlatformSettings((prev) => ({ ...prev, ...newSettings }));
    api.admin.updateSettings(newSettings).catch(() => {});
    toast.success('Platform administrative policies updated.');
  };

  return (
    <CartContext.Provider
      value={{
        products,
        farmersList,
        cartItems,
        favorites,
        orders,
        platformSettings,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        subtotal,
        deliveryFee,
        totalCount,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        // Admin powers
        toggleProductFeatured,
        toggleProductTodaysPick,
        toggleFarmerVerification,
        deleteFarmer,
        updatePlatformSettings,
        refreshData
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
