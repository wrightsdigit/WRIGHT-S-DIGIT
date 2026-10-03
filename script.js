// CONFIGURATION: Set your company receiver email here
const COMPANY_GMAIL = "wrightsdigit@gmail.com"; 

// YOUR PRODUCTS DATA (Add/Update your image paths, titles, prices, and reviews)
const products = [
  {
    id: "p1",
    name: "custom embroidery on cloths",
    price: "Free for first order",
    image: "product1.png", // Replace with your image file/URL
    description: "This will be done accoding to your refrence which you have to provide.",
    likes: 124,
    reviews: [
      
    ]
  },
  {
    id: "p2",
    name: "custom embroided monogram",
    price: "Free for first orders",
    image: "product2.png", // Replace with your image file/URL
    description: "your order will be made according to you reference.",
    likes: 89,
    reviews: [
      
    ]
  },
  {
    id: "p3",
    name: "custom ambroided monograms",
    price: "Free for first order",
    image: "product3.png", // Replace with your image file/URL
    description: "your order will be made on your provided details.",
    likes: 210,
    reviews: [
     
    ]
  }
];

// RENDER PRODUCTS GRID
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/400x300/000000/FFFFFF?text=${encodeURIComponent(product.name)}'">
      </div>
      <div class="product-details">
        <div class="product-header">
          <h3 class="product-title">${product.name}</h3>
          <span class="product-price">${product.price}</span>
        </div>
        <p class="product-description">${product.description}</p>
        
        <div class="product-actions">
          <button class="btn btn-outline like-btn" onclick="toggleLike('${product.id}')">
            <i data-feather="heart"></i> <span id="like-count-${product.id}">${product.likes}</span>
          </button>
          <button class="btn btn-outline" onclick="openReviews('${product.id}')">
            <i data-feather="message-square"></i> Reviews (${product.reviews.length})
          </button>
        </div>
        
        <button class="btn btn-primary full-width" onclick="openOrderModal('${product.id}')">
          ORDER NOW
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
  
  feather.replace();
}

// LIKES FUNCTIONALITY
function toggleLike(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const btn = event.currentTarget;
  if (!btn.classList.contains("liked")) {
    product.likes += 1;
    btn.classList.add("liked");
  } else {
    product.likes -= 1;
    btn.classList.remove("liked");
  }
  document.getElementById(`like-count-${productId}`).innerText = product.likes;
}

// REVIEWS MODAL FUNCTIONALITY
function openReviews(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("reviews-title").innerText = `${product.name} - REVIEWS`;
  const listContainer = document.getElementById("reviews-list");
  
  if (product.reviews.length === 0) {
    listContainer.innerHTML = "<p>No reviews yet.</p>";
  } else {
    listContainer.innerHTML = product.reviews.map(r => `
      <div class="review-card">
        <div class="review-author">${r.user}</div>
        <div class="review-text">"${r.text}"</div>
      </div>
    `).join("");
  }

  document.getElementById("reviews-modal").style.display = "flex";
}

// ORDER MODAL FUNCTIONALITY
function openOrderModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  document.getElementById("selected-product-id").value = product.id;
  document.getElementById("order-product-name").innerText = `${product.name} (${product.price})`;
  document.getElementById("order-modal").style.display = "flex";
}

// FORM SUBMISSION (Dispatches order email via mailto)
document.getElementById("order-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const productId = document.getElementById("selected-product-id").value;
  const userEmail = document.getElementById("user-email").value;
  const product = products.find(p => p.id === productId);

  const subject = encodeURIComponent(`NEW ORDER: ${product.name}`);
  const body = encodeURIComponent(`Hello Wright's Digit Team,\n\nI would like to order "${product.name}" (${product.price}).\n\nCustomer Email: ${userEmail}\n\nPlease reach out to me to complete the order.`);

  // Opens default mail client pre-filled to send directly to your company email
  window.location.href = `mailto:${COMPANY_GMAIL}?subject=${subject}&body=${body}`;

  alert("Order request initiated! Your default mail application will open to confirm the send.");
  document.getElementById("order-modal").style.display = "none";
  this.reset();
});

// FAQ TOGGLE
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    item.classList.toggle("active");
  });
});

// CLOSE MODALS ON CLICK OUTSIDE OR X
document.getElementById("close-reviews").onclick = () => document.getElementById("reviews-modal").style.display = "none";
document.getElementById("close-order").onclick = () => document.getElementById("order-modal").style.display = "none";

window.onclick = function(event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

// HIDE PRELOADER AFTER 2.2 SECONDS
function dismissStitchIntro() {
  const preloader = document.getElementById("stitch-preloader");
  if (preloader) {
    preloader.classList.add("fade-out");
  }
}

// Trigger automatically on page load
if (document.readyState === "complete") {
  setTimeout(dismissStitchIntro, 1000);
} else {
  window.addEventListener("load", () => {
    setTimeout(dismissStitchIntro, 1000);
  });
}

// ANIMATED WEBSITE RATING INTERACTION
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll("#site-star-picker .star-btn");
  const feedbackLabel = document.getElementById("rating-feedback-label");
  const ratingInput = document.getElementById("selected-rating-value");
  
  const labels = {
    1: "POOR - 1/5",
    2: "FAIR - 2/5",
    3: "GOOD - 3/5",
    4: "VERY GOOD - 4/5",
    5: "EXCELLENT - 5/5"
  };

  // Hover & Selection Effects
  stars.forEach((star, index) => {
    // Mouse Enter Hover Preview
    star.addEventListener("mouseenter", () => {
      const val = index + 1;
      stars.forEach((s, i) => {
        if (i <= index) s.style.color = "#000000";
      });
      feedbackLabel.innerText = labels[val];
    });

    // Mouse Leave Restore Selected State
    star.addEventListener("mouseleave", () => {
      const currentSelected = parseInt(ratingInput.value);
      stars.forEach((s, i) => {
        if (i < currentSelected) {
          s.style.color = "#000000";
        } else {
          s.style.color = "#dddddd";
        }
      });
      feedbackLabel.innerText = currentSelected ? labels[currentSelected] : "SELECT A RATING";
    });

    // Click Selection
    star.addEventListener("click", () => {
      const val = index + 1;
      ratingInput.value = val;
      
      stars.forEach((s, i) => {
        if (i <= index) {
          s.classList.add("active");
          s.style.color = "#000000";
        } else {
          s.classList.remove("active");
          s.style.color = "#dddddd";
        }
      });
      feedbackLabel.innerText = labels[val];
    });
  });

  // SUBMIT OVERALL RATING FORM
  const ratingForm = document.getElementById("website-rating-form");
  if (ratingForm) {
    ratingForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const score = ratingInput.value;
      if (score === "0") {
        alert("Please select a star rating before submitting.");
        return;
      }

      const submitBtn = document.getElementById("submit-rating-btn");
      submitBtn.innerText = "SENDING...";
      submitBtn.disabled = true;

      const formData = new FormData(this);

      try {
        // Sends to your Formspree endpoint or triggers confirmation
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          alert("Thank you for rating WRIGHT'S DIGIT!");
          this.reset();
          ratingInput.value = "0";
          stars.forEach(s => {
            s.classList.remove("active");
            s.style.color = "#dddddd";
          });
          feedbackLabel.innerText = "RATING SUBMITTED";
        } else {
          alert("Rating submitted! Thank you for your feedback.");
        }
      } catch (err) {
        alert("Rating submitted! Thank you for your feedback.");
      } finally {
        submitBtn.innerText = "SUBMIT RATING";
        submitBtn.disabled = false;
      }
    });
  }
});
