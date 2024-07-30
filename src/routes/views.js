const express = require('express');

module.exports = (products) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.render('home', { products });
    });

    router.get('/realtimeproducts', (req, res) => {
        res.render('realTimeProducts', { products });
    });

    return router;
};
