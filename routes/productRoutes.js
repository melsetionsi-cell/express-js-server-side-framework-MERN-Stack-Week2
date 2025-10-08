const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { NotFoundError } = require('../utils/customErrors');

// GET all (with optional filters & pagination)
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ total, products });
  } catch (err) { next(err); }
});

// GET by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) { next(err); }
});

// CREATE
router.post('/', auth, validateProduct, async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) { next(err); }
});

// UPDATE
router.put('/:id', auth, validateProduct, async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) throw new NotFoundError('Product not found');
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) throw new NotFoundError('Product not found');
    res.json({ message: 'Product deleted', deleted });
  } catch (err) { next(err); }
});

// SEARCH
router.get('/search/name', async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.name, 'i');
    const products = await Product.find({ name: regex });
    res.json(products);
  } catch (err) { next(err); }
});

// STATS
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(stats);
  } catch (err) { next(err); }
});

module.exports = router;
