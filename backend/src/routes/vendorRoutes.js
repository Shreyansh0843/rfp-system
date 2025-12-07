const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { validateVendor } = require('../middleware/validateRequest');

// GET /api/vendors - Get all vendors
router.get('/', vendorController.getAllVendors);

// GET /api/vendors/stats - Get vendor statistics
router.get('/stats', vendorController.getVendorStats);

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', vendorController.getVendorById);

// POST /api/vendors - Create new vendor
router.post('/', validateVendor, vendorController.createVendor);

// PUT /api/vendors/:id - Update vendor
router.put('/:id', vendorController.updateVendor);

// DELETE /api/vendors/:id - Delete vendor
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;
