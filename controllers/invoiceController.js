const Invoice = require('../models/invoice');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new invoice
exports.createInvoice = async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        const savedInvoice = await invoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!invoice) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }
        res.json({ message: 'Đã xóa hóa đơn thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get invoices by customer
exports.getInvoicesByCustomer = async (req, res) => {
    try {
        const invoices = await Invoice.find({ customerId: req.params.customerId });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get invoice by order
exports.getInvoiceByOrder = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ orderId: req.params.orderId });
        if (!invoice) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn cho đơn hàng này' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 