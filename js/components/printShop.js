/* ==========================================================================
   FALCON // ATELIER - PRINT SHOP & FRAME VISUALIZER COMPONENT
   ========================================================================== */

const PrintShopComponent = {
  selectedArtworkId: null,
  selectedSize: '24x36',
  basePrice: 550,
  selectedFrame: 'walnut',
  framePrice: 120,
  frameNames: {
    'walnut': 'Gallery Walnut',
    'black-metal': 'Matte Black Metal',
    'acrylic': 'Frameless Acrylic',
    'canvas': 'Archival Canvas'
  },

  init() {
    this.populateDropdown();
    this.bindEvents();
    this.updateSummary();
  },

  populateDropdown() {
    const dropdown = document.getElementById('print-artwork-select');
    if (!dropdown) return;

    dropdown.innerHTML = PHOTOS_DATA.map(p => `
      <option value="${p.id}">${p.title} — (${p.location})</option>
    `).join('');

    this.selectedArtworkId = PHOTOS_DATA[0].id;
  },

  bindEvents() {
    // Artwork Dropdown Select
    const dropdown = document.getElementById('print-artwork-select');
    if (dropdown) {
      dropdown.addEventListener('change', (e) => {
        this.selectArtwork(e.target.value);
      });
    }

    // Size Pills
    const sizeContainer = document.getElementById('print-size-options');
    if (sizeContainer) {
      sizeContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.option-pill');
        if (!pill) return;

        sizeContainer.querySelectorAll('.option-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        this.selectedSize = pill.dataset.size;
        this.basePrice = parseInt(pill.dataset.price, 10);
        this.updateFrameMockupSize();
        this.updateSummary();
      });
    }

    // Frame Pills
    const frameContainer = document.getElementById('print-frame-options');
    if (frameContainer) {
      frameContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.option-pill');
        if (!pill) return;

        frameContainer.querySelectorAll('.option-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        this.selectedFrame = pill.dataset.frame;
        this.framePrice = parseInt(pill.dataset.framePrice, 10);
        this.updateFrameMockupStyle();
        this.updateSummary();
      });
    }

    // Inquire Button
    const inquireBtn = document.getElementById('inquire-print-btn');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', () => {
        const photo = PHOTOS_DATA.find(p => p.id === this.selectedArtworkId);
        const artworkTitle = photo ? photo.title : 'Selected Artwork';
        
        // Open booking modal with prefilled details
        BookingFormComponent.open({
          type: 'print-custom',
          message: `Inquiry for Fine Art Print:\nArtwork: "${artworkTitle}"\nSize: ${this.selectedSize}\nFrame: ${this.frameNames[this.selectedFrame]}\nEstimated Price: $${this.basePrice + this.framePrice} USD`
        });
      });
    }
  },

  selectArtwork(photoId) {
    this.selectedArtworkId = photoId;
    const photo = PHOTOS_DATA.find(p => p.id === photoId);
    if (!photo) return;

    const previewImg = document.getElementById('print-preview-img');
    if (previewImg) previewImg.src = photo.url;

    const dropdown = document.getElementById('print-artwork-select');
    if (dropdown) dropdown.value = photoId;
  },

  updateFrameMockupSize() {
    const frameContainer = document.getElementById('artwork-frame-container');
    if (frameContainer) {
      frameContainer.className = `artwork-frame-container frame-${this.selectedFrame} size-${this.selectedSize}`;
    }
  },

  updateFrameMockupStyle() {
    const frameContainer = document.getElementById('artwork-frame-container');
    if (frameContainer) {
      frameContainer.className = `artwork-frame-container frame-${this.selectedFrame} size-${this.selectedSize}`;
    }
  },

  updateSummary() {
    const sizeSpan = document.getElementById('summary-size');
    const basePriceSpan = document.getElementById('summary-base-price');
    const frameNameSpan = document.getElementById('summary-frame-name');
    const framePriceSpan = document.getElementById('summary-frame-price');
    const totalPriceSpan = document.getElementById('print-total-price');

    if (sizeSpan) sizeSpan.textContent = this.selectedSize.replace('x', '" × ') + '"';
    if (basePriceSpan) basePriceSpan.textContent = `$${this.basePrice}`;
    if (frameNameSpan) frameNameSpan.textContent = this.frameNames[this.selectedFrame];
    if (framePriceSpan) framePriceSpan.textContent = `$${this.framePrice}`;
    
    const total = this.basePrice + this.framePrice;
    if (totalPriceSpan) totalPriceSpan.textContent = `$${total} USD`;
  }
};
