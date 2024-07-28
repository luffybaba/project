const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Additional fields
});

module.exports = mongoose.model('Item', itemSchema);
