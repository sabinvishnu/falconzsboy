/* ==========================================================================
   FALCON // ATELIER - BOOKING & CONTACT COMPONENT
   ========================================================================== */

const BookingFormComponent = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const openBtn = document.getElementById('open-booking-btn');
    const closeBtn = document.getElementById('booking-close-btn');
    const cancelBtn = document.getElementById('booking-cancel-btn');
    const backdrop = document.getElementById('booking-backdrop');
    const form = document.getElementById('booking-form');

    if (openBtn) openBtn.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById('client-name').value;
        App.showToast(`Thank you, ${clientName}! Your inquiry has been submitted.`);
        
        form.reset();
        this.close();
      });
    }
  },

  open(options = {}) {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    if (options.type) {
      const typeSelect = document.getElementById('shoot-type');
      if (typeSelect) typeSelect.value = options.type;
    }

    if (options.message) {
      const msgArea = document.getElementById('shoot-message');
      if (msgArea) msgArea.value = options.message;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
