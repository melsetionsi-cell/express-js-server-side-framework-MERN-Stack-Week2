exports.validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Invalid name' });
  if (price == null || typeof price !== 'number') return res.status(400).json({ error: 'Invalid price' });
  next();
};
