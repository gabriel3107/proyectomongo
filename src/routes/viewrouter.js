import { Router } from "express";
import ProductManager from './ProductManager.router.js'
import { __dirname } from "../utils.js";
import path from 'node:path';

const productsFilePath = path.join(__dirname, "./files/productos.json");
const productManager = new ProductManager(productsFilePath);

const router = Router();

router.get('/', async (req, res) => {
    try {
        const coso = await productManager.getProducts();
        res.render('home', {
            coso
        });
    }
    catch {

    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

router.get("/chat",async(req,res)=>{
    const messages = await chatManager.getAll();
    res.render("chat",{messages});
});


export default router;