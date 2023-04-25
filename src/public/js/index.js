const socket = io();

// DOM element
let productsElem = document.getElementById("products");

socket.on("product_added", (product) => {
  let item = document.createElement("div");
  item.classList.add("gallery");
  item.innerHTML = `<h2>${product.title}</h2> <p>$${product.price}</p> <p>${product.description}</p>`;
  productsElem.appendChild(item);
});

socket.on("product_deleted", (productIndex) => {
  productsElem.removeChild(productsElem.children[productIndex]);
});

const handleAdd = (e) => {
	e.preventDefault();
	e.stopPropagation();
	const myFormData = new FormData(e.target);
	fetch("/api/products", {
		method: "POST",
		body: myFormData,
	})
		.then((resp) => resp.json())
		.then((data) => {
			if (data.ok) {
				showAlert(data.message, "success");
			} else {
				console.log(data);
				showAlert(data.message, "error");
			}
		});
};

const handleDelete = (e) => {
	e.preventDefault();
	e.stopPropagation();
	const productId = e.target.parentNode.id;
	fetch(`/api/products/${productId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

form.addEventListener("submit", handleAdd);

deleteButtons.forEach((element) => {
	element.addEventListener("click", handleDelete);
});

socket.on("product_added", (data) => addProductElement(data));
socket.on("product_deleted", (_id) => deleteProductElement({ _id }));

const addProductElement = (data) => {
	console.log(data);
	if (data.ok) {
		const product = data?.result;
		const groupListElement = document.querySelector(".product-list");
		const listElement = document.createElement("div");
		let htmlContent = `
			<div 
				<div >
					<div">
						${product.title}
					</div>
					<div c>
						Código:
						${product.code}
					</div>
				</div>
				<div >
					<div >
						${product.description}
					</div>
				</div>
				<div >
					<div >
						$
						${product.price}
					</div>
					<div >
						Stock:
						${product.stock}
						unidades
					</div>
				</div>
			</div>
			<div >`;
		const images = product.thumbnails;
		if (images.length > 0) {
			product.thumbnails.forEach((thumbnail) => {
				htmlContent += `<div ><img src="${thumbnail}" alt="" /></div>`;
			});
		} else {
			htmlContent += `<div >Sin imágenes</div>`;
		}
		htmlContent += `</div><div class="delete-btn btn">Borrar</div>`;
		listElement.innerHTML = htmlContent;
		listElement.id = product._id;
		listElement.classList.add("product-item-full");
		groupListElement.appendChild(listElement);
		const deleteButtons = document.querySelectorAll(".delete-btn");
		deleteButtons[deleteButtons.length - 1].addEventListener(
			"click",
			handleDelete
		);
		const noProductsNode = document.querySelectorAll(".no-products");
		noProductsNode.forEach((node) => node.remove());

		showAlert("Product added", "success");
	} else {
		showAlert("Product not added", "error");
	}
};

const deleteProductElement = (product) => {
	const liToRemove = document.getElementById(product._id);
	const parentNode = liToRemove.parentNode;
	liToRemove.remove();
	const liElements = document.querySelectorAll(".product-list > div");
	if (!liElements.length) {
		const noProductsNode = document.createElement("div");
		noProductsNode.innerHTML = `No products loaded`;
		noProductsNode.classList.add("no-products");
		parentNode.appendChild(noProductsNode);
	}

};
const populateForm = (form, data) => {
	const formElements = [...form.elements];
	formElements.forEach((element) => {
		const id = element.id;
		element.value = data[id];
		if (element.id === "thumbnails") {
			element.value = "";
		}
	});

	const label = document.querySelector(".file-upload__label");
	const defaultLabelText = "No se seleccionó ninguna imagen";
	label.textContent = defaultLabelText;
	label.title = defaultLabelText;
};