import  {Router}  from "express";
import productsModel  from "../dao/models/products.js";
import ProductManager from "../dao/dbManagers/products.js";
import CartManager from "../dao/dbManagers/carts.js";
import { checkLogged, checkLogin, checkSession } from "../middlewares/auth.js";
import router from "../routes/products.router.js";


router.get("/", checkLogin, async (req, res) => {
	const { page = 1, limit = 5 } = req.query;
	let { user } = req.session;
	user.isAdmin = user?.role === "admin";
	const {
		docs: products,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		totalDocs,
		totalPages,
	} = await productsModel.paginate(
		{},
		{
			page,
			limit,
			lean: true,
		}
	);

	return res.render("products", {
		products,
		page,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		totalDocs,
		totalPages,
		user,
	});
});

router.post("/:cid/product/:pid", async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.params.pid;
	const result = await CartManager.addProductToCart(productId, cartId);
	res.render("carts", { status: "Success", result });
});

router.get("/realtimeproducts", async (req, res) => {
	const products = await productsModel.find().lean();
	res.render("realTimeProducts", { products });
});

router.get("/product/:pid", async (req, res) => {
	const productId = req.params.pid;
	const product = await ProductManager.getProductById(productId);
	res.render("product", product[0]);
});

// update product quantity in cart
router.put("/:cid", async (req, res) => {
	const cartId = req.params.cid;
	const productId = req.body.productId;
	const newQuantity = req.body.newQuantity;
	const result = await CartManager.editProductQuantity(
		productId,
		cartId,
		newQuantity
	);
	res.send({ status: "Success", result });
});

router.get("/cart/:cid", async (req, res) => {
	const cartId = req.params.cid;
	// const carts = carts[0];
	const cart = await CartManager.getCartById(cartId);
	if (cart) {
		const cartIsEmpty = !cart.products?.length;
		const { products } = cart;

		// Calculate sub total price of each product
		products.forEach((product) => {
			product.subTotal = product.product.price * product.quantity;
		});
		// Calculate total price of all products
		const totalPrice = products.reduce((acc, product) => {
			return acc + parseFloat(product.subTotal);
		}, 0);
		res.render("cart", { cart, cartId, cartIsEmpty, products, totalPrice });
	}
});

router.get("/register", checkLogged, (req, res) => {
	res.render("register");
});

router.get("/login", checkSession, (req, res) => {
	res.render("login");
});

router.get("/profile", checkLogin, (req, res) => {
	res.render("profile", { user: req.session.user });
});

export default router;
