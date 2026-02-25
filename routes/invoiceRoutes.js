const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Invoice management
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.get('/customer/:customerId', invoiceController.getInvoicesByCustomer);
router.get('/order/:orderId', invoiceController.getInvoiceByOrder);

module.exports = router; 