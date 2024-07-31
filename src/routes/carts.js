
const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/cart');
const Product = require('../dao/models/product');

// Exibir produtos em um carrinho específico
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Atualizar carrinho com uma matriz de produtos
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    await Cart.findByIdAndUpdate(req.params.cid, { products });
    res.json({ status: 'success', message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Atualizar a quantidade de um produto específico no carrinho
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found' });
    }
    
    const productIndex = cart.products.findIndex(p => p.productId.toString() === req.params.pid);
    if (productIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
    }
    
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    res.json({ status: 'success', message: 'Product quantity updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Deletar todos os produtos do carrinho
router.delete('/:cid', async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(req.params.cid, { products: [] });
    res.json({ status: 'success', message: 'All products removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
