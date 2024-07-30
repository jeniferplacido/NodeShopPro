const express = require('express');
const fs = require('fs');
const router = express.Router();

const CARTS_FILE = 'carrinhos.json';

// Helper para ler e escrever arquivos JSON
const readJSONFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

const writeJSONFile = (filename, content) => {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2));
};

// POST /api/carts/
router.post('/', (req, res) => {
    const carts = readJSONFile(CARTS_FILE);
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;

    const newCart = { id, products: [] };
    carts.push(newCart);
    writeJSONFile(CARTS_FILE, carts);

    res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readJSONFile(CARTS_FILE);
    const cart = carts.find(c => c.id == cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Carrinho não encontrado' });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readJSONFile(CARTS_FILE);
    const cart = carts.find(c => c.id == cid);

    if (!cart) {
        return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    writeJSONFile(CARTS_FILE, carts);
    res.json(cart);
});

module.exports = router;
