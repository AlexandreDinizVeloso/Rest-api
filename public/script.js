let products = {};

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
      <button id="add_${product._id}" class="btnAdd" >+</button>
      <div id="quantity_${product._id}">0</div>
      <button id="sub_${product._id}" class="btnSub" >-</button>
    `;

    container.appendChild(productDiv);
    document
      .querySelector(`#add_${product._id}`)
      .addEventListener("click", () => addProduct(product._id));

    document
      .querySelector(`#sub_${product._id}`)
      .addEventListener("click", () => subProduct(product._id));
  });
}

function addProduct(productId) {
  if (!products[productId]) {
    products[productId] = 0;
  }

  products[productId]++;
  updateQuantity(productId);
}

function subProduct(productId) {
  if (products[productId] && products[productId] > 0) {
    products[productId]--;
    updateQuantity(productId);
  }
}

function updateQuantity(productId) {
  const quantityElement = document.getElementById(`quantity_${productId}`);
  if (quantityElement) {
    quantityElement.textContent = products[productId].toString();
  }
}

function getUserIdFromUrl() {
  const pathArray = window.location.pathname.split("/");
  return pathArray[2];
}

function getOrderIdFromUrl() {
  const pathArray = window.location.pathname.split("/");
  return pathArray[3];
}

function sendOrder() {
  const userId = getUserIdFromUrl();
  const orderId = getOrderIdFromUrl();

  const orderItems = [];
  Object.keys(products).forEach((productId) => {
    const quantity = products[productId];
    if (quantity > 0) {
      orderItems.push({
        product: productId,
        quantity: quantity,
      });
    }
  });

  const orderData = {
    userId: userId,
    orderId: orderId,
    items: orderItems,
    orderState: "Preparação",
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
      console.log("Order sent successfully:", order);
    })
    .catch((error) => {
      console.error("Error sending order:", error);
    });
}
