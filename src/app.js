const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = express();
const PORT = 8080;

connectDB();

const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');
const chatRouter = require('./routes/chat');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/chat', chatRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    
    socket.emit('messages', []); // Enviar mensagens iniciais

    socket.on('newMessage', async (msg) => {
        const Message = require('./dao/models/Message');
        await new Message(msg).save();
        const messages = await Message.find();
        io.emit('messages', messages);
    });
});

module.exports = { app, io };
