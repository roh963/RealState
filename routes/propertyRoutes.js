import express from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Create property
router.post('/create', authenticate, upload.single('image'), propertyController.createProperty);
// Get my properties
router.get('/my', authenticate, propertyController.getMyProperties);
// Update property (price, description)
router.put('/:id', authenticate, upload.single('image'), propertyController.updateProperty);
// Delete property
router.delete('/:id', authenticate, propertyController.deleteProperty);
// Admin: get all properties
router.get('/admin', authenticate, requireAdmin, propertyController.getAllPropertiesAdmin);

export default router; 