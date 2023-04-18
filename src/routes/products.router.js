import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.js";
import { uploader } from "../utils.js";;
import  productsModel  from "../dao/models/products.js"
const router = Router()

const manager = new ProductManager();

router.get("/",async(req,res)=>{
    try{
        const consulta = await manager.getProducts();
        let limit = req.query.limit

        if(!consulta){
            return res.status(404).send({
                message: {error:"Producto no encontrado"},
            })
        }
        if (limit){
            if (isNaN(limit)){
                return res.status(400).send({
                    
                })
            }
            const resultado = consulta.slice(0,limit);
            return res.status(200).send({
                status:"succes",
                message:{products: resultado},
            });
        }else{
            return res.status(200).send({
                status:"succes",
                message:{ products: consulta},
            });
        }
    }catch(error){
        console.log(error)
    }
})

router.get("/:pid",async(req,res)=>{
    try{
        let id= req.params.pid

        const consultaId = await manager.getProductById(Number.parseInt(id));
        if(typeof(consultaId)==="string"){
            return res.status(400).send({status:"error",message:consultaId});
        }
        return res.status(200).send({
            status:"succes",
            message:{product: consultaId}
        })
    }catch(error){
        console.log(error)
    }
})

router.post("/", async (req, res) => {
    let newProduct = req.body;
   
    let result = await manager.addProduct(newProduct);
    if (typeof(result)==="string") {
      return res.status(400).send({
        status: "error",
        message: { error: result},
      });
    }
    res.status(201).send({
      status: "success",
      message: {
        success: "producto agregado"
      
      },
    });
  });


  router.post("/",async (req,res)=>{
    try{
        const{title, description, code, price, status, stock,category, thumbnails, } = req.body

        if(!title||!description||!code||!price||!status||!stock||!category||!thumbnails){
            return res 
            .status(400)
            .send({satus:"error",error:"missing properties"})
        }
        const products = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };
        const productCreated= await productsModel.create(products);

        return res.send({status:"succes", payload: productCreated})
    }catch (error){
    console.log(error)
    }
  })


router.put("/:pid", async (req, res) => {
    try {
        const product = req.body;
        const id = req.params.pid;
    
        let result = await manager.updateProduct(Number.parseInt(id), product);
        
        if (typeof(result) === "string") {
            return res.status(404).send({
                status: "error",
                message: { error: option },
            });
        }
        return res.status(200).send({
            status: "success",
            message: { update: "producto actualizado" },
        });
    } catch (error) {
        console.log(error);
    }
}) 


router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const deletedProduct = await manager.deleteProduct(+productId);
  
    if (!deletedProduct) {
      return res
        .status(404)
        .send({ status: "Error", error: "Product does not exist" });
    }
    return res.send({ status: "OK", message: "Product deleted successfully" });
  });
export default router;