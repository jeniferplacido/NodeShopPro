const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const PORT = 8080;

// Configurar Handlebars
const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulação de banco de dados
let products = [
    { id: 1, title: 'Produto 1', price: 100 },
    { id: 2, title: 'Produto 2', price: 200 }
];

// Rotas
const productsRouter = require('./routes/products')(products);
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views')(products);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Configurar socket.io
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    // Enviar a lista de produtos ao conectar
    socket.emit('updateProducts', products);

    socket.on('addProduct', (product) => {
        // Lógica para adicionar produto
        products.push(product);
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        // Lógica para deletar produto
        products = products.filter(product => product.id !== productId);
        io.emit('updateProducts', products);
    });
});

module.exports = { app, io };
