const socket = io();

const addProd = document.getElementById('addProductForm')
const productsList = document.getElementById("productsList");
const productDelete = document.getElementById("deleteProductForm");
const thumbnailsName = document.getElementById('thumbnails').files[0]


addProd.addEventListener('submit', async(e) => {
  e.preventDefault()

  const files = document.getElementById('thumbnails').files
  const thumbnailsTotal = [];
  for (let i=0; i < files.length; i++) {
    thumbnailsTotal.push(`http://localhost:8080/images/${files[i].name}`)
  }
  console.log(thumbnailsTotal);

  const newProd = {
    title: title.value,
    description: description.value,
    price: parseInt(price.value),
    code: code.value,
    stock: parseInt(stock.value),
    category: category.value,
    thumbnails: thumbnailsTotal
  }

  const fileData = [];
  for (let i=0; i < files.length; i++) {
    fileData.push({
      name: files[i].name,
      data: files[i]
    })
  }

  await fetch('/api/products', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProd)
  })

  socket.emit('upload', fileData)
  addProd.reset()
})

productDelete.addEventListener('submit', (e) => {
  e.preventDefault()
  const prodId = document.getElementById("pid").value;
  productDelete.reset()
  fetch(`/api/products/${prodId}`, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
  })
})

socket.on("products", (products) => {
  let productsVisible = "";
  products.forEach(e => {
    productsVisible += `
      <p>${e.title}</p>
      <p>Stock:${e.stock}</p>
      <p>precio:$${e.price}</p>
    `
  })
  productsList.innerHTML = productsVisible
  
});