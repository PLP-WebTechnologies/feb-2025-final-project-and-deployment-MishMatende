// You must keep this products array in sync with product-page-script.js
const products = [
  {
    id: 1,
    name: "Smartphone",
    price: 499.99,
    category: "Electronics",
    image: "images/smartphone.jpg",
  },
  {
    id: 2,
    name: "Headphones",
    price: 89.99,
    category: "Accessories",
    image: "images/headphones.jpg",
  },
  {
    id: 3,
    name: "Smartwatch",
    price: 199.99,
    category: "Wearables",
    image: "images/smartwatch.jpg",
  },
  {
    id: 4,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    image: "images/laptop.jpg",
  },
  {
    id: 5,
    name: "Backpack",
    price: 59.99,
    category: "Accessories",
    image: "images/backpack.jpg",
  },
];

// DOM Elements
const cartContainer = document.getElementById("cart-container");
const cartSummary = document.getElementById("cart-summary");
const clearCartBtn = document.getElementById("clear-cart");
const cartCountElem = document.getElementById("cart-count");

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in header nav
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalItems;
}

// Render cart items
function renderCart() {
  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartSummary.textContent = "";
    return;
  }

  let html = "<table style='width:100%; border-collapse: collapse;'>";
  html += `
      <thead>
        <tr style="border-bottom: 1px solid #ccc;">
          <th style="padding: 0.5rem; text-align: left;">Product</th>
          <th style="padding: 0.5rem;">Price</th>
          <th style="padding: 0.5rem;">Quantity</th>
          <th style="padding: 0.5rem;">Total</th>
          <th style="padding: 0.5rem;">Actions</th>
        </tr>
      </thead>
      <tbody>
    `;

  let totalPrice = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return;
    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;
    html += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 0.5rem; display: flex; align-items: center;">
            <img src="${product.image}" alt="${
      product.name
    }" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem;">
            ${product.name}
          </td>
          <td style="padding: 0.5rem; text-align: center;">$${product.price.toFixed(
            2
          )}</td>
          <td style="padding: 0.5rem; text-align: center;">
            <button class="qty-btn" data-id="${
              item.id
            }" data-action="decrease" style="padding:0 8px; cursor:pointer;">-</button>
            <span style="margin: 0 10px;">${item.quantity}</span>
            <button class="qty-btn" data-id="${
              item.id
            }" data-action="increase" style="padding:0 8px; cursor:pointer;">+</button>
          </td>
          <td style="padding: 0.5rem; text-align: center;">$${itemTotal.toFixed(
            2
          )}</td>
          <td style="padding: 0.5rem; text-align: center;">
            <button class="remove-btn" data-id="${
              item.id
            }" style="cursor:pointer; color: red;">Remove</button>
          </td>
        </tr>
      `;
  });

  html += "</tbody></table>";

  cartContainer.innerHTML = html;
  cartSummary.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

// Handle quantity changes and removal
cartContainer.addEventListener("click", (e) => {
  const target = e.target;
  const cart = getCart();

  if (target.classList.contains("qty-btn")) {
    const id = parseInt(target.dataset.id);
    const action = target.dataset.action;
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (action === "increase") {
      item.quantity++;
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity--;
    }
    saveCart(cart);
    renderCart();
    updateCartCount();
  }

  if (target.classList.contains("remove-btn")) {
    const id = parseInt(target.dataset.id);
    const index = cart.findIndex((i) => i.id === id);
    if (index !== -1) {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    }
  }
});

// Clear entire cart
clearCartBtn.addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
});

const checkoutBtn = document.getElementById("checkout-btn");

checkoutBtn.addEventListener("click", () => {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty! Please add some products before checking out.");
    return;
  }

  // Simulate checkout process
  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  if (
    confirm(`Your total is $${totalPrice.toFixed(2)}. Proceed to checkout?`)
  ) {
    // Clear cart
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
    alert("Thank you for your purchase! Your order has been placed.");
  }
});

// Initialize
renderCart();
updateCartCount();
