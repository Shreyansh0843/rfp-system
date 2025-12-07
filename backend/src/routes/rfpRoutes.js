const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');
const { validateRFP } = require('../middleware/validateRequest');

// GET /api/rfps - Get all RFPs
router.get('/', rfpController.getAllRFPs);

// GET /api/rfps/stats - Get RFP statistics
router.get('/stats', rfpController.getRFPStats);

// GET /api/rfps/:id - Get RFP by ID
router.get('/:id', rfpController.getRFPById);

// POST /api/rfps - Create new RFP
router.post('/', validateRFP, rfpController.createRFP);

// POST /api/rfps/ai-create - Create RFP from natural language
router.post('/ai-create', rfpController.createRFPFromNaturalLanguage);

// POST /api/rfps/ai-suggestions - Get AI suggestions for RFP
router.post('/ai-suggestions', rfpController.getAISuggestions);

// PUT /api/rfps/:id - Update RFP
router.put('/:id', rfpController.updateRFP);

// DELETE /api/rfps/:id - Delete RFP
router.delete('/:id', rfpController.deleteRFP);

// POST /api/rfps/:id/send - Send RFP to vendors
router.post('/:id/send', rfpController.sendRFPToVendors);

module.exports = router;
