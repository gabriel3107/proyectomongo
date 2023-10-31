import express from "express";
import handlebars from 'express-handlebars'
import { __dirname } from './utils.js';
import { Server } from "socket.io";

import ProductManager from './routes/ProductManager.js'
import path from 'node:path';
const productsFilePath = path.join(__dirname, "./files/productos.json");
const productManager = new ProductManager(productsFilePath);

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use('/', viewsRouter);


const server = app.listen(8080, () => console.log('running port 8080'))
const io = new Server(server);
app.set('socketio', io);

io.on('connection', socket => {
    console.log('Nuevo soquete conectado');

    
    socket.on('agregarProducto', async (data) => {
        try {

            await productManager.addProduct(JSON.parse(data));
            io.emit('mostrartodo', await productManager.getProducts());
        } catch{
        }
    });

    
    socket.on('eliminarProducto', async (data) => {
        try {
            const id = Number(data)
            await productManager.deleteProduct(id);
            io.emit('mostrartodo', await productManager.getProducts());
        } catch {

        }
    });

});
