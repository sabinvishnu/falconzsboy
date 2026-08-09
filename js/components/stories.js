/* ==========================================================================
   FALCON // ATELIER - VISUAL STORIES & JOURNAL COMPONENT
   ========================================================================== */

const StoriesComponent = {
  init() {
    this.renderGrid();
    this.bindEvents();
  },

  renderGrid() {
    const container = document.getElementById('stories-grid');
    if (!container) return;

    container.innerHTML = STORIES_DATA.map(story => `
      <div class="story-card" data-id="${story.id}">
        <div class="story-img-wrapper">
          <img src="${story.coverImg}" alt="${story.title}">
        </div>
        <div class="story-content">
          <div class="story-meta">
            <span><i class="fa-solid fa-location-dot"></i> ${story.location}</span> • <span>${story.date}</span>
          </div>
          <h3 class="story-title">${story.title}</h3>
          <p class="story-excerpt">${story.excerpt}</p>
        </div>
      </div>
    `).join('');
  },

  bindEvents() {
    const container = document.getElementById('stories-grid');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const card = e.target.closest('.story-card');
      if (!card) return;

      const storyId = card.dataset.id;
      this.openReaderModal(storyId);
    });

    const backdrop = document.getElementById('story-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeReaderModal());
    }
  },

  openReaderModal(storyId) {
    const story = STORIES_DATA.find(s => s.id === storyId);
    if (!story) return;

    const modal = document.getElementById('story-modal');
    const content = document.getElementById('story-modal-content');

    if (!modal || !content) return;

    content.innerHTML = `
      <div class="modal-header">
        <div>
          <span class="header-tag">${story.location} — ${story.date}</span>
          <h2>${story.title}</h2>
        </div>
        <button class="icon-btn close-btn" onclick="StoriesComponent.closeReaderModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="story-modal-body" style="padding: 1.5rem; max-height: 75vh; overflow-y: auto;">
        <img src="${story.coverImg}" alt="${story.title}" style="width: 100%; height: 380px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">
        <div class="story-text-content" style="font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary);">
          ${story.content}
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeReaderModal() {
    const modal = document.getElementById('story-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
