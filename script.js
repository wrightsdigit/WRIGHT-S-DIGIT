// PRODUCT CATALOG WITH MULTI-IMAGE GALLERIES
const products = [
  {
    id: "p1",
    name: "png to DST",
    price: "$5",
    images: ["product1.png", "product1-2.jpg", "product1-3.jpg", "product1-4.jpg"],
    description: "We convert your normal png,jpg files to machine working PES,DST.EPS,CDR files to help you work faster",
    likes: 124,
    rating: 4.8,
    reviews: [
      { user: "Alex M.", text: "Very fast response time and high quality files mine was PES!", rating: 5 },
      { user: "Sarah T.", text: "I got my file in just a couple of hours.What a lightning fast service .I rate it 4.5", rating: 4.5 }
    ]
  },
  {
    id: "p2",
    name: "PNG monogram file to DST",
    price: "$5",
    images: ["product2.png", "product2-2.jpg", "product2-3.jpg"],
    description: "We gurentee you this type of clean output with our provided high quality machine running files.",
    likes: 89,
    rating: 5.0,
    reviews: [
      { user: "David K.", text: "Saved my time a lot.I give it a 5 star rating!.", rating: 5 }
    ]
  }
];

let activeProduct = null;

// GOOGLE AUTHENTICATION HANDLERS
function handleGoogleSignIn(response) {
  try {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    localStorage.setItem("userEmail", payload.email);
    localStorage.setItem("userName", payload.name);

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

// SAFE PRODUCT GRID RENDERING (Pure catalog view - No order buttons)
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

// PRODUCT DETAIL POPUP MODAL
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

  const detailModal = document.getElementById("product-detail-modal");
  if (detailModal) detailModal.style.display = "flex";
  
  if (window.feather) feather.replace();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// EMBROIDERY ORDER MODAL CONTROLLERS (TRIGGERED BY THE MAIN TOP BUTTON)
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

// ABOUT US MODAL HANDLERS
function openAboutModal() {
  const modal = document.getElementById("about-modal");
  if (modal) modal.style.display = "flex";
}

function closeAboutModal() {
  const modal = document.getElementById("about-modal");
  if (modal) modal.style.display = "none";
}

// GLOBAL OUTSIDE-CLICK DISMISS FOR MODALS
window.addEventListener("click", function(event) {
  const modals = [
    "about-modal",
    "embroidery-modal",
    "product-detail-modal",
    "order-modal",
    "auth-modal"
  ];
  modals.forEach(id => {
    const m = document.getElementById(id);
    if (m && event.target === m) {
      m.style.display = "none";
    }
  });
});

// INITIALIZE SYSTEM & FORM HANDLERS
document.addEventListener("DOMContentLoaded", () => {
  if (window.feather) feather.replace();
  
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

  // MAIN FREE EMBROIDERY DIGITIZING FORM SUBMISSION (MAILTO GENERATOR)
  const embroideryForm = document.getElementById("embroidery-order-form");
  const embroideryStatusDiv = document.getElementById("form-status");

  if (embroideryForm) {
    embroideryForm.addEventListener("submit", function(e) {
      e.preventDefault();

      // Collect customer form details
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

      if (embroideryStatusDiv) {
        embroideryStatusDiv.style.color = "#2e7d32";
        embroideryStatusDiv.innerText = "Opening your email app... Please attach your artwork file and hit Send!";
      }

      // Trigger the default email client (Gmail, Outlook, Mail app, etc.)
      window.location.href = mailtoLink;

      setTimeout(() => {
        closeEmbroideryModal();
        embroideryForm.reset();
        if (embroideryStatusDiv) embroideryStatusDiv.innerText = "";
      }, 4000);
    });
  }
});
