const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  rfp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFP',
    required: [true, 'RFP reference is required']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: [true, 'Vendor reference is required']
  },
  title: {
    type: String,
    required: [true, 'Proposal title is required'],
    trim: true
  },
  executive_summary: {
    type: String,
    required: [true, 'Executive summary is required']
  },
  technical_approach: {
    type: String
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      name: String,
      date: Date,
      description: String
    }]
  },
  pricing: {
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    breakdown: [{
      item: String,
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }],
    paymentTerms: String
  },
  team: [{
    name: String,
    role: String,
    experience: String
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'shortlisted', 'accepted', 'rejected'],
    default: 'submitted'
  },
  scores: {
    technical: { type: Number, min: 0, max: 100 },
    financial: { type: Number, min: 0, max: 100 },
    experience: { type: Number, min: 0, max: 100 },
    overall: { type: Number, min: 0, max: 100 }
  },
  aiAnalysis: {
    strengths: [String],
    weaknesses: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    recommendation: String,
    complianceScore: Number,
    analyzedAt: Date
  },
  evaluatorNotes: [{
    note: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique proposal per vendor per RFP
proposalSchema.index({ rfp: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
