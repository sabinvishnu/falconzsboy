/* ==========================================================================
   FALCON // ATELIER - MOODBOARD & FAVORITES COMPONENT
   ========================================================================== */

const MoodboardComponent = {
  favorites: new Set(),

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateCounter();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('falcon_fav_photos');
      if (saved) {
        const arr = JSON.parse(saved);
        this.favorites = new Set(arr);
      }
    } catch (e) {
      console.warn('LocalStorage access restricted:', e);
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('falcon_fav_photos', JSON.stringify([...this.favorites]));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  isFavorite(photoId) {
    return this.favorites.has(photoId);
  },

  toggleFavorite(photoId) {
    if (this.favorites.has(photoId)) {
      this.favorites.delete(photoId);
      App.showToast('Removed from your collection');
    } else {
      this.favorites.add(photoId);
      App.showToast('Saved to your collection!');
    }

    this.saveToStorage();
    this.updateCounter();
    this.renderDrawer();
  },

  updateCounter() {
    const badge = document.getElementById('fav-count');
    if (badge) badge.textContent = this.favorites.size;
  },

  bindEvents() {
    const toggleBtn = document.getElementById('moodboard-toggle-btn');
    const closeBtn = document.getElementById('moodboard-close-btn');
    const backdrop = document.getElementById('moodboard-backdrop');
    const clearBtn = document.getElementById('clear-moodboard-btn');
    const shareBtn = document.getElementById('share-moodboard-btn');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.open());
    }

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.favorites.clear();
        this.saveToStorage();
        this.updateCounter();
        this.renderDrawer();
        GalleryComponent.render();
        App.showToast('Collection cleared');
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.origin + window.location.pathname + '#moodboard=' + [...this.favorites].join(',');
        navigator.clipboard.writeText(url);
        App.showToast('Collection share link copied to clipboard!');
      });
    }
  },

  open() {
    const drawer = document.getElementById('moodboard-drawer');
    if (drawer) drawer.classList.add('active');
    this.renderDrawer();
  },

  close() {
    const drawer = document.getElementById('moodboard-drawer');
    if (drawer) drawer.classList.remove('active');
  },

  renderDrawer() {
    const container = document.getElementById('moodboard-items-container');
    if (!container) return;

    if (this.favorites.size === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-regular fa-heart" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
          <p>Your curated collection is empty.</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem;">Click the heart icon on any photograph to save it here.</p>
        </div>
      `;
      return;
    }

    const favPhotos = PHOTOS_DATA.filter(p => this.favorites.has(p.id));

    container.innerHTML = favPhotos.map(photo => `
      <div class="mood-item">
        <img src="${photo.url}" alt="${photo.title}">
        <div class="mood-item-info">
          <h4>${photo.title}</h4>
          <p>${photo.location}</p>
        </div>
        <button class="icon-btn" style="width: 32px; height: 32px;" onclick="MoodboardComponent.toggleFavorite('${photo.id}'); GalleryComponent.render();">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');
  }
};
