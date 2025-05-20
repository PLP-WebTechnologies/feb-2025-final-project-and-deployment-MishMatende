// Products data (sample)
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation.",
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 149.99,
    description: "Stay connected with this stylish smart watch.",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 39.99,
    description: "Ergonomic gaming mouse with customizable buttons.",
    image:
      "https://images.unsplash.com/photo-1587202372775-3a8f4eb246dd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: 89.99,
    description: "Mechanical keyboard with RGB backlighting.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 59.99,
    description: "Portable Bluetooth speaker with deep bass.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
];

// Utility for localStorage cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in nav
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.querySelectorAll("#cart-count").forEach((el) => {
    el.textContent = count;
  });
}

// Add item to cart
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert("Added to cart!");
}

// Render featured products on home page
function renderFeaturedProducts() {
  const featuredContainer = document.getElementById("featured-products");
  if (!featuredContainer) return;

  // Show first 3 products as featured
  const featured = products.slice(0, 3);
  featuredContainer.innerHTML = featured
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="price">$${p.price.toFixed(2)}</p>
          <a href="product.html?id=${
            p.id
          }" class="btn-secondary">View Details</a>
        </div>
      </div>
    `
    )
    .join("");
}

// Render all products on products page
function renderAllProducts() {
  const productsContainer = document.getElementById("products-list");
  if (!productsContainer) return;

  productsContainer.innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p class="price">$${p.price.toFixed(2)}</p>
          <a href="product.html?id=${
            p.id
          }" class="btn-secondary">View Details</a>
        </div>
      </div>
    `
    )
    .join("");
}

// Render product detail page
function renderProductDetail(productId) {
  const product = products.find((p) => p.id === parseInt(productId));
  if (!product) return;

  const detailContainer = document.querySelector("#product-detail");
  if (!detailContainer) return;

  detailContainer.innerHTML = `
        <div class="product-detail">
            <img src="${product.image}" alt="${
    product.name
  }" class="detail-image" />
            <div class="detail-info">
                <h2>${product.name}</h2>
                <p class="detail-price">$${product.price.toFixed(2)}</p>
                <p class="detail-description">${product.description}</p>
                <button class="add-to-cart" data-id="${
                  product.id
                }">Add to Cart</button>
            </div>
        </div>
    `;

  // Add-to-cart functionality
  const addToCartBtn = detailContainer.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    addToCart(product.id);
    alert(`${product.name} has been added to your cart.`);
  });
}

function updateData() {
  const selectedCountry = countrySelect.value;
  if (selectedCountry === "") return;

  const data = covidData[selectedCountry];
  if (!data) return;

  totalCases.textContent = data.totalCases.toLocaleString();
  totalDeaths.textContent = data.totalDeaths.toLocaleString();
  totalRecovered.textContent = data.totalRecovered.toLocaleString();

  const dailyCases = data.dailyCases;
  const dates = Object.keys(dailyCases);
  const values = Object.values(dailyCases);

  chart.data.labels = dates;
  chart.data.datasets[0].data = values;
  chart.update();
}

countrySelect.addEventListener("change", updateData);

// Fetch the data when the page loads
fetchCovidData();
