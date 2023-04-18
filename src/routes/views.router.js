import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.js";


const router = Router()
const productManager = new ProductManager();

router.get("/",async(req,res)=>{
    const products = await productManager.getProducts();
    res.render("home", {products});
})

router.get("/realtimeproducts",async (req,res)=>{
    res.render("realTimeProducts",{});
})

router.get("/chat", async (req, res) => {
    const messages = await messageManager.getMessages();
    return res.render("messages");
  });

export default router;