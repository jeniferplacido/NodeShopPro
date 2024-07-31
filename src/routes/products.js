const express = require('express');
const { io } = require('../app');

module.exports = (products) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
          const { limit = 10, page = 1, sort = '', query = '' } = req.query;
      
          const filter = query ? { category: query } : {}; // Filtro por categoria, por exemplo
      
          const productsQuery = Product.find(filter);
      
          if (sort === 'asc') {
            productsQuery.sort({ price: 1 });
          } else if (sort === 'desc') {
            productsQuery.sort({ price: -1 });
          }
      
          const totalProducts = await Product.countDocuments(filter);
          const totalPages = Math.ceil(totalProducts / limit);
          const skip = (page - 1) * limit;
      
          const products = await productsQuery.limit(Number(limit)).skip(skip);
      
          const response = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: Number(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
          };
      
          res.json(response);
        } catch (error) {
          res.status(500).json({ status: 'error', message: error.message });
        }
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
