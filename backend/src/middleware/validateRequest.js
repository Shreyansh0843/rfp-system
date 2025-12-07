const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Vendor validation rules
exports.validateVendor = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required'),
  body('category')
    .optional()
    .isIn(['Technology', 'Marketing', 'Consulting', 'Manufacturing', 'Services', 'Other'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'blacklisted'])
    .withMessage('Invalid status'),
  handleValidationErrors
];

// RFP validation rules
exports.validateRFP = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Technology', 'Marketing', 'Consulting', 'Manufacturing', 'Services', 'Other'])
    .withMessage('Invalid category'),
  body('deadline')
    .notEmpty().withMessage('Deadline is required')
    .isISO8601().withMessage('Invalid date format'),
  body('budget.min')
    .optional()
    .isNumeric().withMessage('Budget min must be a number'),
  body('budget.max')
    .optional()
    .isNumeric().withMessage('Budget max must be a number'),
  handleValidationErrors
];

// Proposal validation rules
exports.validateProposal = [
  body('rfpId')
    .notEmpty().withMessage('RFP ID is required')
    .isMongoId().withMessage('Invalid RFP ID'),
  body('vendorId')
    .notEmpty().withMessage('Vendor ID is required')
    .isMongoId().withMessage('Invalid Vendor ID'),
  body('title')
    .trim()
    .notEmpty().withMessage('Proposal title is required'),
  body('executive_summary')
    .trim()
    .notEmpty().withMessage('Executive summary is required'),
  body('pricing.totalAmount')
    .notEmpty().withMessage('Total amount is required')
    .isNumeric().withMessage('Total amount must be a number'),
  handleValidationErrors
];
