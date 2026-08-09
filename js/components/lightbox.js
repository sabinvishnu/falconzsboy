/* ==========================================================================
   FALCON // ATELIER - LIGHTBOX & EXIF INSPECTOR COMPONENT
   ========================================================================== */

const LightboxComponent = {
  currentPhotoIndex: 0,
  photosList: [],
  isZoomed: false,

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const modal = document.getElementById('lightbox-modal');
    const backdrop = document.getElementById('lightbox-backdrop');
    const closeBtn = document.getElementById('lb-close-btn');
    const prevBtn = document.getElementById('lb-prev-btn');
    const nextBtn = document.getElementById('lb-next-btn');
    const infoToggleBtn = document.getElementById('lb-info-toggle-btn');
    const zoomBtn = document.getElementById('lb-zoom-btn');
    const favBtn = document.getElementById('lb-fav-btn');
    const orderPrintBtn = document.getElementById('lb-order-print-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    if (infoToggleBtn) {
      infoToggleBtn.addEventListener('click', () => {
        const exifPanel = document.getElementById('exif-panel');
        if (exifPanel) exifPanel.classList.toggle('open');
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => this.toggleZoom());
    }

    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const currentPhoto = this.photosList[this.currentPhotoIndex];
        if (currentPhoto) {
          MoodboardComponent.toggleFavorite(currentPhoto.id);
          this.updateFavButton();
          GalleryComponent.render();
        }
      });
    }

    if (orderPrintBtn) {
      orderPrintBtn.addEventListener('click', () => {
        const currentPhoto = this.photosList[this.currentPhotoIndex];
        this.close();
        if (PrintShopComponent) {
          PrintShopComponent.selectArtwork(currentPhoto.id);
          const printSection = document.getElementById('printshop-section');
          if (printSection) printSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Touch Swipe Gestures for Mobile
    if (modal) {
      let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
      modal.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx > 40 && absDx > absDy) {
          if (dx < 0) this.next();
          else this.prev();
        } else if (absDy > 70 && dy > 0 && absDy > absDx) {
          this.close();
        }
      }, { passive: true });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  },

  preloadImage(url) {
    if (!url) return;
    if (!this._preloadCache) this._preloadCache = {};
    if (this._preloadCache[url]) return;
    const img = new Image();
    img.src = url;
    img.decode().catch(() => {}); // pre-decode in background
    this._preloadCache[url] = img;
  },

  open(photoId) {
    this.photosList = GalleryComponent.getFilteredPhotos();
    if (this.photosList.length === 0) this.photosList = PHOTOS_DATA;

    this.currentPhotoIndex = this.photosList.findIndex(p => p.id === photoId);
    if (this.currentPhotoIndex === -1) this.currentPhotoIndex = 0;

    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    this.renderCurrentPhoto();
  },

  close() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    this.isZoomed = false;
    const imgWrapper = document.getElementById('lb-image-wrapper');
    if (imgWrapper) imgWrapper.style.transform = 'scale(1)';
  },

  prev() {
    this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.photosList.length) % this.photosList.length;
    this.renderCurrentPhoto();
  },

  next() {
    this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photosList.length;
    this.renderCurrentPhoto();
  },

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    const imgWrapper = document.getElementById('lb-image-wrapper');
    if (imgWrapper) {
      imgWrapper.style.transform = this.isZoomed ? 'scale(1.7)' : 'scale(1)';
      imgWrapper.style.cursor = this.isZoomed ? 'zoom-out' : 'zoom-in';
    }
  },

  updateFavButton() {
    const favBtn = document.getElementById('lb-fav-btn');
    const currentPhoto = this.photosList[this.currentPhotoIndex];
    if (!favBtn || !currentPhoto) return;

    const isFav = MoodboardComponent.isFavorite(currentPhoto.id);
    favBtn.innerHTML = `<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isFav ? 'color:#ff3366;' : ''}"></i>`;
  },

  renderCurrentPhoto() {
    const photo = this.photosList[this.currentPhotoIndex];
    if (!photo) return;

    // Counter
    const counter = document.getElementById('lb-counter');
    if (counter) {
      counter.textContent = `Photo ${this.currentPhotoIndex + 1} of ${this.photosList.length}`;
    }

    // Image
    const img = document.getElementById('lb-image');
    const loader = document.getElementById('lb-loader') || document.getElementById('lightbox-loader');

    if (img) {
      if (!this._preloadCache) this._preloadCache = {};
      const tempImg = this._preloadCache[photo.url] || new Image();
      if (!this._preloadCache[photo.url]) {
        tempImg.src = photo.url;
        this._preloadCache[photo.url] = tempImg;
      }

      let isSlow = false;
      const slowTimeout = setTimeout(() => {
        isSlow = true;
        img.style.opacity = '0.3';
        if (loader) loader.style.display = 'block';
      }, 150);

      const showImage = () => {
        clearTimeout(slowTimeout);
        if (this.photosList[this.currentPhotoIndex] === photo) {
          img.src = photo.url;
          img.alt = photo.title;
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
          if (loader) loader.style.display = 'none';

          // Preload next and prev photos for instant zero-lag navigation
          const nextPhoto = this.photosList[(this.currentPhotoIndex + 1) % this.photosList.length];
          const prevPhoto = this.photosList[(this.currentPhotoIndex - 1 + this.photosList.length) % this.photosList.length];
          if (nextPhoto) this.preloadImage(nextPhoto.url);
          if (prevPhoto) this.preloadImage(prevPhoto.url);
        }
      };

      if (tempImg.complete) {
        tempImg.decode().then(showImage).catch(() => showImage());
      } else {
        tempImg.onload = () => {
          tempImg.decode().then(showImage).catch(() => showImage());
        };
      }
    }

    // EXIF Information
    const title = document.getElementById('exif-title');
    const location = document.getElementById('exif-location');
    const camera = document.getElementById('exif-camera');
    const lens = document.getElementById('exif-lens');
    const aperture = document.getElementById('exif-aperture');
    const shutter = document.getElementById('exif-shutter');
    const iso = document.getElementById('exif-iso');
    const focal = document.getElementById('exif-focal');
    const desc = document.getElementById('exif-desc');

    if (title) title.textContent = photo.title;
    if (location) location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${photo.location}`;
    if (camera) camera.textContent = photo.camera;
    if (lens) lens.textContent = photo.lens;
    if (aperture) aperture.textContent = photo.aperture;
    if (shutter) shutter.textContent = photo.shutterSpeed;
    if (iso) iso.textContent = photo.iso;
    if (focal) focal.textContent = photo.focalLength;
    if (desc) desc.textContent = photo.description;

    // Color Palette Extraction Swatches
    const paletteContainer = document.getElementById('exif-palette');
    if (paletteContainer && photo.colorPalette) {
      paletteContainer.innerHTML = photo.colorPalette.map(hex => `
        <div class="palette-swatch" style="background-color: ${hex}" data-hex="${hex}" title="Copy HEX ${hex}"></div>
      `).join('');

      paletteContainer.querySelectorAll('.palette-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
          const hex = swatch.dataset.hex;
          navigator.clipboard.writeText(hex);
          App.showToast(`Copied ${hex} to clipboard!`);
        });
      });
    }

    this.updateFavButton();

    // Trigger shutter audio if enabled
    if (App.audioEnabled) App.playShutterSound();
  }
};
