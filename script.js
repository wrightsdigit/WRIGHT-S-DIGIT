// Sample Product Data
const products = [
  {
    id: 1,
    title: "Cyber Skull Embroidered Patch",
    category: "PATCH",
    price: "$18.00",
    description: "High-density 100% embroidered patch with iron-on backing and reinforced merrowed border.",
    images: [
      "https://picsum.photos/id/1062/400/300",
      "https://picsum.photos/id/1025/400/300"
    ],
    specs: ["Stitch Count: 14,200", "Dimensions: 3.5\" x 3.5\"", "Thread: Madeira Rayon", "Backing: Heat-seal Iron-On"]
  },
  {
    id: 2,
    title: "Custom Digitized Logo File",
    category: "DIGITIZING",
    price: "$25.00",
    description: "Manual digitizing service tailored for left-chest or hat placements with zero puckering guaranteed.",
    images: [
      "https://picsum.photos/id/1069/400/300",
      "https://picsum.photos/id/1060/400/300"
    ],
    specs: ["Formats: DST, PES, EXP, EMB", "Turnaround: 24 Hours", "Free Revisions: Unlimited minor tweaks"]
  },
  {
    id: 3,
    title: "Vintage Botanical Hoodie",
    category: "APPAREL",
    price: "$65.00",
    description: "Heavyweight 400GSM cotton hoodie featuring direct-to-garment chest and sleeve embroidery.",
    images: [
      "https://picsum.photos/id/1005/400/300",
      "https://picsum.photos/id/1011/400/300"
    ],
    specs: ["Stitch Count: 28,500", "Material: 100% Organic Cotton", "Fit: Oversized Streetwear"]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // 1. STITCH PRELOADER LOGIC
  const preloader = document.getElementById("stitch-preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("fade-out");
    }, 1100);
  }

  // 2. MODAL HELPER FUNCTIONS
  const openModal = (modal) => modal && modal.classList.add("active");
  const closeModal = (modal) => modal && modal.classList.remove("active");

  // Digitizing Modal
  const digitizingModal = document.getElementById("digitizing-modal");
  const openDigitizingBtns = [
    document.getElementById("open-digitizing-btn"),
    document.getElementById("footer-digitizing-btn")
  ];
  const closeDigitizingBtn = document.getElementById("close-digitizing-btn");

  openDigitizingBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", () => openModal(digitizingModal));
  });
  if (closeDigitizingBtn) closeDigitizingBtn.addEventListener("click", () => closeModal(digitizingModal));

  // About Modal
  const aboutModal = document.getElementById("about-modal");
  const openAboutBtn = document.getElementById("open-about-link");
  const closeAboutBtn = document.getElementById("close-about-btn");

  if (openAboutBtn) {
    openAboutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(aboutModal);
    });
  }
  if (closeAboutBtn) closeAboutBtn.addEventListener("click", () => closeModal(aboutModal));

  // Close modals when clicking overlay background
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target);
    }
  });

  // 3. DIGITIZING FORM SUBMISSION
  const digitizingForm = document.getElementById("digitizing-form");
  if (digitizingForm) {
    digitizingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your digitizing quote request has been received. We will respond within 12 hours.");
      closeModal(digitizingModal);
      digitizingForm.reset();
    });
  }

  // 4. PRODUCT GRID POPULATION & DETAIL MODAL (FOR PRODUCTS.HTML)
  const productGrid = document.getElementById("product-grid");
  const productModal = document.getElementById("product-modal");
  const closeProductBtn = document.getElementById("close-product-btn");

  if (productGrid) {
    // Render product cards
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.images[0]}" alt="${product.title}" class="product-image">
        <span class="badge">${product.category}</span>
        <h3>${product.title}</h3>
        <p class="price">${product.price}</p>
      `;
      card.addEventListener("click", () => showProductDetails(product));
      productGrid.appendChild(card);
    });
  }

  if (closeProductBtn) closeProductBtn.addEventListener("click", () => closeModal(productModal));

  function showProductDetails(product) {
    document.getElementById("modal-title").textContent = product.title;
    document.getElementById("modal-badge").textContent = product.category;
    document.getElementById("modal-price").textContent = product.price;
    document.getElementById("modal-description").textContent = product.description;

    const mainImg = document.getElementById("modal-main-image");
    mainImg.src = product.images[0];

    // Populate thumbnails
    const thumbContainer = document.getElementById("modal-thumbnails");
    thumbContainer.innerHTML = "";
    product.images.forEach((imgUrl, idx) => {
      const thumb = document.createElement("img");
      thumb.src = imgUrl;
      thumb.className = `thumbnail-img ${idx === 0 ? 'active' : ''}`;
      thumb.addEventListener("click", () => {
        mainImg.src = imgUrl;
        document.querySelectorAll(".thumbnail-img").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
      thumbContainer.appendChild(thumb);
    });

    // Populate specs
    const specList = document.getElementById("modal-specs");
    specList.innerHTML = "";
    product.specs.forEach(spec => {
      const li = document.createElement("li");
      li.textContent = spec;
      specList.appendChild(li);
    });

    openModal(productModal);
  }
});
