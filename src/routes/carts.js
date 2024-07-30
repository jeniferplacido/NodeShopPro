const express = require('express');
const router = express.Router();

// Simulação de banco de dados
let carts = [];

// Rota para criar um novo carrinho
router.post('/', (req, res) => {
    const newCart = {
        id: carts.length + 1,
        products: []
    };
    carts.push(newCart);
    res.status(201).json(newCart);
});

// Rota para listar os produtos de um carrinho
router.get('/:cid', (req, res) => {
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrinho não encontrado');
    }
});

// Rota para adicionar um produto a um carrinho
router.post('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.productId === parseInt(req.params.pid));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ productId: parseInt(req.params.pid), quantity: 1 });
        }
        res.json(cart);
    } else {
        res.status(404).send('Carrinho não encontrado');
    }
});

module.exports = router;
