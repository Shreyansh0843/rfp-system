const Vendor = require('../models/Vendor');
const logger = require('../utils/logger');

// Get all vendors with pagination and filtering
exports.getAllVendors = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Vendor.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: vendors,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single vendor by ID
exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Create new vendor
exports.createVendor = async (req, res, next) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    
    logger.info(`Vendor created: ${vendor.name}`);
    
    res.status(201).json({
      success: true,
      data: vendor,
      message: 'Vendor created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A vendor with this email already exists'
      });
    }
    next(error);
  }
};

// Update vendor
exports.updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    logger.info(`Vendor updated: ${vendor.name}`);

    res.json({
      success: true,
      data: vendor,
      message: 'Vendor updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete vendor
exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    logger.info(`Vendor deleted: ${vendor.name}`);

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get vendor statistics
exports.getVendorStats = async (req, res, next) => {
  try {
    const [
      totalVendors,
      activeVendors,
      categoryStats
    ] = await Promise.all([
      Vendor.countDocuments(),
      Vendor.countDocuments({ status: 'active' }),
      Vendor.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalVendors,
        active: activeVendors,
        inactive: totalVendors - activeVendors,
        byCategory: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};
