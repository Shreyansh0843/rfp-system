const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const { validateProposal } = require('../middleware/validateRequest');

// GET /api/proposals - Get all proposals
router.get('/', proposalController.getAllProposals);

// GET /api/proposals/stats - Get proposal statistics
router.get('/stats', proposalController.getProposalStats);

// GET /api/proposals/rfp/:rfpId - Get proposals by RFP
router.get('/rfp/:rfpId', proposalController.getProposalsByRFP);

// GET /api/proposals/:id - Get proposal by ID
router.get('/:id', proposalController.getProposalById);

// POST /api/proposals - Create/submit proposal
router.post('/', validateProposal, proposalController.createProposal);

// PUT /api/proposals/:id - Update proposal
router.put('/:id', proposalController.updateProposal);

// PATCH /api/proposals/:id/status - Update proposal status
router.patch('/:id/status', proposalController.updateProposalStatus);

// DELETE /api/proposals/:id - Delete proposal
router.delete('/:id', proposalController.deleteProposal);

// POST /api/proposals/:id/analyze - Analyze proposal with AI
router.post('/:id/analyze', proposalController.analyzeProposal);

// POST /api/proposals/compare/:rfpId - Compare proposals for RFP
router.post('/compare/:rfpId', proposalController.compareProposals);

module.exports = router;
