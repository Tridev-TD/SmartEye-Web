/* ============================================================
   REDLINE — main.js
   All interactivity: navbar, AOS, carousel, FAQ, gallery filter, form
   ============================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     1. NAVBAR — scroll effect + mobile toggle
  ─────────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll();

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const spans = navToggle.querySelectorAll("span");
    navLinks.classList.contains("open")
      ? spans.forEach((s, i) => {
          if (i === 0) s.style.transform = "rotate(45deg) translate(5px, 5px)";
          if (i === 1) s.style.opacity = "0";
          if (i === 2) s.style.transform = "rotate(-45deg) translate(5px, -5px)";
        })
      : spans.forEach((s) => {
          s.style.transform = "";
          s.style.opacity = "";
        });
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.querySelectorAll("span").forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
      });
    });
  });

  /* ──────────────────────────────────────────────
     2. SCROLL-TO-TOP BUTTON
  ─────────────────────────────────────────────── */
  const scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ──────────────────────────────────────────────
     3. AOS — simple scroll animation observer
  ─────────────────────────────────────────────── */
  function initAOS() {
    const elements = document.querySelectorAll("[data-aos]");
    const delays = { 0: 0, 100: 0.1, 150: 0.15, 200: 0.2, 300: 0.3, 400: 0.4, 500: 0.5 };

    elements.forEach((el) => {
      const delay = parseInt(el.getAttribute("data-aos-delay") || "0");
      el.style.transitionDelay = (delays[delay] || 0) + "s";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }
  initAOS();

  /* ──────────────────────────────────────────────
     4. TESTIMONIALS CAROUSEL
  ─────────────────────────────────────────────── */
  function initCarousel() {
    const track = document.getElementById("testimonialTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");
    const cards = track.querySelectorAll(".testimonial-card");
    let current = 0;
    let cardWidth = 0;
    let visibleCount = 3;
    let maxIndex = 0;
    let autoTimer = null;

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function buildDots() {
      dotsContainer.innerHTML = "";
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === current ? " active" : "");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll(".carousel-dot").forEach((d, i) => {
        d.classList.toggle("active", i === current);
      });
    }

    function goTo(index) {
      visibleCount = getVisibleCount();
      maxIndex = Math.max(0, cards.length - visibleCount);
      current = Math.max(0, Math.min(index, maxIndex));
      cardWidth = cards[0].offsetWidth + 28; // gap = 28px
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    function setupCarousel() {
      visibleCount = getVisibleCount();
      maxIndex = Math.max(0, cards.length - visibleCount);
      if (current > maxIndex) current = maxIndex;
      buildDots();
      goTo(current);
    }

    prevBtn.addEventListener("click", () => {
      goTo(current - 1);
      resetAuto();
    });
    nextBtn.addEventListener("click", () => {
      goTo(current + 1 > maxIndex ? 0 : current + 1);
      resetAuto();
    });

    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current + 1 > maxIndex ? 0 : current + 1);
      }, 4500);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    window.addEventListener("resize", setupCarousel);
    setupCarousel();
    startAuto();
  }
  initCarousel();

  /* ──────────────────────────────────────────────
     5. GALLERY FILTER
  ─────────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      galleryItems.forEach((item) => {
        const cat = item.getAttribute("data-cat");
        const show = filter === "all" || cat === filter;
        item.style.transition = "opacity 0.3s, transform 0.3s";
        if (show) {
          item.style.display = "";
          requestAnimationFrame(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          });
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";
          setTimeout(() => {
            if (item.getAttribute("data-cat") !== filter && filter !== "all") {
              item.style.display = "none";
            }
          }, 280);
        }
      });
    });
  });

  /* ──────────────────────────────────────────────
     6. FAQ ACCORDION
  ─────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach((f) => f.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  /* ──────────────────────────────────────────────
     7. CONTACT FORM
  ─────────────────────────────────────────────── */
  const form = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      btn.textContent = "Sending…";
      btn.disabled = true;
      setTimeout(() => {
        formSuccess.style.display = "block";
        form.reset();
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.disabled = false;
        setTimeout(() => (formSuccess.style.display = "none"), 6000);
      }, 1400);
    });
  }

  /* ──────────────────────────────────────────────
     8. SMOOTH ANCHOR SCROLL (navbar offset)
  ─────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = document.getElementById("navbar").offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ──────────────────────────────────────────────
     9. ACTIVE NAV LINK ON SCROLL
  ─────────────────────────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navAnchors.forEach((a) => a.classList.remove("active-link"));
        const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (active) active.classList.add("active-link");
      }
    });
  }
  window.addEventListener("scroll", updateActiveLink);

  // Counter animation on stats
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target + (el.dataset.suffix || ""); clearInterval(timer); }
      else el.textContent = start + (el.dataset.suffix || "");
    }, 16);
  }

  const heroSection = document.querySelector(".hero");
  let countersRun = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersRun) {
      countersRun = true;
    }
  }, { threshold: 0.5 });
  if (heroSection) statsObserver.observe(heroSection);

})();
