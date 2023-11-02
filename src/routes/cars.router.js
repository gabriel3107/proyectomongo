import { Router } from 'express';
import { cartPath } from '../utils.js';
import fs from 'fs';


import CartManager from "../dao/dbManager/carts.manager.js"
import { pid } from 'process';
const router = Router();

const cartManager = new CartManager(cartPath);

router.get("/:cid", async(req,res)=>{
    try{
        const {cid} =req.params;
        const cart = await cartManager.getCartById(cid)
       
        if (!cart){
            return res.status(400).send({status:"error",message:"Cart not found"})
        }
        res.send({status:"success",payload:cart});
    }
    catch(error){

        console.log(error.message);
        res.status(500).send({error:error.message});}
})

router.post('/', async (req, res) => {
    try {
    const result = await cartManager.save();
    res.status(201).send({ status: 'success', message: "cart created", payload: result });}
    catch (error){
        console.log(error.message);
        res.status(500).send({error:error.message});}
        
});

router.post('/:cid/product/:pid', async (req,res)=>{
try{
    const cid =req.params.cid;
    const pid =req.params.pid;
    const cart = await cartManager.getCartById(cid);
    if (!cart){
            return res.status(400).send({status:"error",message:"Cart not found"})
        }
    const indexProductInCart = cart.products.findIndex(product=>product.id===pid)
        if (indexProductInCart!==-1){
            cart.products[indexProductInCart].quantity++;
                } else {
                    cart.products.push({"id":pid,"quantity":1});
                };

    const result = await cartManager.update(cid,{"products": cart.products});
    res.status(201).send({status:"success",payload:result});
    
        }
catch(error){
    console.log(error.message);
    res.status(500).send({error:error.message});}
});

export default router;