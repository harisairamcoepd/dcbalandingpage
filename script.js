(() => {
  'use strict';

  const demoUrl = "https://wa.me/918977943529?text=Hello%20COEPD%2C%20I%27m%20interested%20in%20the%20Diploma%20in%20Certified%20Business%20Analysis%20%28DCBA%29.%20I%20would%20like%20to%20book%20a%20free%20demo.";
  document.querySelectorAll('a.btn[href="#contact"], a.text-link[href="#contact"]').forEach(link => {
    link.href = demoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Book Free Demo';
  });
  document.querySelectorAll('.btn').forEach(button => button.addEventListener('pointerdown', event => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    ripple.style.left = `${event.clientX - box.left}px`;
    ripple.style.top = `${event.clientY - box.top}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }));

  const menuButton = document.querySelector('.menu-btn');
  const navigation = document.querySelector('#nav');

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navigation?.classList.toggle('open', !open);
  });

  navigation?.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  });

  document.querySelectorAll('.timeline li, .eligibility-grid article, .audience-grid article, .project, .linkedin-card').forEach((item, index) => {
    item.dataset.reveal = '';
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  });

  const logoTrack = document.querySelector('[data-logo-track]');
  if (logoTrack) {
    [...logoTrack.children].forEach(logo => {
      const clone = logo.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.alt = '';
      logoTrack.appendChild(clone);
    });
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.logo-row img').forEach(image => {
    image.loading = 'lazy';
    image.decoding = 'async';
  });

  const heroPanel = document.querySelector('.hero-panel');
  heroPanel?.addEventListener('pointermove', event => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const box = heroPanel.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    heroPanel.style.transform = `perspective(1000px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg) translateY(-2px)`;
  });
  heroPanel?.addEventListener('pointerleave', () => { heroPanel.style.transform = ''; });

  if (!reducedMotion) {
    let parallaxQueued = false;
    addEventListener('scroll', () => {
      if (parallaxQueued) return;
      parallaxQueued = true;
      requestAnimationFrame(() => {
        document.querySelector('.hero-orb')?.style.setProperty('transform', `translate3d(0,${Math.min(scrollY * .08, 45)}px,0)`);
        parallaxQueued = false;
      });
    }, { passive: true });
  }
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const counters = document.querySelectorAll('[data-count]');
  const runCounter = element => {
    const target = Number(element.dataset.count);
    if (reducedMotion) {
      element.textContent = target.toLocaleString('en-IN');
      return;
    }
    const start = performance.now();
    const duration = 1300;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: .5 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    counters.forEach(runCounter);
  }

  const form = document.querySelector('#lead-form');
  const status = document.querySelector('#form-status');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please complete the required fields.';
      return;
    }
    status.textContent = 'Opening WhatsApp to book your free demo…';
    window.open(demoUrl, '_blank', 'noopener,noreferrer');
  });

  const loader = document.querySelector('#site-loader');
  const hideLoader = () => window.setTimeout(() => loader?.classList.add('hidden'), 250);
  document.readyState === 'complete' ? hideLoader() : window.addEventListener('load', hideLoader, { once: true });

  const progress = document.querySelector('#scroll-progress');
  const backTop = document.querySelector('#back-top');
  const updateScrollUi = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${scrollable > 0 ? scrollY / scrollable * 100 : 0}%`;
    backTop?.classList.toggle('visible', scrollY > 650);
  };
  addEventListener('scroll', updateScrollUi, { passive: true });
  updateScrollUi();
  backTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

  const navLinks = [...document.querySelectorAll('#nav a[href^="#"]')];
  const navSections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-25% 0px -65%' });
    navSections.forEach(section => activeObserver.observe(section));
  }

  const successRecords = [
    ['Himanshu','VB Engineering · 3 LPA'],['Naveen','HTC Global Services / Tech Mahindra'],['Mitali','Iorta / Darekh · Business Analyst'],['Sapna','Tech Mahindra / Simplify Healthcare'],['Vaibhav','Deloitte · 22.3 LPA'],['Ananya','Exponential.ai · 50% salary hike'],['Vineet','Thoughts2Binary / Brane'],['Vishal','Insurance domain · 15 LPA'],['Anisha','Epic Global, Inc. · 11 LPA'],['Geeta','Value Score Business Solutions · 5.4 LPA'],['Poojashree','Zithas Technologies · Fresher placement'],['Rishav','Vidarbha Infotech · 15 LPA'],['Pradeep Edumulla','322.22% hike · 19 LPA'],['Vishal','EPPS · 4.27 LPA'],['Sukumar','Optum · Career milestone'],['Liza Rani','Lowcode Labs · 3.8 LPA'],['Soma Navadeep Reddy','Wellbeginlens · 2.4 LPA'],['Vaibhav & Harish Kumar','Deloitte / Wells Fargo'],['Govindaraju Geethanjali','Access Meditech · Career success'],['Soma Navadeep Reddy','Wellbeginlens · Fresher placement'],['Devarapalli Sanjana','Lowcode Labs · 6.7 LPA'],['Venkata Sai Teja','Amgen · 15 LPA'],['Tejal & Rishav','Ampere / Vidarbha Infotech'],['Ketan','Wipro · 10 LPA'],['Sivadeepa','Virtues · 57% salary hike'],['Sandeep','EPAM · 16.5 LPA'],['Priti','UST · 25 LPA'],['Gaurav Daddikar','Simplify Healthcare · 6 LPA'],['Nandini Adhikari','Meditab · 6 LPA'],['Mr. Ameya','Wealthy · 40 LPA'],['Saravana Kumar Srivatsaya','Cognitive Platform Solutions · 3 LPA'],['Ms. Sujjwal','Zibal Incorporation · 9 LPA'],['CR Barath Narayanan','Arizon Digital USA · 14.2 LPA'],['Sri Vaishnavi C','Lowcode Labs · Business Analyst'],['Jhanvi','ERIF · 6 LPA'],['Angeetha P','TCS · 7.5 LPA'],['Mouleeshwaran Venkateshan','Gharuda Infotech · 4.5 LPA'],['S. Sam Rajan','Accenture · 12 LPA'],['Iftikhaar Ali S D','Codework Pvt Ltd · 3.5 LPA'],['Priyanka','HSBC · 15 LPA'],['Kumaran Dharmalingam','Apollo Hospitals · 12.5 LPA'],['Mayur','Plumb5 · 59% salary hike'],['Tushar','MagicBnz · 10 LPA']
  ];
  const storyTrack = document.querySelector('[data-story-track]');
  if (storyTrack) {
    const storiesSection = document.querySelector('#stories');
    storiesSection?.classList.add('success-stories');
    const heading = storiesSection?.querySelector('.section-head');
    if (heading) heading.innerHTML = '<span class="eyebrow">Career Outcomes</span><h2 id="success-stories-title">Success Stories</h2><p>Thousands of professionals have successfully transformed their careers through COEPD.</p>';
    const fragment = document.createDocumentFragment();
    successRecords.forEach(([name, outcome], index) => {
      const card = document.createElement('article');
      card.className = 'success-story-card';
      card.dataset.reveal = '';
      card.style.setProperty('--story-delay', `${(index % 4) * .1}s`);
      card.innerHTML = `<div class="success-story-media"><img src="assets/success-stories/success-story-${String(index + 1).padStart(2, '0')}.jpeg" width="574" height="578" loading="lazy" decoding="async" alt="COEPD success story: ${name} — ${outcome}"><div class="success-story-overlay" aria-hidden="true"><span>Business Analyst</span><span>Career Success</span><span>COEPD Graduate</span></div></div><div class="success-story-copy"><h3>${name}</h3><p>${outcome}</p><a href="${demoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Book a free DCBA demo">Book Free Demo <span aria-hidden="true">→</span></a></div>`;
      fragment.appendChild(card);
    });
    storyTrack.querySelector('noscript')?.remove();
    storyTrack.appendChild(fragment);
    storyTrack.className = 'success-carousel-viewport';
    storyTrack.id = 'successCarousel';
    const successGrid = document.createElement('div');
    successGrid.className = 'success-stories-grid';
    while (storyTrack.firstChild) successGrid.appendChild(storyTrack.firstChild);
    storyTrack.appendChild(successGrid);
    const shell = storyTrack.closest('.carousel-shell');
    shell?.classList.add('success-carousel');
    const previous = document.querySelector('[data-story-prev]');
    const next = document.querySelector('[data-story-next]');
    previous.className = 'success-carousel-arrow success-carousel-prev';
    next.className = 'success-carousel-arrow success-carousel-next';
    previous.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
    const pagination = document.querySelector('[data-story-dots]');
    pagination?.classList.add('success-carousel-pagination');
  }
  const successGrid = storyTrack?.querySelector('.success-stories-grid');
  const storyCards = [...(successGrid?.children || [])];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    storyCards.forEach(card => card.classList.add('visible'));
  } else {
    const successReveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      successReveal.unobserve(entry.target);
    }), { threshold: .1 });
    storyCards.forEach(card => successReveal.observe(card));
  }
  const storyDots = document.querySelector('[data-story-dots]');
  let storyIndex = 0;
  const visibleStories = () => innerWidth < 621 ? 1 : innerWidth < 961 ? 2 : 3;
  const goToStory = (index, shouldScroll = true) => {
    if (!storyTrack || !storyCards.length) return;
    storyIndex = (index + storyCards.length) % storyCards.length;
    if (shouldScroll && successGrid) {
      const gap = parseFloat(getComputedStyle(successGrid).gap) || 24;
      successGrid.style.transform = `translateX(-${storyIndex * (storyCards[0].getBoundingClientRect().width + gap)}px)`;
    }
    storyDots?.querySelectorAll('button').forEach((dot, i) => dot.classList.toggle('active', i === storyIndex));
  };
  storyCards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button'; dot.className = 'success-carousel-dot'; dot.setAttribute('aria-label', `Show success story ${index + 1}`);
    dot.addEventListener('click', () => goToStory(index));
    storyDots?.appendChild(dot);
  });
  document.querySelector('[data-story-prev]')?.addEventListener('click', () => goToStory(storyIndex - 1));
  document.querySelector('[data-story-next]')?.addEventListener('click', () => goToStory(storyIndex + 1));
  storyTrack?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') goToStory(storyIndex + 1);
    if (event.key === 'ArrowLeft') goToStory(storyIndex - 1);
  });
  let dragStartX = 0;
  let draggingStories = false;
  storyTrack?.addEventListener('pointerdown', event => {
    dragStartX = event.clientX;
    draggingStories = true;
    storyTrack.setPointerCapture?.(event.pointerId);
  });
  storyTrack?.addEventListener('pointerup', event => {
    if (!draggingStories) return;
    const distance = event.clientX - dragStartX;
    draggingStories = false;
    if (Math.abs(distance) > 45) goToStory(storyIndex + (distance < 0 ? 1 : -1));
  });
  storyTrack?.addEventListener('pointercancel', () => { draggingStories = false; });
  goToStory(0, false);
  let storyTimer = reducedMotion ? 0 : setInterval(() => goToStory(storyIndex + 1), 5200);
  storyTrack?.addEventListener('pointerenter', () => clearInterval(storyTimer));
  storyTrack?.addEventListener('pointerleave', () => { if (!reducedMotion) storyTimer = setInterval(() => goToStory(storyIndex + 1), 5200); });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
