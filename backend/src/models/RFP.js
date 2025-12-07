const mongoose = require('mongoose');

const rfpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'RFP title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Marketing', 'Consulting', 'Manufacturing', 'Services', 'Other']
  },
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'sent', 'closed', 'awarded', 'cancelled'],
    default: 'draft'
  },
  requirements: [{
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['must-have', 'nice-to-have', 'optional'],
      default: 'must-have'
    },
    weight: { type: Number, default: 1 }
  }],
  evaluationCriteria: [{
    name: String,
    weight: { type: Number, min: 0, max: 100 },
    description: String
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  vendors: [{
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    sentAt: Date,
    viewedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'viewed', 'responded', 'declined'],
      default: 'pending'
    }
  }],
  aiGeneratedContent: {
    summary: String,
    suggestedRequirements: [String],
    riskAnalysis: String,
    generatedAt: Date
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search
rfpSchema.index({ title: 'text', description: 'text' });

// Virtual for proposal count
rfpSchema.virtual('proposalCount', {
  ref: 'Proposal',
  localField: '_id',
  foreignField: 'rfp',
  count: true
});

rfpSchema.set('toJSON', { virtuals: true });
rfpSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RFP', rfpSchema);
