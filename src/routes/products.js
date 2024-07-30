const express = require('express');
const { io } = require('../app');

module.exports = (products) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    });

    router.get('/:pid', (req, res) => {
        const product = products.find(p => p.id === parseInt(req.params.pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Produto não encontrado');
        }
    });

    router.post('/', (req, res) => {
        const newProduct = {
            id: products.length + 1,
            ...req.body,
            status: true,
            thumbnails: req.body.thumbnails || []
        };
        products.push(newProduct);
        io.emit('updateProducts', products);
        res.status(201).json(newProduct);
    });

    router.put('/:pid', (req, res) => {
        const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...req.body };
            io.emit('updateProducts', products);
            res.json(products[productIndex]);
        } else {
            res.status(404).send('Produto não encontrado');
        }
    });

    router.delete('/:pid', (req, res) => {
        products = products.filter(p => p.id !== parseInt(req.params.pid));
        io.emit('updateProducts', products);
        res.status(204).send();
    });

    return router;
};
