/* ==========================================================================
   FALCON // ATELIER - APPLICATION INITIALIZER & EVENT HUB
   ========================================================================== */

const App = {
  audioEnabled: false,
  audioContext: null,

  init() {
    this.initSpaceVoidCanvas();
    this.initThemeSystem();
    this.initAudioSystem();
    this.initMobileNav();

    // Initialize all components
    GalleryComponent.init();
    LightboxComponent.init();
    BeforeAfterComponent.init();
    PrintShopComponent.init();
    StoriesComponent.init();
    MoodboardComponent.init();
    BookingFormComponent.init();
  },

  /* Minimalist Deep-Space Void Comets & Shooting Stars Canvas Engine */
  initSpaceVoidCanvas() {
    const canvas = document.getElementById('space-void-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let comets = [];
    let stars = [];
    const minComets = 2;
    const maxComets = 5;

    // Color definitions
    // Soft white, golden, luminous red, and crimson rose comets
    const getRandomCometColor = () => {
      const rand = Math.random();
      if (rand < 0.45) {
        // Soft white
        return { head: '#ffffff', tail: 'rgba(255, 255, 255,', glow: '#ffffff' };
      } else if (rand < 0.70) {
        // Soft golden
        return { head: '#fff3bf', tail: 'rgba(254, 240, 138,', glow: '#fde047' };
      } else if (rand < 0.85) {
        // Luminous Red
        return { head: '#fca5a5', tail: 'rgba(239, 68, 68,', glow: '#ef4444' };
      } else {
        // Glowing Crimson Rose
        return { head: '#f43f5e', tail: 'rgba(225, 29, 72,', glow: '#e11d48' };
      }
    };

    const resize = () => {
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
      initStars();
      initComets();
    };

    // Deep-Space Twinkling Starfield Generator
    const initStars = () => {
      stars = [];
      const starCount = Math.floor((width * height) / 10000);
      const starColors = ['#ffffff', '#f1f5f9', '#e0c3fc', '#8ec5fc', '#fef08a'];

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.3 + 0.4,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          alpha: Math.random() * 0.7 + 0.1,
          pulseSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1)
        });
      }
    };

    const spawnComet = (index) => {
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25; // Gentle diagonal trajectory
      const speed = Math.random() * 2.0 + 1.2; // Slow, graceful motion
      const length = Math.random() * 160 + 110; // Luminous tail length
      const colorScheme = getRandomCometColor();

      // Start position off-screen top/left boundaries
      const startX = Math.random() * width * 1.2 - width * 0.2;
      const startY = -length - Math.random() * 250;

      comets[index] = {
        x: startX,
        y: startY,
        length: length,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        radius: Math.random() * 1.3 + 0.8,
        alpha: Math.random() * 0.55 + 0.35,
        color: colorScheme
      };
    };

    const initComets = () => {
      comets = [];
      const count = Math.floor(Math.random() * (maxComets - minComets + 1)) + minComets;
      for (let i = 0; i < count; i++) {
        spawnComet(i);
        comets[i].x += Math.random() * width * 0.6;
        comets[i].y += Math.random() * height * 0.6;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Deep-Space Twinkling Stars
      stars.forEach(star => {
        star.alpha += star.pulseSpeed;
        if (star.alpha >= 0.85 || star.alpha <= 0.1) {
          star.pulseSpeed = -star.pulseSpeed;
        }

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Sparse Comets (2 to 5)
      comets.forEach((comet, idx) => {
        comet.x += comet.speedX;
        comet.y += comet.speedY;

        // Tail Gradient calculations
        const tailX = comet.x - (comet.speedX * (comet.length / (comet.speedY || 1)));
        const tailY = comet.y - (comet.speedY * (comet.length / (comet.speedY || 1)));

        const grad = ctx.createLinearGradient(comet.x, comet.y, tailX, tailY);
        grad.addColorStop(0, `${comet.color.tail} ${comet.alpha})`);
        grad.addColorStop(0.3, `${comet.color.tail} ${comet.alpha * 0.55})`);
        grad.addColorStop(0.7, `${comet.color.tail} ${comet.alpha * 0.18})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = comet.radius * 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(comet.x, comet.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Luminous Head Sparkle with Soft Glow
        ctx.fillStyle = comet.color.head;
        ctx.shadowColor = comet.color.glow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.radius * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Respawn when gliding off bottom/right screen
        if (comet.y > height + 250 || comet.x > width + 250) {
          spawnComet(idx);
        }
      });

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
  },

  /* Hero Section Background Carousel */
  initHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;

    const slides = [
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2000&auto=format&fit=crop"
    ];

    carousel.innerHTML = slides.map((imgUrl, i) => `
      <div class="hero-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${imgUrl}')"></div>
    `).join('');

    let currentSlide = 0;
    setInterval(() => {
      const slideEls = carousel.querySelectorAll('.hero-slide');
      if (slideEls.length === 0) return;

      slideEls[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slideEls.length;
      slideEls[currentSlide].classList.add('active');
    }, 6000);
  },

  /* Aesthetic Theme Switcher System */
  initThemeSystem() {
    const themeBtn = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');

    if (themeBtn && themeMenu) {
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!themeMenu.contains(e.target) && e.target !== themeBtn) {
          themeMenu.classList.remove('active');
        }
      });

      themeMenu.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const themeName = opt.dataset.theme;
          
          document.documentElement.setAttribute('data-theme', themeName);
          
          themeMenu.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          themeMenu.classList.remove('active');

          this.showToast(`Switched aesthetic to ${opt.textContent.trim()}`);
        });
      });
    }
  },

  /* Audio Synthesizer for Camera Shutter Sound Effect */
  initAudioSystem() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;

        if (this.audioEnabled && !this.audioContext) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) this.audioContext = new AudioContextClass();
        }

        if (audioIcon) {
          audioIcon.className = this.audioEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
          audioBtn.style.borderColor = this.audioEnabled ? 'var(--accent-gold)' : 'var(--border-color)';
        }

        this.showToast(this.audioEnabled ? 'Shutter audio feedback enabled' : 'Audio muted');
        if (this.audioEnabled) this.playShutterSound();
      });
    }
  },

  playShutterSound() {
    if (!this.audioEnabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio synth fallback
    }
  },

  /* Mobile Navigation Menu */
  initMobileNav() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (mobileBtn && mainNav) {
      mobileBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
      });

      mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('active');
        });
      });
    }
  },

  /* Toast Notification System */
  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-gold)"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
