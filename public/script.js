let products = [];

document.addEventListener("DOMContentLoaded", function () {
  displayProductsByCategory("Sanduiches", "sandwich-container");
  displayProductsByCategory("Acompanhamentos", "accompaniment-container");
  displayProductsByCategory("Bebidas", "drink-container");
  displayProductsByCategory("Sobremesas", "dessert-container");
});

function displayProductsByCategory(category, containerId) {
  const container = document.getElementById(containerId);

  fetch(`http://localhost:3000/api/products/${category}`)
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products, container);
    })
    .catch((error) => {
      console.error("Erro fetch:", error);
    });
}

function displayProducts(products, container) {
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    productDiv.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.image}" alt="${product.name}">
      <p class="product-description">${product.description}</p>
      <p class="product-price">$${product.price.toFixed(2)}</p>
    `;

    container.appendChild(productDiv);
  });
}

function sendOrder() {
  const userId = getUserIdFromUrl();
  const orderId = getOrderIdFromUrl();

  const orderData = {
    userId: userId,
    orderId: orderId,
    items: products,
  };

  fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((order) => {
      console.log("Pedido feito com sucesso:", order);
    })
    .catch((error) => {
      console.error("Erro fazendo pedido:", error);
    });
}

function getUserIdFromUrl() {
  const pathArray = window.location.pathname.split("/");
  return pathArray[2];
}

function getOrderIdFromUrl() {
  const pathArray = window.location.pathname.split("/");
  return pathArray[3];
}
