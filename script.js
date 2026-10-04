// PRODUCT CATALOG WITH MULTI-IMAGE GALLERIES
const products = [
  {
    id: "p1",
    name: "Minimalist UI Kit",
    price: "$49",
    images: ["product1.png", "product1-2.jpg", "product1-3.jpg", "product1-4.jpg"],
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
    images: ["product2.png", "product2-2.jpg", "product2-3.jpg"],
    description: "Lightweight digital script set designed to optimize business workflows.",
    likes: 89,
    rating: 5.0,
    reviews: [
      { user: "David K.", text: "Saved our team hours of manual work.", rating: 5 }
    ]
  }
];

let activeProduct = null;

// GOOGLE AUTHENTICATION HANDLERS
function handleGoogleSignIn(response) {
  try {
    // Decode JWT Payload
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Store user data in browser
    localStorage.setItem("userEmail", payload.email);
    localStorage.setItem("userName", payload.name);

    // Immediately hide the auth overlay
    hideAuthModal();
  } catch (e) {
    console.error("Auth decode error:", e);
  }
}

function hideAuthModal() {
  const authModal = document.getElementById("auth-modal");
  if (authModal) {
    authModal.style.display = "none";
    authModal.style.visibility = "hidden";
  }
}

function continueToSite() {
  if (!localStorage.getItem("userEmail")) {
    localStorage.setItem("userEmail", "guest@wrightsdigit.com");
  }
  hideAuthModal();
}

function checkAuthStatus() {
  const user = localStorage.getItem("userEmail");
  if (user) {
    hideAuthModal();
  }
}

// SAFE PRODUCT GRID RENDERING (ONLY RUNS ON PRODUCTS PAGE)
function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return; // Exit cleanly if on landing page
  
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

// PRODUCT DETAIL MODAL
function openProductDetail(id) {
  activeProduct = products.find(p => p.id === id);
  if (!activeProduct) return;

  const titleEl = document.getElementById("modal-product-title");
  const priceEl = document.getElementById("modal-product-price");
  const descEl = document.getElementById("modal-product-desc");
  const likesEl = document.getElementById("modal-likes-count");

  if (titleEl) titleEl.innerText = activeProduct.name;
  if (priceEl) priceEl.innerText = activeProduct.price;
  if (descEl) descEl.innerText = activeProduct.description;
  if (likesEl) likesEl.innerText = activeProduct.likes;

  const mainImg = document.getElementById("modal-main-img");
  const thumbBox = document.getElementById("modal-thumbnails");
  
  if (mainImg) mainImg.src = activeProduct.images[0];
  if (thumbBox) {
    thumbBox.innerHTML = "";
    activeProduct.images.forEach((imgSrc, idx) => {
      const thumb = document.createElement("img");
      thumb.src = imgSrc;
      thumb.className = `thumbnail-img ${idx === 0 ? 'active' : ''}`;
      thumb.onerror = () => { thumb.src = 'https://via.placeholder.com/50'; };
      thumb.onclick = () => {
        if (mainImg) mainImg.src = imgSrc;
        document.querySelectorAll(".thumbnail-img").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      };
      thumbBox.appendChild(thumb);
    });
  }

  const reviewsList = document.getElementById("modal-reviews-list");
  if (reviewsList) {
    reviewsList.innerHTML = activeProduct.reviews.map(r => `
      <div class="review-item">
        <strong>${r.user}</strong> (${r.rating}★): ${r.text}
      </div>
    `).join("") || "<p>No reviews yet.</p>";
  }

  const triggerOrderBtn = document.getElementById("trigger-order-btn");
  if (triggerOrderBtn) {
    triggerOrderBtn.onclick = () => {
      closeModal("product-detail-modal");
      openOrderModal(activeProduct);
    };
  }

  const detailModal = document.getElementById("product-detail-modal");
  if (detailModal) detailModal.style.display = "flex";
  
  if (window.feather) feather.replace();
}

function openOrderModal(product) {
  const subtitle = document.getElementById("order-product-subtitle");
  const nameInput = document.getElementById("order-item-name");
  
  if (subtitle) subtitle.innerText = `Ordering: ${product.name} (${product.price})`;
  if (nameInput) nameInput.value = product.name;
  
  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) {
    const emailInput = document.querySelector("#order-form input[name='customer_email']");
    if (emailInput) emailInput.value = savedEmail;
  }

  const orderModal = document.getElementById("order-modal");
  if (orderModal) orderModal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// DOM INITIALIZATION FOR PRODUCT ORDERS (DIRECT MAILTO)
