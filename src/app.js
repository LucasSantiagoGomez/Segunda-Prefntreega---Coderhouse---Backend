import productsrouter from './routes/products.router.js'
import cartrouter from './routes/cart.router.js'
import viewrouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import express from "express";
import { Server } from 'socket.io';
import socket from './socket.js';

const productServer = express()
productServer.use(express.json())
productServer.use(express.urlencoded({extended:true}))


productServer.engine("handlebars",handlebars.engine());

productServer.set("view engine","handlebars");
productServer.set("views",`${__dirname}/views`);
productServer.use("/api/products",productsrouter)
productServer.use("/api/cart",cartrouter)
productServer.use(express.static(`${__dirname}/public`));
productServer.use("/",viewrouter)


const httpServer=productServer.listen(8080, () => {
  try {
      console.log("Servidor arriba en el puerto 8080");
  } catch (error) {
      console.log(error);
  }
});
socket.connect(httpServer)


/*
productServer.get("/products", async(req, res)=>{
  
    const consult = await manager.getProducts();
    let limit = Number.parseInt(req.query.limit)

    if(limit){
      const result = consult.slice(0,limit);
      res.send(result);
    }else{
      res.send(consult)
    }
  
});

productServer.get("/products/:pid",async(req, res)=>{
  
    let id = req.params.pid
    console.log(id)
    const consultId = await manager.getProductById(Number.parseInt(id));
    if (!consultId){
      return res.send({error:"Producto no encontrado"})
    }else{
      res.send(consultId);
    }
  
});

productServer.listen(8080,()=>{
  console.log("Servidor arriba en el puerto 8080")
})






/*const env = async () => {
  let primerProducto = await manager.getProducts();
  console.log(primerProducto);
  
  const product = {
    title: "producto prueba",
    description:"Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25,

  }

  let result = await manager.addProduct(product)
  console.log(result)

  let result2 = await manager.addProduct(product)
  console.log(result2)

    const changes = {
        price:300,
        stock:15,
    }
    await manager.updateProduct(2,changes)
  
}
env()
*/
