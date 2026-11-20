// ==========================================================================
// Anniversary Website - Scripts
// Chapter One Scrapbook Slideshow & Interactive Easter Eggs
// ==========================================================================

// --------------------------------------------------------------------------
// 1. Scroll Animations for Cards
// --------------------------------------------------------------------------
function initScrollObserver() {
  const animatedEntries = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedEntries.forEach(entry => observer.observe(entry));
  } else {
    animatedEntries.forEach(entry => entry.classList.add('visible'));
  }
}

// --------------------------------------------------------------------------
// 2. Story Slideshow Controller (Chapter One)
// --------------------------------------------------------------------------
const StorySlideshow = {
  slides: [],
  dots: [],
  currentIndex: 0,
  prevBtn: null,
  nextBtn: null,
  currentNumEl: null,
  totalNumEl: null,
  dotsContainer: null,
  touchStartX: 0,
  touchEndX: 0,

  init() {
    this.slides = Array.from(document.querySelectorAll('.story-slide'));
    if (this.slides.length === 0) return;

    this.prevBtn = document.getElementById('btn-prev-slide');
    this.nextBtn = document.getElementById('btn-next-slide');
    this.currentNumEl = document.getElementById('current-slide-num');
    this.totalNumEl = document.getElementById('total-slides-num');
    this.dotsContainer = document.getElementById('slide-dots-list');

    if (this.totalNumEl) {
      this.totalNumEl.textContent = this.slides.length;
    }

    this.buildDots();
    this.buildTimeline();
    this.bindEvents();
    this.goToSlide(0);
  },

  buildDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.dots = [];

    this.slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slide-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => this.goToSlide(idx));
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    });
  },

  buildTimeline() {
    const list = document.getElementById('timeline-list');
    if (!list) return;
    this.timeline = this.slides.map((slide, index) => {
      const title = slide.querySelector('.slide-title, .final-completed-title').textContent.trim();
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'timeline-chapter';
      button.textContent = String(index + 1).padStart(2, '0');
      button.setAttribute('aria-label', `Chapter ${index + 1}: ${title}`);
      button.title = title;
      button.dataset.title = title;
      button.addEventListener('click', () => this.goToSlide(index));
      list.appendChild(button);
      if (!slide.classList.contains('final-slide')) {
        const label = document.createElement('p');
        label.className = 'chapter-label';
        label.textContent = `CHAPTER ${String(index + 1).padStart(2, '0')}`;
        slide.querySelector('.slide-text-col').prepend(label);
      }
      return button;
    });
  },

  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;

    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    const changed = this.currentIndex !== index;
    this.currentIndex = index;
    this.timeline?.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.classList.toggle('visited', i < index);
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    const currentTitle = document.querySelector('.timeline-current');
    if (currentTitle) currentTitle.textContent = this.timeline?.[index].dataset.title || '';
    if (changed && this.timeline?.[index]) {
      const list = document.querySelector('.story-timeline');
      const button = this.timeline[index];
      list.scrollTo({ left: button.offsetLeft - list.clientWidth / 2 + button.offsetWidth / 2, behavior: 'smooth' });
    }
    if (changed && index === this.slides.length - 1) {
      const final = this.slides[index];
      final.classList.remove('celebrate');
      void final.offsetWidth;
      final.classList.add('celebrate');
    }

    if (this.currentNumEl) {
      this.currentNumEl.textContent = index + 1;
    }

    // Update navigation button states
    if (this.prevBtn) {
      this.prevBtn.disabled = index === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = index === this.slides.length - 1;
    }
  },

  next() {
    if (this.currentIndex < this.slides.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  },

  prev() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  },

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    document.querySelector('.hero .story-button')?.addEventListener('click', () => this.goToSlide(0));
    document.querySelector('.restart-story')?.addEventListener('click', () => {
      this.goToSlide(0);
      document.getElementById('story-slideshow').scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.nextBtn?.focus({ preventScroll: true });
    });

    // Keyboard navigation (left/right arrows)
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('button, a, input, textarea, select, dialog')) return;
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    // Touch swipe support for mobile
    const viewport = document.getElementById('story-slideshow');
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        if (e.target.closest('.story-timeline, button, a')) { this.touchStartX = null; return; }
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (e) => {
        if (this.touchStartX === null) return;
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }
  },

  handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const threshold = 40; // minimum swipe distance in pixels
    if (swipeDistance < -threshold) {
      // Swiped left -> next slide
      this.next();
    } else if (swipeDistance > threshold) {
      // Swiped right -> prev slide
      this.prev();
    }
  }
};

// --------------------------------------------------------------------------
// 3. Easter Eggs System (Interactive Spider)
// --------------------------------------------------------------------------
const EasterEggs = {
  spider: {
    container: null,
    triggerBtn: null,
    bubble: null,
    timerId: null,
    retreatTimerId: null,
    isDescending: false,

    init() {
      this.container = document.getElementById('spider-easter-egg');
      this.triggerBtn = document.getElementById('spider-trigger');
      this.bubble = document.getElementById('spider-message');

      if (!this.container || !this.triggerBtn) return;

      // Click or tap reveals the cute easter egg message
      this.triggerBtn.addEventListener('click', () => this.handleSpiderClick());

      // Respect reduced motion accessibility preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Start the interval cycle (between 45 and 90 seconds)
      this.scheduleNextDrop();

      // Expose a helper to trigger the spider in the browser console for testing:
      window.triggerSpider = () => this.descend();
    },

    scheduleNextDrop() {
      const minInterval = 45000;
      const maxInterval = 90000;
      const delay = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

      clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.descend();
      }, delay);
    },

    descend() {
      if (this.isDescending) return;
      this.isDescending = true;

      // Randomly pick left or right side, staying near the edges (6% to 14%)
      const side = Math.random() < 0.5 ? 'left' : 'right';
      const offsetPercent = (Math.random() * 8 + 6).toFixed(1);

      this.container.style.left = side === 'left' ? `${offsetPercent}%` : 'auto';
      this.container.style.right = side === 'right' ? `${offsetPercent}%` : 'auto';

      // Reset speech bubble state and descend
      this.container.classList.remove('show-bubble');
      this.container.classList.add('descended');

      // Stay visible for 6 to 8 seconds before climbing back up
      const visibleDuration = Math.floor(Math.random() * 2000) + 6000;
      clearTimeout(this.retreatTimerId);
      this.retreatTimerId = setTimeout(() => {
        this.retreat();
      }, visibleDuration);
    },

    handleSpiderClick() {
      if (!this.isDescending) return;

      // Reveal message
      this.container.classList.add('show-bubble');

      // Keep message visible for 2.5 seconds, then climb back up smoothly
      clearTimeout(this.retreatTimerId);
      this.retreatTimerId = setTimeout(() => {
        this.retreat();
      }, 2500);
    },

    retreat() {
      this.container.classList.remove('descended');

      // Reset state after climb animation finishes (1.2s transition)
      setTimeout(() => {
        this.container.classList.remove('show-bubble');
        this.isDescending = false;
        this.scheduleNextDrop();
      }, 1200);
    }
  },

  initAll() {
    this.spider.init();
  }
};

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initScrollObserver();
  StorySlideshow.init();
  EasterEggs.initAll();
});
