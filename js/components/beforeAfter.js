/* ==========================================================================
   FALCON // ATELIER - BEFORE / AFTER SPLIT COMPARISON SLIDER
   ========================================================================== */

const BeforeAfterComponent = {
  isDragging: false,
  presetIndex: 0,

  presets: [
    {
      name: "Patagonia Alpine Peaks",
      tech: "Hasselblad X2D • 38mm f/2.5",
      after: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
      before: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop&sat=-70&con=-30"
    },
    {
      name: "Himalayan Sunrise Ridge",
      tech: "Sony A1 • 24-70mm f/2.8",
      after: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
      before: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop&sat=-60"
    },
    {
      name: "Dolomites Autumn Mist",
      tech: "Leica M11 • 50mm f/1.4",
      after: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop",
      before: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1600&auto=format&fit=crop&sat=-50"
    }
  ],

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const container = document.getElementById('before-after-container');
    const handle = document.getElementById('ba-slider-handle');
    if (!container || !handle) return;

    const moveSlider = (clientX) => {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      
      handle.style.left = `${percentage}%`;
      const beforeLayer = document.getElementById('ba-before-layer');
      if (beforeLayer) beforeLayer.style.width = `${percentage}%`;
    };

    // Mouse Events
    handle.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      e.preventDefault();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) moveSlider(e.clientX);
    });

    // Touch Events
    handle.addEventListener('touchstart', (e) => {
      this.isDragging = true;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches[0]) moveSlider(e.touches[0].clientX);
    });

    // Preset Switchers
    document.querySelectorAll('.ba-preset-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ba-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadPreset(idx);
      });
    });
  },

  loadPreset(idx) {
    const preset = this.presets[idx];
    if (!preset) return;

    const afterImg = document.getElementById('ba-after-img');
    const beforeImg = document.getElementById('ba-before-img');

    if (afterImg) afterImg.src = preset.after;
    if (beforeImg) beforeImg.src = preset.before;
  }
};
