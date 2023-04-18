import { Router } from "express";
import CartManager from "../dao/dbManagers/carts.js";


const router = Router()

const cartmanager = new CartManager();

router.post("/",async (req,res)=>{
    try{
        await cartmanager.addCart();
        return res.status(201).send({
            status:"success",
            message:{
                success:"carrito creado",
            }
        });
    }catch(error){
        console.log(error)
    }
})

router.get("/:cid",async (req,res)=>{
    try {
        const id = req.params.cid
        const cart = await cartmanager.getCartById(id);
        if (typeof(cart)==="string") {
            return res.status(404).send({
                status: "error",
                message: { error:cart},
            });
        }
    
        return res.status(200).send({
            status: "success",
            message: { cart: cart },
        });
    } catch (error) {
        console.log(error)
    }
})

export default router;
