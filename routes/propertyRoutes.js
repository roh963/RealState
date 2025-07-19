const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const protect = require('../middlewares/auth').protect;
const isAdmin = require('../middlewares/auth').isAdmin;
const upload = require('../middlewares/upload');

// Create property
router.post('/api/properties', protect, upload.single('image'), propertyController.createProperty);
// Get my properties
router.get('/api/properties/my', protect, propertyController.getMyProperties);
// Update property (price, description)
router.put('/api/properties/:id', protect, upload.single('image'), propertyController.updateProperty);
// Delete property
router.delete('/api/properties/:id', protect, propertyController.deleteProperty);
// Admin: get all properties
router.get('/api/properties/admin', protect, isAdmin, propertyController.getAllPropertiesAdmin);

module.exports = router; 