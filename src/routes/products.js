const express = require('express');
const fs = require('fs');
const router = express.Router();

const PRODUCTS_FILE = 'produtos.json';


const readJSONFile = (filename) => {
    return JSON.parse(fs.readFileSync(filename, 'utf-8'));
};

const writeJSONFile = (filename, content) => {
    fs.writeFileSync(filename, JSON.stringify(content, null, 2));
};


router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || undefined;
    const products = readJSONFile(PRODUCTS_FILE);
    res.json(limit ? products.slice(0, limit) : products);
});


router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readJSONFile(PRODUCTS_FILE);
    const product = products.find(p => p.id == pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Produto não encontrado' });
    }
});


router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || stock === undefined || !category) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios, exceto thumbnails' });
    }

    const products = readJSONFile(PRODUCTS_FILE);
    const id = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails };
    products.push(newProduct);
    writeJSONFile(PRODUCTS_FILE, products);

    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const products = readJSONFile(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.id == pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const updatedProduct = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };
    products[productIndex] = updatedProduct;
    writeJSONFile(PRODUCTS_FILE, products);

    res.json(updatedProduct);
});


router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readJSONFile(PRODUCTS_FILE);
    const productIndex = products.findIndex(p => p.id == pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    products.splice(productIndex, 1);
    writeJSONFile(PRODUCTS_FILE, products);

    res.json({ message: 'Produto deletado com sucesso' });
});

module.exports = router;
