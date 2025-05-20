// Sample products array (add your real products here)
const products = [
  {
    id: 1,
    name: "Smartphone",
    price: 499.99,
    category: "Electronics",
    image: "images/smartphone.jpg",
    description: "Latest smartphone with high-res camera.",
  },
  {
    id: 2,
    name: "Headphones",
    price: 89.99,
    category: "Accessories",
    image: "images/headphones.jpg",
    description: "Noise-canceling over-ear headphones.",
  },
  {
    id: 3,
    name: "Smartwatch",
    price: 199.99,
    category: "Wearables",
    image: "images/smartwatch.jpg",
    description: "Track fitness, messages, and calls.",
  },
  {
    id: 4,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    image: "images/laptop.jpg",
    description: "Powerful laptop for work and play.",
  },
  {
    id: 5,
    name: "Backpack",
    price: 59.99,
    category: "Accessories",
    image: "images/backpack.jpg",
    description: "Durable and stylish backpack.",
  },
];

// DOM Elements
const grid = document.querySelector(".product-grid");
const filterButtonsContainer = document.querySelector(".filter-buttons");
const searchInput = document.getElementById("searchInput");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const cartCountElem = document.getElementById("cart-count");

let activeCategory = "All";

// CART FUNCTIONS

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalItems;
}

// RENDER FUNCTIONS

function renderProducts(filteredProducts = products) {
  grid.innerHTML = "";
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${
            product.id
          }">Add to Cart</button>
          <button class="quick-view" data-id="${product.id}">Quick View</button>
        </div>
      `;
    grid.appendChild(card);
  });
}

function renderFilterButtons() {
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  filterButtonsContainer.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.dataset.category = cat;
    if (cat === "All") btn.classList.add("active");
    filterButtonsContainer.appendChild(btn);
  });
}

// FILTER & SEARCH HANDLER

function filterAndRender() {
  const searchTerm = searchInput.value.toLowerCase();
  let filtered = products;

  if (activeCategory !== "All") {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchTerm)
    );
  }

  renderProducts(filtered);
}

// EVENT LISTENERS

// Filter buttons click
filterButtonsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    activeCategory = e.target.dataset.category;
    document
      .querySelectorAll(".filter-buttons button")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    filterAndRender();
  }
});

// Search input
searchInput.addEventListener("input", filterAndRender);

// Product grid clicks (Add to Cart and Quick View)
grid.addEventListener("click", (e) => {
  const target = e.target;

  // Add to Cart from product card
  if (target.classList.contains("add-to-cart")) {
    const productId = parseInt(target.dataset.id);
    addToCart(productId);
    alert("Added to cart!");
  }

  // Quick View modal open
  if (target.classList.contains("quick-view")) {
    const productId = parseInt(target.dataset.id);
    const product = products.find((p) => p.id === productId);
    if (product) {
      modalContent.innerHTML = `
          <span class="close-modal">&times;</span>
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <p>${product.description}</p>
          <button class="add-to-cart" data-id="${
            product.id
          }">Add to Cart</button>
        `;
      modal.style.display = "flex";
    }
  }
});

// Modal click (close modal or add to cart inside modal)
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-modal") || e.target === modal) {
    modal.style.display = "none";
  }
  if (e.target.classList.contains("add-to-cart")) {
    const productId = parseInt(e.target.dataset.id);
    addToCart(productId);
    alert("Added to cart!");
  }
});

// INIT

renderFilterButtons();
renderProducts();
updateCartCount();
