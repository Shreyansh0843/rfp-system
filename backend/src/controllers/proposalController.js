const Proposal = require('../models/Proposal');
const RFP = require('../models/RFP');
const Vendor = require('../models/Vendor');
const openaiService = require('../services/openaiService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Get all proposals with filtering
exports.getAllProposals = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      rfpId,
      vendorId,
      status,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (rfpId) query.rfp = rfpId;
    if (vendorId) query.vendor = vendorId;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate('rfp', 'title deadline status')
        .populate('vendor', 'name email company')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Proposal.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: proposals,
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

// Get proposals for a specific RFP
exports.getProposalsByRFP = async (req, res, next) => {
  try {
    const { rfpId } = req.params;

    const proposals = await Proposal.find({ rfp: rfpId })
      .populate('vendor', 'name email company category rating')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: proposals
    });
  } catch (error) {
    next(error);
  }
};

// Get single proposal by ID
exports.getProposalById = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('rfp')
      .populate('vendor', 'name email company phone category');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    next(error);
  }
};

// Create/Submit new proposal
exports.createProposal = async (req, res, next) => {
  try {
    const { rfpId, vendorId, ...proposalData } = req.body;

    // Verify RFP exists and is accepting proposals
    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: 'RFP not found'
      });
    }

    if (rfp.status === 'closed' || rfp.status === 'awarded') {
      return res.status(400).json({
        success: false,
        error: 'This RFP is no longer accepting proposals'
      });
    }

    // Verify vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    // Check if vendor already submitted a proposal
    const existingProposal = await Proposal.findOne({
      rfp: rfpId,
      vendor: vendorId
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        error: 'Vendor has already submitted a proposal for this RFP'
      });
    }

    const proposal = new Proposal({
      rfp: rfpId,
      vendor: vendorId,
      ...proposalData,
      submittedAt: new Date()
    });

    await proposal.save();

    // Update RFP vendor status
    const vendorEntry = rfp.vendors.find(
      v => v.vendor?.toString() === vendorId
    );
    if (vendorEntry) {
      vendorEntry.status = 'responded';
    }
    await rfp.save();

    // Send confirmation email
    try {
      await emailService.sendProposalConfirmation(vendor, rfp, proposal);
    } catch (emailError) {
      logger.error(`Failed to send confirmation email: ${emailError.message}`);
    }

    logger.info(`Proposal submitted by ${vendor.name} for RFP: ${rfp.title}`);

    res.status(201).json({
      success: true,
      data: proposal,
      message: 'Proposal submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update proposal
exports.updateProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    logger.info(`Proposal updated: ${proposal._id}`);

    res.json({
      success: true,
      data: proposal,
      message: 'Proposal updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete proposal
exports.deleteProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    logger.info(`Proposal deleted: ${proposal._id}`);

    res.json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Analyze single proposal using AI
exports.analyzeProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('rfp')
      .populate('vendor');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    const analysis = await openaiService.analyzeProposal(
      proposal,
      proposal.rfp?.requirements || []
    );

    // Update proposal with AI analysis
    proposal.aiAnalysis = {
      ...analysis,
      analyzedAt: new Date()
    };
    proposal.scores = analysis.scores;
    await proposal.save();

    logger.info(`Proposal analyzed: ${proposal._id}`);

    res.json({
      success: true,
      data: {
        proposal,
        analysis
      }
    });
  } catch (error) {
    next(error);
  }
};

// Compare multiple proposals for an RFP
exports.compareProposals = async (req, res, next) => {
  try {
    const { rfpId } = req.params;
    const { proposalIds } = req.body;

    const rfp = await RFP.findById(rfpId);
    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: 'RFP not found'
      });
    }

    let query = { rfp: rfpId };
    if (proposalIds && proposalIds.length > 0) {
      query._id = { $in: proposalIds };
    }

    const proposals = await Proposal.find(query)
      .populate('vendor', 'name company rating');

    if (proposals.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 proposals are required for comparison'
      });
    }

    const comparison = await openaiService.compareProposals(
      proposals,
      rfp.requirements || []
    );

    logger.info(`Compared ${proposals.length} proposals for RFP: ${rfp.title}`);

    res.json({
      success: true,
      data: {
        rfp: {
          id: rfp._id,
          title: rfp.title
        },
        proposals: proposals.map(p => ({
          id: p._id,
          title: p.title,
          vendor: p.vendor,
          pricing: p.pricing?.totalAmount,
          scores: p.scores
        })),
        comparison
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update proposal status
exports.updateProposalStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'submitted', 'under-review', 'shortlisted', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('vendor', 'name email');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    logger.info(`Proposal status updated to ${status}: ${proposal._id}`);

    res.json({
      success: true,
      data: proposal,
      message: `Proposal status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
};

// Get proposal statistics
exports.getProposalStats = async (req, res, next) => {
  try {
    const { rfpId } = req.query;
    const matchStage = rfpId ? { rfp: mongoose.Types.ObjectId(rfpId) } : {};

    const [
      totalProposals,
      statusStats,
      avgPricing
    ] = await Promise.all([
      Proposal.countDocuments(matchStage),
      Proposal.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Proposal.aggregate([
        { $match: matchStage },
        { $group: { _id: null, avgPrice: { $avg: '$pricing.totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalProposals,
        byStatus: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        averagePrice: avgPricing[0]?.avgPrice || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
