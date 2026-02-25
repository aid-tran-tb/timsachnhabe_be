const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Get all catalogs
router.get('/', catalogController.getAllCatalogs);

// Get catalog by ID
router.get('/:id', catalogController.getCatalogById);

// Create new catalog
router.post('/', catalogController.createCatalog);

// Update catalog
router.put('/:id', catalogController.updateCatalog);

// Delete catalog
router.delete('/:id', catalogController.deleteCatalog);

module.exports = router; 