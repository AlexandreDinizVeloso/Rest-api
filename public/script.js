let selectedProducts = [];

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
      console.error("Error fetching products:", error);
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

    productDiv.addEventListener("click", () => {
      toggleProductSelection(productDiv, product);
    });

    container.appendChild(productDiv);
  });
}

function toggleProductSelection(productDiv, product) {
  const productId = product._id;

  // Check if the product is already selected
  const index = selectedProducts.findIndex(
    (selectedProduct) => selectedProduct.productId === productId
  );

  if (index === -1) {
    // Product is not selected, add it to the selectedProducts array
    selectedProducts.push({
      productId: productId,
      name: product.name,
      price: product.price,
    });
    productDiv.classList.add("selected");
  } else {
    // Product is already selected, remove it from the selectedProducts array
    selectedProducts.splice(index, 1);
    productDiv.classList.remove("selected");
  }
}

function sendOrder() {
  const userId = getUserIdFromUrl();
  const orderId = getOrderIdFromUrl();

  const orderData = {
    userId: userId,
    orderId: orderId,
    items: selectedProducts,
  };

  // Assuming you are sending a POST request to the server
  fetch("http://localhost:3000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((order) => {
      console.log("Order placed successfully:", order);
      // Optionally, you can redirect the user to a thank you page or perform other actions.
    })
    .catch((error) => {
      console.error("Error placing order:", error);
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
