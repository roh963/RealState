import Property from '../models/Property.js';
import { cloudinary } from '../utils/cloudinary.js';

// Create a new property
export const createProperty = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !price || !req.file) {
      return res.status(400).json({ message: 'Title, price, and image are required.' });
    }
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      width: 450,
      height: 350,
      crop: 'fill',
    });
    const property = new Property({
      title,
      description,
      price,
      image: result.secure_url,
      createdBy: req.user._id,
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get properties created by the logged-in user
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user._id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update property (only price and description)
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, description } = req.body;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (String(property.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (price !== undefined) property.price = price;
    if (description !== undefined) property.description = description;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete property (owner or admin)
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    if (String(property.createdBy) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await property.deleteOne();
    res.json({ message: 'Property deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all properties sorted by title
export const getAllPropertiesAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only.' });
    }
    const properties = await Property.find().sort({ title: 1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 