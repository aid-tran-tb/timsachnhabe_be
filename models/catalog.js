// models/Catalog.js
const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  genreID: {
    type: String,
    required: true,
    unique: true,
  },
  genre2nd: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('catalogs', catalogSchema);
