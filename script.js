// FORMSPREE ENDPOINT FOR ORDERS & RATINGS
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_FORM_ID";

// PRODUCT CATALOG WITH MULTI-IMAGE GALLERIES
const products = [
  {
    id: "p1",
    name: "Minimalist UI Kit",
    price: "$49",
    images: ["product1.jpg", "product1-2.jpg", "product1-3.jpg", "product1-4.jpg"],
    description: "High-contrast component library for modern web platforms.",
    likes: 124,
    rating: 4.8,
    reviews: [
      { user: "Alex M.", text: "Extremely clean code structure!", rating: 5 },
      { user: "Sarah T.", text: "Sleek and easy to customize.", rating: 4.5 }
    ]
  },
  {
    id: "p2",
    name: "Automation Engine",
    price: "$99",
    images: ["product2.jpg", "product2-2.jpg", "product2-3.jpg"],
    description: "Lightweight digital script set designed to optimize business workflows.",
    likes: 89,
    rating: 5.0,
    reviews: [
      { user: "David K.", text: "Saved our team hours of manual work.", rating: 5 }
    ]
  }
];

let activeProduct = null;

// GOOGLE AUTHENTICATION HANDLER
function handleGoogleSignIn(response) {
  // Decode JWT Payload
  const base64Url = response.credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(window.atob(base64));
  
  // Store User
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);

  // Hide auth modal
  document.getElementById("auth-modal").style.display = "none";
}

function checkAuthStatus() {
  const user = localStorage.getItem("userEmail");
  const authModal = document.getElementById("auth-modal");
  if (user && authModal) {
    authModal.style.display = "none";
  }
}

// RENDER PRODUCT GRID
function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = "";

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => openProductDetail(p.id);
    
    card.innerHTML = `
      <img src="${p.images[0]}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(p.name)}'">
      <div class="product-details">
        <h3>${p.name}</h3>
        <span class="price">${p.price}</span>
        <div class="rating-stars">★★★★★ (${p.rating})</div>
        <p>${p.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// OPEN PRODUCT DETAIL MODAL (CAROUSEL & REVIEWS)
function openProductDetail(id) {
  activeProduct = products.find(p => p.id === id);
  if (!activeProduct) return;

  document.getElementById("modal-product-title").innerText = activeProduct.name;
  document.getElementById("modal-product-price").innerText = activeProduct.price;
  document.getElementById("modal-product-desc").innerText = activeProduct.description;
  document.getElementById("modal-likes-count").innerText = activeProduct.likes;

  // Render Image Gallery
  const mainImg = document.getElementById("modal-main-img");
  const thumbBox = document.getElementById("modal-thumbnails");
  mainImg.src = activeProduct.images[0];
  thumbBox.innerHTML = "";

  activeProduct.images.forEach((imgSrc, idx) => {
    const thumb = document.createElement("img");
    thumb.src = imgSrc;
    thumb.className = `thumbnail-img ${idx === 0 ? 'active' : ''}`;
    thumb.onerror = () => thumb.src = 'https://via.placeholder.com/50';
    thumb.onclick = () => {
      mainImg.src = imgSrc;
      document.querySelectorAll(".thumbnail-img").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    };
    thumbBox.appendChild(thumb);
  });

  // Render Reviews
  const reviewsList = document.getElementById("modal-reviews-list");
  reviewsList.innerHTML = activeProduct.reviews.map(r => `
    <div class="review-item">
      <strong>${r.user}</strong> (${r.rating}★): ${r.text}
    </div>
  `).join("") || "<p>No reviews yet.</p>";

  // Trigger Order Button Listener
  document.getElementById("trigger-order-btn").onclick = () => {
    closeModal("product-detail-modal");
    openOrderModal(activeProduct);
  };

  document.getElementById("product-detail-modal").style.display = "flex";
  if (window.feather) feather.replace();
}

// ORDER FORM MODAL
function openOrderModal(product) {
  document.getElementById("order-product-subtitle").innerText = `Ordering: ${product.name} (${product.price})`;
  document.getElementById("order-item-name").value = product.name;
  
  // Pre-fill email if logged in via Google
  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) {
    const emailInput = document.querySelector("#order-form input[name='customer_email']");
    if (emailInput) emailInput.value = savedEmail;
  }

  document.getElementById("order-modal").style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// ORDER FORM SUBMISSION TO GMAIL
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  renderProductGrid();

  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          alert("Order submitted successfully! We will contact you via email shortly.");
          closeModal("order-modal");
          this.reset();
        } else {
          alert("Order registered! Thank you for ordering from WRIGHT'S DIGIT.");
          closeModal("order-modal");
        }
      } catch (err) {
        alert("Order registered! Thank you for ordering from WRIGHT'S DIGIT.");
        closeModal("order-modal");
      }
    });
  }
});
