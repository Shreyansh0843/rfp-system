const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const openaiService = require('../services/openaiService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Get all RFPs with pagination
exports.getAllRFPs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [rfps, total] = await Promise.all([
      RFP.find(query)
        .populate('vendors.vendor', 'name email company')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      RFP.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: rfps,
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

// Get single RFP by ID
exports.getRFPById = async (req, res, next) => {
  try {
    const rfp = await RFP.findById(req.params.id)
      .populate('vendors.vendor', 'name email company category');

    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: 'RFP not found'
      });
    }

    res.json({
      success: true,
      data: rfp
    });
  } catch (error) {
    next(error);
  }
};

// Create RFP (standard method)
exports.createRFP = async (req, res, next) => {
  try {
    const rfp = new RFP(req.body);
    await rfp.save();

    logger.info(`RFP created: ${rfp.title}`);

    res.status(201).json({
      success: true,
      data: rfp,
      message: 'RFP created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create RFP from natural language using AI
exports.createRFPFromNaturalLanguage = async (req, res, next) => {
  try {
    const { input, deadline } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Natural language input is required'
      });
    }

    // Parse the natural language input using OpenAI
    const parsedData = await openaiService.parseRFPFromText(input);

    // Create the RFP with parsed data
    const rfpData = {
      title: parsedData.title,
      description: parsedData.description,
      category: parsedData.category,
      budget: parsedData.budget,
      deadline: deadline || parsedData.suggestedDeadline,
      requirements: parsedData.requirements || [],
      evaluationCriteria: parsedData.evaluationCriteria || [],
      aiGeneratedContent: {
        summary: parsedData.summary,
        suggestedRequirements: parsedData.requirements?.map(r => r.title) || [],
        riskAnalysis: parsedData.riskFactors?.join('. ') || '',
        generatedAt: new Date()
      },
      status: 'draft'
    };

    const rfp = new RFP(rfpData);
    await rfp.save();

    logger.info(`AI-generated RFP created: ${rfp.title}`);

    res.status(201).json({
      success: true,
      data: rfp,
      aiSuggestions: {
        vendorCategories: parsedData.suggestedVendorCategories,
        riskFactors: parsedData.riskFactors
      },
      message: 'RFP created successfully from natural language'
    });
  } catch (error) {
    next(error);
  }
};

// Update RFP
exports.updateRFP = async (req, res, next) => {
  try {
    const rfp = await RFP.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: 'RFP not found'
      });
    }

    logger.info(`RFP updated: ${rfp.title}`);

    res.json({
      success: true,
      data: rfp,
      message: 'RFP updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete RFP
exports.deleteRFP = async (req, res, next) => {
  try {
    const rfp = await RFP.findByIdAndDelete(req.params.id);

    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: 'RFP not found'
      });
    }

    logger.info(`RFP deleted: ${rfp.title}`);

    res.json({
      success: true,
      message: 'RFP deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Send RFP to vendors via email
exports.sendRFPToVendors = async (req, res, next) => {
  try {
    const { vendorIds, customMessage } = req.body;
    const rfpId = req.params.id;

    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: 'RFP not found'
      });
    }

    const vendors = await Vendor.find({
      _id: { $in: vendorIds },
      status: 'active'
    });

    if (vendors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No active vendors found'
      });
    }

    const results = {
      sent: [],
      failed: []
    };

    // Send emails to each vendor
    for (const vendor of vendors) {
      try {
        await emailService.sendRFPInvitation(vendor, rfp, customMessage);
        
        // Update RFP vendor status
        const existingVendor = rfp.vendors.find(
          v => v.vendor?.toString() === vendor._id.toString()
        );
        
        if (existingVendor) {
          existingVendor.sentAt = new Date();
          existingVendor.status = 'sent';
        } else {
          rfp.vendors.push({
            vendor: vendor._id,
            sentAt: new Date(),
            status: 'sent'
          });
        }
        
        results.sent.push({ id: vendor._id, email: vendor.email });
      } catch (emailError) {
        results.failed.push({
          id: vendor._id,
          email: vendor.email,
          error: emailError.message
        });
      }
    }

    // Update RFP status if at least one email was sent
    if (results.sent.length > 0) {
      rfp.status = 'sent';
      await rfp.save();
    }

    logger.info(`RFP sent to ${results.sent.length} vendors`);

    res.json({
      success: true,
      data: results,
      message: `RFP sent to ${results.sent.length} vendor(s)${results.failed.length > 0 ? `, ${results.failed.length} failed` : ''}`
    });
  } catch (error) {
    next(error);
  }
};

// Get AI suggestions for RFP
exports.getAISuggestions = async (req, res, next) => {
  try {
    const { category, description } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        success: false,
        error: 'Category and description are required'
      });
    }

    const suggestions = await openaiService.generateRFPSuggestions(category, description);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

// Get RFP statistics
exports.getRFPStats = async (req, res, next) => {
  try {
    const [
      totalRFPs,
      statusStats,
      categoryStats,
      recentRFPs
    ] = await Promise.all([
      RFP.countDocuments(),
      RFP.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      RFP.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      RFP.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status deadline createdAt')
    ]);

    res.json({
      success: true,
      data: {
        total: totalRFPs,
        byStatus: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byCategory: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recent: recentRFPs
      }
    });
  } catch (error) {
    next(error);
  }
};
