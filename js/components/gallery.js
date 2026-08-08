/* ==========================================================================
   FALCON // ATELIER - GALLERY COMPONENT
   ========================================================================== */

const GalleryComponent = {
  activeCategory: 'all',
  searchQuery: '',
  activeGridCols: '2',

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    // Category Tabs
    const categoryTabs = document.getElementById('category-tabs');
    if (categoryTabs) {
      categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;
        
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.activeCategory = btn.dataset.category;
        this.render();
      });
    }

    // Live Search Input
    const searchInput = document.getElementById('gallery-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        if (clearBtn) {
          clearBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
        this.render();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.searchQuery = '';
        clearBtn.style.display = 'none';
        this.render();
      });
    }

    // Grid Density & 3D Carousel View Switcher
    const gridSwitcher = document.getElementById('grid-density-switcher');
    if (gridSwitcher) {
      gridSwitcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.grid-view-btn');
        if (!btn) return;
        
        document.querySelectorAll('.grid-view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const cols = btn.dataset.cols;
        this.activeGridCols = cols;
        
        const galleryGrid = document.getElementById('gallery-grid');
        const carouselContainer = document.getElementById('carousel-3d-container');

        if (cols === '3d') {
          if (galleryGrid) galleryGrid.style.display = 'none';
          if (carouselContainer) {
            carouselContainer.style.display = 'flex';
            if (typeof Carousel3DComponent !== 'undefined') {
              Carousel3DComponent.update3DLayout();
            }
          }
        } else {
          if (carouselContainer) carouselContainer.style.display = 'none';
          if (galleryGrid) {
            galleryGrid.style.display = 'grid';
            galleryGrid.className = `gallery-grid cols-${cols}`;
          }
        }
      });
    }

    // Reset Filters Button in Empty State
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.activeCategory = 'all';
        this.searchQuery = '';
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('.category-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.category === 'all');
        });
        this.render();
      });
    }
  },

  getFilteredPhotos() {
    return PHOTOS_DATA.filter(photo => {
      // Category check
      const matchesCategory = this.activeCategory === 'all' || photo.category === this.activeCategory;
      
      // Search check
      const q = this.searchQuery;
      const matchesSearch = !q || (
        photo.title.toLowerCase().includes(q) ||
        photo.location.toLowerCase().includes(q) ||
        photo.camera.toLowerCase().includes(q) ||
        photo.lens.toLowerCase().includes(q) ||
        photo.tags.some(tag => tag.toLowerCase().includes(q))
      );

      return matchesCategory && matchesSearch;
    });
  },

  render() {
    const gridContainer = document.getElementById('gallery-grid');
    const emptyState = document.getElementById('empty-state');
    if (!gridContainer) return;

    const filtered = this.getFilteredPhotos();

    if (filtered.length === 0) {
      gridContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    gridContainer.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    // Render cards
    gridContainer.innerHTML = filtered.map(photo => {
      const isFav = MoodboardComponent && MoodboardComponent.isFavorite(photo.id);
      return `
        <div class="photo-card" data-id="${photo.id}">
          <div class="photo-img-wrapper">
            <img src="${photo.url}" alt="${photo.title}" loading="lazy">
            <div class="photo-card-overlay">
              <div class="overlay-top">
                <span class="photo-cat-badge">${photo.category}</span>
                <button class="card-fav-btn ${isFav ? 'active' : ''}" data-id="${photo.id}" title="Save to Moodboard">
                  <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
              </div>
              <div class="overlay-bottom">
                <h3 class="photo-title">${photo.title}</h3>
                <p class="photo-location"><i class="fa-solid fa-location-dot"></i> ${photo.location}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click handlers
    gridContainer.querySelectorAll('.photo-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Check if favorite button was clicked
        const favBtn = e.target.closest('.card-fav-btn');
        if (favBtn) {
          e.stopPropagation();
          const photoId = favBtn.dataset.id;
          MoodboardComponent.toggleFavorite(photoId);
          this.render();
          return;
        }

        // Otherwise open lightbox
        const photoId = card.dataset.id;
        LightboxComponent.open(photoId);
      });
    });
  }
};