document.addEventListener("DOMContentLoaded", () => {
  if (window.feather) feather.replace();
  
  // Check if user is already signed in on page load
  checkAuthStatus();
  
  renderProductGrid();

  // STANDALONE RATING STAR PICKER
  const stars = document.querySelectorAll("#site-star-picker .star-btn");
  const feedbackLabel = document.getElementById("rating-feedback-label");
  const ratingInput = document.getElementById("selected-rating-value");
  
  if (stars.length > 0) {
    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        const val = index + 1;
        if (ratingInput) ratingInput.value = val;
        stars.forEach((s, i) => {
          if (i <= index) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
        if (feedbackLabel) feedbackLabel.innerText = `RATING: ${val}/5`;
      });
    });
  }

  // STANDARD PRODUCT ORDER FORM SUBMIT (DIRECT GMAIL HANDLER)
  const orderForm = document.getElementById("order-form");
  const orderStatusDiv = document.getElementById("product-order-status");

  if (orderForm) {
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const customerName = document.querySelector("#order-form input[name='customer_name']").value;
      const customerEmail = document.querySelector("#order-form input[name='customer_email']").value;
      const paymentMethod = document.querySelector("#order-form select[name='payment_method']").value;
      const notes = document.querySelector("#order-form textarea[name='notes']")?.value || "None provided";
      const productName = activeProduct ? activeProduct.name : "Digital Product";
      const productPrice = activeProduct ? activeProduct.price : "N/A";

      const recipientEmail = "wrightsdigit@gmail.com";
      const subject = encodeURIComponent(`New Product Order Request: ${productName}`);
      
      const bodyText = `Hello Wright's Digit,

I would like to place an order for the following item:

--------------------------------------------------
ORDER DETAILS
--------------------------------------------------
Product: ${productName}
Price: ${productPrice}
Payment Method: ${paymentMethod}

CUSTOMER INFORMATION
Name: ${customerName}
Email: ${customerEmail}

NOTES / INSTRUCTIONS:
${notes}

--------------------------------------------------
NOTE TO CUSTOMER: Please attach any reference files if needed before clicking send!
--------------------------------------------------`;

      const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

      if (orderStatusDiv) {
        orderStatusDiv.style.color = "#2e7d32";
        orderStatusDiv.innerText = "Opening your email app... Please review and click Send!";
      }

      window.location.href = mailtoLink;

      setTimeout(() => {
        closeModal("order-modal");
        orderForm.reset();
        if (orderStatusDiv) orderStatusDiv.innerText = "";
      }, 3500);
    });
  }
});

// ABOUT US MODAL HANDLERS
function openAboutModal() {
  const modal = document.getElementById("about-modal");
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeAboutModal() {
  const modal = document.getElementById("about-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// EMBROIDERY ORDER MODAL HANDLERS
function openEmbroideryModal() {
  const modal = document.getElementById("embroidery-modal");
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeEmbroideryModal() {
  const modal = document.getElementById("embroidery-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

// GLOBAL OUTSIDE-CLICK HANDLER FOR MODALS
window.addEventListener("click", function(event) {
  const aboutModal = document.getElementById("about-modal");
  const embroideryModal = document.getElementById("embroidery-modal");
  
  if (event.target === aboutModal) {
    aboutModal.style.display = "none";
  }
  if (event.target === embroideryModal) {
    embroideryModal.style.display = "none";
  }
});

// EMBROIDERY ORDER FORM SUBMISSION (DIRECT GMAIL / MAILTO HANDLER)
document.addEventListener("DOMContentLoaded", function() {
  const orderForm = document.getElementById("embroidery-order-form");
  const statusDiv = document.getElementById("form-status");

  if (orderForm) {
    orderForm.addEventListener("submit", function(e) {
      e.preventDefault();

      // Gather form fields
      const name = document.getElementById("cust-name").value;
      const email = document.getElementById("cust-email").value;
      const phone = document.getElementById("cust-phone").value;
      const company = document.getElementById("cust-company").value || "N/A";
      const width = document.getElementById("cust-width").value;
      const height = document.getElementById("cust-height").value;
      const format = document.querySelector("input[name='Required File Format']:checked")?.value || "Not specified";
      const placement = document.getElementById("cust-placement").value;
      const message = document.getElementById("cust-message").value || "None provided";

      const recipientEmail = "wrightsdigit@gmail.com";
      const subject = encodeURIComponent(`New Free Embroidery Digitizing Order - ${name}`);

      const bodyText = `Hello Wright's Digit,

I would like to place a custom Free Embroidery Digitizing Order. Here are my design specs:

--------------------------------------------------
CUSTOMER DETAILS
--------------------------------------------------
Full Name: ${name}
Email Address: ${email}
Phone Number: ${phone}
Company Name: ${company}

--------------------------------------------------
EMBROIDERY / DESIGN SPECIFICATIONS
--------------------------------------------------
Dimensions: ${width} (W) x ${height} (H)
Required File Format: ${format}
Placement Location: ${placement}

Special Instructions / Notes:
${message}

--------------------------------------------------
ATTACHMENT REMINDER FOR CUSTOMER:
Please attach your artwork/logo file (PNG, JPG, PDF, SVG, AI, PSD, CDR, etc.) to this email before hitting send!
--------------------------------------------------`;

      const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

      if (statusDiv) {
        statusDiv.style.color = "#2e7d32";
        statusDiv.innerText = "Opening your email app... Please attach your artwork file and hit Send!";
      }

      window.location.href = mailtoLink;

      setTimeout(() => {
        closeEmbroideryModal();
        orderForm.reset();
        if (statusDiv) statusDiv.innerText = "";
      }, 4000);
    });
  }
});
