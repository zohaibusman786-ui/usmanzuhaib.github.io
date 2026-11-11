/**
 * USMAN ZUHAIB — PORTFOLIO JAVASCRIPT
 * Interactions, Filtering, Lightbox/Modal, Contact Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initProjectFiltering();
  initProjectModal();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    header.classList.toggle('mobile-open');
    const isExpanded = header.classList.contains('mobile-open');
    toggle.setAttribute('aria-expanded', isExpanded);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('mobile-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   PORTFOLIO FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   PROJECT MODAL / LIGHTBOX
   ========================================================================== */
let projectsData = [];
let currentProjectIndex = 0;

function initProjectModal() {
  const modalOverlay = document.getElementById('projectModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modalOverlay) return;

  // Cache data from embedded json or DOM
  const dataScript = document.getElementById('projectsData');
  if (dataScript) {
    try {
      projectsData = JSON.parse(dataScript.textContent);
    } catch (e) {
      console.warn('Could not parse projects data script tag', e);
    }
  }

  // Card click triggers
  projectCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const foundIdx = projectsData.findIndex(p => p.id === projectId);
      currentProjectIndex = foundIdx !== -1 ? foundIdx : idx;
      renderModalContent(currentProjectIndex);
      openModal();
    });
  });

  // Close triggers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modalOverlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      navigateModal(1);
    } else if (e.key === 'ArrowLeft') {
      navigateModal(-1);
    }
  });

  // Modal Next / Prev buttons
  const prevBtn = document.getElementById('modalPrevBtn');
  const nextBtn = document.getElementById('modalNextBtn');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateModal(-1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateModal(1);
    });
  }
}

function openModal() {
  const modalOverlay = document.getElementById('projectModal');
  if (!modalOverlay) return;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modalOverlay = document.getElementById('projectModal');
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateModal(direction) {
  if (!projectsData.length) return;
  currentProjectIndex = (currentProjectIndex + direction + projectsData.length) % projectsData.length;
  renderModalContent(currentProjectIndex);
}

function renderModalContent(index) {
  const project = projectsData[index];
  if (!project) return;

  const modalImg = document.getElementById('modalProjectImg');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalBadge = document.getElementById('modalProjectBadge');
  const modalStatus = document.getElementById('modalProjectStatus');
  const modalSummary = document.getElementById('modalProjectSummary');
  const modalRole = document.getElementById('modalProjectRole');
  const modalTools = document.getElementById('modalProjectTools');
  const modalPlatforms = document.getElementById('modalProjectPlatforms');
  const modalChallenge = document.getElementById('modalProjectChallenge');
  const modalSolution = document.getElementById('modalProjectSolution');
  const modalFeatures = document.getElementById('modalProjectFeatures');
  const modalCounter = document.getElementById('modalProjectCounter');

  if (modalImg) {
    modalImg.src = project.imageWebp || project.imageJpg;
    modalImg.alt = project.title;
  }
  if (modalTitle) modalTitle.textContent = project.title;
  if (modalBadge) modalBadge.textContent = project.badge || 'Game Art';
  if (modalStatus) modalStatus.textContent = project.status || 'Shipped';
  if (modalSummary) modalSummary.textContent = project.summary;
  if (modalRole) modalRole.textContent = project.role;
  if (modalTools) modalTools.textContent = project.tools.join(', ');
  if (modalPlatforms) modalPlatforms.textContent = project.platforms.join(', ');
  if (modalChallenge) modalChallenge.textContent = project.challenge;
  if (modalSolution) modalSolution.textContent = project.solution;

  if (modalFeatures && project.features) {
    modalFeatures.innerHTML = project.features.map(f => `
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${escapeHtml(f)}</span>
      </li>
    `).join('');
  }

  if (modalCounter) {
    modalCounter.textContent = `${index + 1} / ${projectsData.length}`;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   CONTACT FORM & FALLBACKS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const projectType = form.querySelector('[name="project_type"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill out all required fields.';
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Message...';

    try {
      // Attempt Web3Forms submission
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = 'Thank you! Your message has been sent successfully. Usman will reply shortly.';
        }
        form.reset();
      } else {
        throw new Error(data.message || 'Submission error');
      }
    } catch (err) {
      // Graceful fallback to mailto
      console.warn('Endpoint submission fallback to mailto:', err);
      const mailtoLink = `mailto:zohaibusman786@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}%20(${encodeURIComponent(projectType)})&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}`;
      
      window.location.href = mailtoLink;

      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.textContent = 'Opening your email client to send message to zohaibusman786@gmail.com...';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* ==========================================================================
   SCROLL SPY & NAVIGATION HIGHLIGHT
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
