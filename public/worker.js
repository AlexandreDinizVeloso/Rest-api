document.addEventListener("DOMContentLoaded", async () => {
  const ordersContainer = document.getElementById("orders-container");

  // Fetch orders from the server
  const orders = await fetchOrders();

  // Render orders
  renderOrders(orders);
});

async function fetchOrders() {
  const response = await fetch("/api/orders");
  const orders = await response.json();
  return orders;
}

function renderOrders(orders) {
  const ordersContainer = document.getElementById("orders-container");
  ordersContainer.innerHTML = "";

  orders.forEach((order) => {
    const orderBox = createOrderBox(order);
    ordersContainer.appendChild(orderBox);
  });
}

function createOrderBox(order) {
  const orderBox = document.createElement("div");
  orderBox.className = "order-box";

  const title = document.createElement("h2");
  title.textContent = `ID do pedido: ${order.orderId}`;
  orderBox.appendChild(title);

  order.items.forEach((item) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "item-container";

    const itemName = document.createElement("p");
    itemName.textContent = `Nome: ${item.name}`;
    itemContainer.appendChild(itemName);

    const itemQuantity = document.createElement("p");
    itemQuantity.textContent = `Quantidade: ${item.quantity}`;
    itemContainer.appendChild(itemQuantity);

    orderBox.appendChild(itemContainer);
  });

  function createOrderStateSelect(orderState) {
    const select = document.createElement("select");
    const states = ["Preparação", "Em progresso", "Finalizado"];

    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      if (state === orderState) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    return select;
  }

  const orderStateSelect = createOrderStateSelect(order.orderState);
  orderStateSelect.addEventListener("change", (event) => {
    const newOrderState = event.target.value;
    updateOrderState(order.orderId, newOrderState);
  });
  orderBox.appendChild(orderStateSelect);

  return orderBox;
}

async function updateOrderState(orderId, newOrderState) {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderState: newOrderState,
      }),
    });

    if (response.ok) {
      const updatedOrder = await response.json();
      alert("Estado do pedido alterado com sucesso:", updatedOrder);
      const updatedOrders = await fetchOrders();
      renderOrders(updatedOrders);
    } else {
      alert(
        "Falha ao atualizar o estado do pedido:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    alert("Falha ao atualizar o estado do pedido:", error);
  }
}
