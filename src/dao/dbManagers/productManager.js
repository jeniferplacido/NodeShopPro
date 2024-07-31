const Product = require('../models/Product');

const getAllProducts = async () => {
    return await Product.find();
};

const getProductById = async (id) => {
    return await Product.findById(id);
};

const addProduct = async (product) => {
    return await new Product(product).save();
};

const updateProduct = async (id, product) => {
    return await Product.findByIdAndUpdate(id, product, { new: true });
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
