import dataStore from '../storage/dataStore.js';

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
export async function getProducts(req, res) {
  try {
    const { category, farmerId, isOrganic, search } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }
    if (farmerId) {
      filter.farmerId = farmerId;
    }
    if (isOrganic !== undefined) {
      filter.isOrganic = isOrganic === 'true';
    }

    let products = await dataStore.getProducts(filter);

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve produce listings.',
    });
  }
}

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export async function getProductById(req, res) {
  try {
    const product = await dataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }
    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching product details.',
    });
  }
}

// @desc    Create new product listing
// @route   POST /api/products
// @access  Private (Farmer or Admin)
export async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      price,
      unit,
      availableQuantity,
      minOrderQty,
      isOrganic,
      image,
      images,
      harvestDate,
      shelfLife,
      description,
      nutrition,
      featured,
      todaysPick,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required.',
      });
    }

    const isFarmer = req.user.role === 'farmer';
    const farmerId = isFarmer ? req.user.id : req.body.farmerId || 'farmer-1';
    const farmerName = isFarmer ? req.user.name : req.body.farmerName || 'Ramesh Patel';
    const farmerAvatar = req.user.avatar || '/avatars/ramesh-patel.jpg';
    const location = req.user.location || req.body.location || 'Nashik, Maharashtra';

    const newProduct = await dataStore.createProduct({
      name,
      category: category || 'Vegetables',
      price: Number(price),
      unit: unit || 'kg',
      farmerId,
      farmerName,
      farmerAvatar,
      location,
      state: location.includes(',') ? location.split(',')[1]?.trim() : 'India',
      isOrganic: Boolean(isOrganic),
      isAvailable: Number(availableQuantity) > 0,
      availableQuantity: Number(availableQuantity) || 50,
      minOrderQty: Number(minOrderQty) || 1,
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      images: Array.isArray(images) && images.length ? images : [image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
      rating: 5.0,
      reviewsCount: 1,
      harvestDate: harvestDate || 'Freshly Harvested',
      shelfLife: shelfLife || '1-2 weeks',
      description: description || 'Fresh harvest direct from our local farm.',
      nutrition: nutrition || { calories: 'Natural produce', highlights: 'Chemical-free' },
      featured: Boolean(featured),
      todaysPick: Boolean(todaysPick),
    });

    return res.status(201).json({
      success: true,
      message: `Produce listing for "${newProduct.name}" created!`,
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product listing.',
    });
  }
}

// @desc    Update product listing
// @route   PUT /api/products/:id
// @access  Private (Owner Farmer or Admin)
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await dataStore.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Permission check: admin or owner farmer
    if (req.user.role !== 'admin' && existing.farmerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this harvest listing.',
      });
    }

    const updated = await dataStore.updateProduct(id, req.body);

    return res.json({
      success: true,
      message: 'Product listing updated successfully.',
      product: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update product listing.',
    });
  }
}

// @desc    Delete product listing
// @route   DELETE /api/products/:id
// @access  Private (Owner Farmer or Admin)
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = await dataStore.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (req.user.role !== 'admin' && existing.farmerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing.',
      });
    }

    await dataStore.deleteProduct(id);

    return res.json({
      success: true,
      message: 'Product listing deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product listing.',
    });
  }
}

