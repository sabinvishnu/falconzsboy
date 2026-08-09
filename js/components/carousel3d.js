/* ==========================================================================
   FALCON // ATELIER - 3D CAROUSEL COMPONENT
   ========================================================================== */

const Carousel3DComponent = {
  currentIndex: 0,
  photos: [],

  init() {
    if (typeof PHOTOS_DATA === 'undefined') return;
    this.photos = PHOTOS_DATA.slice(0, 7); // Select top photos for 3D showcase
    this.render();
    this.bindEvents();
    this.update3DLayout();
  },

  render() {
    const stage = document.getElementById('carousel-3d-stage');
    if (!stage) return;

    // Pure 3D photo cards without text overlays with lazy load support
    stage.innerHTML = this.photos.map((photo, i) => `
      <div class="carousel-3d-card" data-index="${i}">
        <img data-src="${photo.url}" alt="${photo.title}">
      </div>
    `).join('');
  },

  bindEvents() {
    const prevBtn = document.getElementById('carousel-3d-prev');
    const nextBtn = document.getElementById('carousel-3d-next');
    const stage = document.getElementById('carousel-3d-stage');
    const container = document.getElementById('carousel-3d-container');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Mouse Wheel Scroll Rotation
    if (container) {
      let isScrolling = false;
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (isScrolling) return;
        isScrolling = true;

        if (e.deltaY > 0) {
          this.next();
        } else if (e.deltaY < 0) {
          this.prev();
        }

        setTimeout(() => { isScrolling = false; }, 280);
      }, { passive: false });
    }

    if (stage) {
      stage.addEventListener('click', (e) => {
        const card = e.target.closest('.carousel-3d-card');
        if (!card) return;
        const index = parseInt(card.dataset.index, 10);
        if (index === this.currentIndex) {
          // Open lightbox on center card click
          if (typeof LightboxComponent !== 'undefined') {
            LightboxComponent.open(this.photos[index].id);
          }
        } else {
          this.currentIndex = index;
          this.update3DLayout();
        }
      });
    }

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      const container = document.getElementById('carousel-3d-container');
      if (!container || container.style.display === 'none') return;

      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      }
    });
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.update3DLayout();
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.update3DLayout();
  },

  update3DLayout() {
    const cards = document.querySelectorAll('.carousel-3d-card');
    const counter = document.getElementById('carousel-3d-counter');
    const total = this.photos.length;

    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${total}`;
    }

    cards.forEach((card, i) => {
      let offset = i - this.currentIndex;
      
      // Wrap around for infinite 3D cylinder layout
      if (offset > Math.floor(total / 2)) offset -= total;
      if (offset < -Math.floor(total / 2)) offset += total;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      // Lazy load image when it is near visible range (active card or its direct neighbors) and decode off main thread
      if (absOffset <= 3) {
        const img = card.querySelector('img');
        if (img && !img.src) {
          img.src = img.dataset.src;
          img.decode().catch(() => {});
        }
      }

      if (offset === 0) {
        // Active Center Card
        card.style.visibility = 'visible';
        card.style.transform = `translateX(0px) translateZ(140px) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.filter = 'brightness(1.05)';
        card.style.zIndex = '10';
      } else if (absOffset === 1) {
        // Side Cards
        card.style.visibility = 'visible';
        card.style.transform = `translateX(${sign * 300}px) translateZ(-90px) rotateY(${sign * -28}deg)`;
        card.style.opacity = '0.78';
        card.style.filter = 'brightness(0.7)';
        card.style.zIndex = '5';
      } else if (absOffset === 2) {
        // Outer Side Cards
        card.style.visibility = 'visible';
        card.style.transform = `translateX(${sign * 520}px) translateZ(-240px) rotateY(${sign * -45}deg)`;
        card.style.opacity = '0.45';
        card.style.filter = 'brightness(0.4)';
        card.style.zIndex = '2';
      } else {
        // Hidden Back Cards
        card.style.visibility = 'hidden';
        card.style.transform = `translateX(${sign * 680}px) translateZ(-380px) rotateY(${sign * -60}deg)`;
        card.style.opacity = '0';
        card.style.filter = 'brightness(0.2)';
        card.style.zIndex = '0';
      }
    });
  }
};
