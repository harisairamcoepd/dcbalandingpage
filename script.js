(() => {
  'use strict';

  const demoUrl = "https://wa.me/918977943529?text=Hello%20COEPD%2C%0AI%20am%20interested%20in%20the%20Diploma%20in%20Certified%20Business%20Analysis%20%28DCBA%29.%0APlease%20help%20me%20book%20a%20Free%20Demo.";
  document.querySelectorAll('a.text-link[href="#contact"]').forEach(link => {
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

  document.querySelectorAll('main > section:not(.hero), .footer, .timeline li, .eligibility-grid article, .audience-grid article, .project').forEach((item, index) => {
    item.dataset.reveal = '';
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  });

  const logoTrack = document.querySelector('[data-logo-track]');
  if (logoTrack) {
    [...logoTrack.querySelectorAll(':scope > img')].forEach(logo => {
      const card = document.createElement('article');
      card.className = 'partner-card';
      card.dataset.reveal = '';
      logo.loading = 'lazy';
      logo.decoding = 'async';
      const name = document.createElement('span');
      name.textContent = logo.alt;
      logoTrack.insertBefore(card, logo);
      card.append(logo, name);
    });
    [...logoTrack.children].forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('img').alt = '';
      logoTrack.appendChild(clone);
    });
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('img').forEach(image => {
    if (!image.title && image.alt) image.title = image.alt;
    if (!image.hasAttribute('width') && image.closest('.partner-card')) image.width = 132;
    if (!image.hasAttribute('height') && image.closest('.partner-card')) image.height = 58;
  });
  document.querySelectorAll('.logo-row img').forEach(image => {
    image.loading = 'lazy';
    image.decoding = 'async';
  });

  if (logoTrack && !reducedMotion) {
    let partnerOffset = 0;
    let partnerPaused = false;
    let partnerDragging = false;
    let partnerStartX = 0;
    let partnerStartOffset = 0;
    let previousFrame = performance.now();
    const normalizePartnerOffset = () => {
      const half = logoTrack.scrollWidth / 2;
      if (half > 0 && partnerOffset <= -half) partnerOffset += half;
      if (half > 0 && partnerOffset > 0) partnerOffset -= half;
    };
    const animatePartners = now => {
      if (!partnerPaused && !partnerDragging) partnerOffset -= Math.min(now - previousFrame, 40) * .035;
      normalizePartnerOffset();
      logoTrack.style.transform = `translate3d(${partnerOffset}px,0,0)`;
      previousFrame = now;
      requestAnimationFrame(animatePartners);
    };
    logoTrack.closest('.logo-viewport')?.addEventListener('pointerenter', () => { partnerPaused = true; });
    logoTrack.closest('.logo-viewport')?.addEventListener('pointerleave', () => { partnerPaused = false; partnerDragging = false; });
    logoTrack.addEventListener('pointerdown', event => {
      partnerDragging = true;
      partnerStartX = event.clientX;
      partnerStartOffset = partnerOffset;
      logoTrack.setPointerCapture?.(event.pointerId);
    });
    logoTrack.addEventListener('pointermove', event => {
      if (partnerDragging) partnerOffset = partnerStartOffset + event.clientX - partnerStartX;
    });
    logoTrack.addEventListener('pointerup', () => { partnerDragging = false; });
    requestAnimationFrame(animatePartners);
  }

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
      const outcomeParts = outcome.split('·').map(part => part.trim()).filter(Boolean);
      const packageText = outcomeParts.find(part => /(?:LPA|salary hike|%|package)/i.test(part)) || 'Not published';
      const companyText = outcomeParts.filter(part => part !== packageText).join(' · ') || 'COEPD placement outcome';
      const card = document.createElement('article');
      card.className = 'success-story-card';
      card.dataset.storyIndex = index;
      card.dataset.company = companyText; card.dataset.role = 'Business Analyst'; card.dataset.package = packageText;
      card.dataset.reveal = '';
      card.style.setProperty('--story-delay', `${(index % 4) * .1}s`);
      card.innerHTML = `<div class="success-story-media"><img src="assets/success-stories/success-story-${String(index + 1).padStart(2, '0')}.jpeg" width="574" height="578" loading="lazy" decoding="async" alt="COEPD success story: ${name} — ${outcome}" title="${name} — COEPD career success"><div class="success-story-overlay" aria-hidden="true"><span>Business Analyst</span><span>Career Success</span><span>COEPD Graduate</span></div></div><div class="success-story-copy"><h3>${name}</h3><dl><div><dt>Company</dt><dd>${companyText}</dd></div><div><dt>Role</dt><dd>Business Analyst</dd></div><div><dt>Package</dt><dd>${packageText}</dd></div></dl><p>A published COEPD career outcome built through practical preparation and interview readiness.</p></div>`;
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
  let storyWasDragged = false;
  storyTrack?.addEventListener('pointerdown', event => {
    dragStartX = event.clientX;
    draggingStories = true;
    storyWasDragged = false;
    storyTrack.setPointerCapture?.(event.pointerId);
  });
  storyTrack?.addEventListener('pointermove', event => {
    if (draggingStories && Math.abs(event.clientX - dragStartX) > 8) storyWasDragged = true;
  });
  storyTrack?.addEventListener('pointerup', event => {
    if (!draggingStories) return;
    const distance = event.clientX - dragStartX;
    draggingStories = false;
    if (Math.abs(distance) > 45) goToStory(storyIndex + (distance < 0 ? 1 : -1));
  });
  storyTrack?.addEventListener('pointercancel', () => { draggingStories = false; storyWasDragged = true; });
  goToStory(0, false);
  let storyTimer = reducedMotion ? 0 : setInterval(() => goToStory(storyIndex + 1), 5200);
  storyTrack?.addEventListener('pointerenter', () => clearInterval(storyTimer));
  storyTrack?.addEventListener('pointerleave', () => { if (!reducedMotion) storyTimer = setInterval(() => goToStory(storyIndex + 1), 5200); });

  const faqSearch = document.querySelector('#faq-search');
  const faqItems = [...document.querySelectorAll('#faq details')];
  faqSearch?.addEventListener('input', () => {
    const query = faqSearch.value.trim().toLowerCase();
    let matches = 0;
    faqItems.forEach(item => {
      const visible = !query || item.textContent.toLowerCase().includes(query);
      item.hidden = !visible;
      if (visible) matches += 1;
    });
    const empty = document.querySelector('#faq-empty');
    if (empty) empty.hidden = matches > 0;
  });

  const modal = document.querySelector('#detail-modal');
  const dialog = modal?.querySelector('.modal-dialog');
  let modalReturnFocus = null;
  let activeToolIndex = -1;
  let activeStoryIndex = -1;
  const toolCards = [...document.querySelectorAll('.tools > span')];
  const toolDetails = [
    {name:'JIRA',about:'JIRA is an Agile work-management platform for planning, tracking and delivering projects.',use:'Business Analysts manage requirements, user stories, acceptance criteria, sprints and defects in one shared workflow.',features:'Sprint planning • User-story tracking • Bug tracking • Requirement management',skills:'Backlog refinement • Story writing • Traceability • Agile collaboration',example:'For a digital lending project, the BA converts approved requirements into prioritised stories and tracks them through testing.',industries:'IT services • Banking • Healthcare • Retail • Telecom',benefit:'Demonstrates practical Agile delivery skills expected by enterprise teams.'},
    {name:'Confluence',about:'Confluence is a collaborative workspace for creating, organising and sharing project knowledge.',use:'Business Analysts maintain BRDs, FRDs, meeting notes, decision logs, requirement pages and project documentation.',features:'Collaborative pages • Templates • Version history • JIRA integration',skills:'BRD • FRD • Documentation • Stakeholder collaboration • Meeting notes',example:'After a discovery workshop, the BA publishes requirements and decisions for stakeholder review and approval.',industries:'Technology • Consulting • Financial services • Healthcare',benefit:'Creates a central, searchable source of truth for stakeholders and delivery teams.'},
    {name:'Microsoft Visio',about:'Microsoft Visio is a professional diagramming application used to visualise processes, systems and responsibilities.',use:'Analysts create AS-IS and TO-BE flows, swimlanes, UML diagrams and stakeholder-friendly process maps.',features:'Flowcharts • Swimlanes • UML • Process mapping',skills:'Process modelling • Gap analysis • Visual communication • BPMN basics',example:'A BA maps the current claims process, identifies delays and presents an improved future-state workflow.',industries:'Banking • Insurance • Manufacturing • Government • Consulting',benefit:'Makes complex business processes easier to understand, validate and improve.'},
    {name:'Balsamiq',about:'Balsamiq is a rapid low-fidelity wireframing tool for communicating screen ideas before development.',use:'Business Analysts translate requirements into simple interfaces that stakeholders can review early.',features:'Low-fidelity wireframes • UI mockups • Reusable controls • Screen prototypes',skills:'Wireframing • User-flow thinking • Requirement visualisation • Feedback facilitation',example:'Before building a patient portal, the BA sketches registration and appointment screens for validation.',industries:'Software • E-commerce • Healthcare • Fintech • Startups',benefit:'Reduces rework by validating layout and behaviour before engineering begins.'},
    {name:'Power BI',about:'Power BI is Microsoft’s business-intelligence platform for transforming data into reports and dashboards.',use:'Analysts build KPI views, explore trends and communicate evidence-based recommendations.',features:'Dashboard creation • Data visualisation • Business reporting • KPI tracking',skills:'Data preparation • Visual design • DAX fundamentals • Insight storytelling',example:'A retail BA combines sales data into a dashboard that highlights revenue, margin and regional performance.',industries:'Retail • Finance • Operations • Healthcare • Manufacturing',benefit:'Adds data-backed decision support to an analyst’s requirements and process expertise.'},
    {name:'Tableau',about:'Tableau is a visual-analytics platform for exploring data and creating interactive business dashboards.',use:'Business Analysts identify patterns, compare performance and present findings to decision-makers.',features:'Interactive dashboards • Business intelligence • Data analytics • Visual exploration',skills:'Data connections • Calculated fields • Dashboard design • Insight communication',example:'A BA analyses customer churn by segment and creates an interactive view for retention planning.',industries:'Consulting • Banking • Consumer goods • Telecom • Healthcare',benefit:'Builds strong analytical storytelling capability for stakeholder presentations.'},
    {name:'SQL',about:'SQL is the standard language used to retrieve, filter, combine and validate structured database information.',use:'Business Analysts query data to investigate requirements, validate rules and support reporting.',features:'Database queries • Data analysis • Reporting • Requirement validation',skills:'SELECT statements • Joins • Aggregation • Data-quality checks',example:'A BA verifies whether loan eligibility rules produce the expected applicant segments before UAT.',industries:'Every data-driven industry, including banking, retail, healthcare and technology',benefit:'Enables independent data investigation and more precise conversations with technical teams.'},
    {name:'Microsoft Azure',about:'Microsoft Azure is a cloud platform providing computing, data, integration and delivery services.',use:'Business Analysts learn how enterprise solutions, cloud data and DevOps workflows fit together.',features:'Cloud services • DevOps basics • Cloud data • Enterprise solutions',skills:'Cloud concepts • Service mapping • DevOps awareness • Solution context',example:'During a migration initiative, the BA maps business needs to cloud services and documents integration dependencies.',industries:'Enterprise IT • Banking • Government • Healthcare • E-commerce',benefit:'Improves collaboration on modern cloud-transformation projects without requiring coding expertise.'},
    {name:'Product Management',about:'Product Management coordinates customer needs, business strategy and delivery across a product lifecycle.',use:'Analysts contribute discovery, stakeholder alignment, prioritisation, roadmaps and measurable outcomes.',features:'Product lifecycle • Roadmaps • Stakeholder management • Product strategy',skills:'Discovery • Prioritisation • Roadmapping • Outcome definition',example:'A BA helps prioritise a mobile-banking roadmap using customer pain points, value and delivery effort.',industries:'Technology • SaaS • Fintech • E-commerce • Consumer products',benefit:'Develops commercial thinking and supports progression toward product-focused roles.'}
  ];
  toolCards.forEach((card,index) => {
    card.dataset.toolIndex = index;
    const cardImage = card.querySelector('img');
    if (cardImage) cardImage.alt = `${toolDetails[index].name} logo`;
    const more = document.createElement('small'); more.className = 'tool-more'; more.textContent = 'Learn More  →'; card.appendChild(more);
    card.addEventListener('pointermove', event => {
      if (reducedMotion || event.pointerType === 'touch') return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--rx', `${((event.clientY-box.top)/box.height-.5)*-3}deg`);
      card.style.setProperty('--ry', `${((event.clientX-box.left)/box.width-.5)*4}deg`);
      card.style.setProperty('--gx', `${event.clientX-box.left}px`); card.style.setProperty('--gy', `${event.clientY-box.top}px`);
    });
    card.addEventListener('pointerleave', () => { card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); });
    card.addEventListener('pointerdown', event => {
      if (reducedMotion) return;
      const box = card.getBoundingClientRect(), ripple = document.createElement('i');
      ripple.className = 'tool-ripple'; ripple.style.left = `${event.clientX-box.left}px`; ripple.style.top = `${event.clientY-box.top}px`;
      card.appendChild(ripple); ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
    });
  });
  const detailCopy = {
    highlight: ['Program highlight','Explore how this part of DCBA supports practical, measurable professional development.', [['Purpose','Build one focused workplace capability'],['Method','Guided learning with realistic practice'],['Evidence','Assignments, reviews and portfolio outputs'],['Value','Clear progress toward project readiness']]],
    curriculum: ['Curriculum capability','This capability is taught through explanation, application, feedback and workplace context.', [['Learn','Core concepts and professional standards'],['Apply','Scenario-based assignments and activities'],['Review','Feedback against clear expectations'],['Outcome','A skill you can demonstrate with evidence']]],
    audience: ['Who can join','A practical route for graduates ready to enter or re-enter professional work.', [['Eligibility','Graduation in any discipline'],['Profiles','Returners, fresh graduates and domain changers'],['Communication','Working English is required'],['Background','No coding or IT experience needed']]],
    journey: ['Learning journey','Each month builds a distinct capability through guided practice, review and portfolio evidence.', [['Learning','Focused concepts and professional methods'],['Practice','Assignments based on workplace scenarios'],['Feedback','Mentor review and measurable progress'],['Outcome','A clear milestone toward project and interview readiness']]],
    project: ['Project experience','Turn a business scenario into clear, reviewable analyst deliverables.', [['Objective','Solve a realistic business problem'],['Deliverables','Flows, requirements, stories and test support'],['Practice','Stakeholder thinking and Agile collaboration'],['Outcome','Portfolio evidence you can discuss in interviews']]],
    guarantee: ['Career support pathway','A transparent progression from learning milestones to opportunity support.', [['Milestones','Attendance, assignments and evaluations'],['Evidence','Required capstone and live-project work'],['Readiness','Profile, mock interview and communication reviews'],['Agreement','Eligibility and terms shared before enrolment']]],
    partner: ['Employer insight','Understand the capabilities commonly expected in analyst and delivery roles.', [['Typical roles','Business, process and product analyst'],['Core skills','Requirements, Agile and stakeholder communication'],['Evidence','Clear documentation and project examples'],['Opportunity','Role availability varies by employer and location']]],
    story: ['Learner outcome','Open a verified outcome card and discuss how the same preparation could apply to your profile.', [['Starting point','Each learner begins with a different background'],['Journey','Training, projects and mentor feedback'],['Proof','Interview-ready documentation and portfolio'],['Result','The published outcome shown on this card']]]
  };
  const openModal = (trigger, type) => {
    if (!modal) return;
    modal.querySelector('.story-enroll')?.setAttribute('hidden','');
    const primaryModalCta = modal.querySelector('.modal-content>.btn');
    if (primaryModalCta) primaryModalCta.textContent = 'Book Free Demo';
    if (type === 'tool') {
      activeToolIndex = Number(trigger.dataset.toolIndex);
      const tool = toolDetails[activeToolIndex];
      const image = trigger.querySelector('img');
      modal.classList.add('tool-modal');
      document.querySelector('#modal-kicker').textContent = 'Core Business Analyst Tools';
      document.querySelector('#modal-title').textContent = tool.name;
      document.querySelector('#modal-summary').textContent = tool.about;
      document.querySelector('#modal-visual').innerHTML = `<img src="${image.src}" alt="${tool.name} official logo">`;
      document.querySelector('#modal-details').innerHTML = [
        ['What is this Tool?',tool.about],['How Business Analysts Use This Tool',tool.use],['Key Features',tool.features],['Career Benefits',tool.benefit],['Skills You’ll Learn',tool.skills],['Real-World Example',tool.example],['Industries Using This Tool',tool.industries],['Where It Is Used','Projects, consulting engagements, delivery teams and enterprise transformation programmes.']
      ].map(([label,value]) => `<div><strong>${label}</strong><span>${value}</span></div>`).join('');
      let nav = modal.querySelector('.tool-modal-nav');
      if (!nav) { nav = document.createElement('div'); nav.className = 'tool-modal-nav'; nav.innerHTML = '<button type="button" data-tool-prev>← Previous</button><span></span><button type="button" data-tool-next>Next →</button>'; modal.querySelector('.modal-content').appendChild(nav); }
      nav.querySelector('span').textContent = `${activeToolIndex + 1} / ${toolDetails.length}`;
    } else if (type === 'story') {
      activeToolIndex = -1;
      activeStoryIndex = storyCards.indexOf(trigger);
      modal.classList.remove('tool-modal'); modal.classList.add('story-modal');
      const title = trigger.querySelector('h3')?.textContent?.trim() || 'COEPD learner';
      const company = trigger.dataset.company || 'Not published';
      const role = trigger.dataset.role || 'Business Analyst';
      const result = trigger.dataset.package || 'Not published';
      const image = trigger.querySelector('img');
      document.querySelector('#modal-kicker').textContent = 'COEPD Success Story';
      document.querySelector('#modal-title').textContent = title;
      document.querySelector('#modal-summary').textContent = `${title} progressed toward an analyst career through structured learning, business projects, mentor feedback, profile preparation and interview practice.`;
      document.querySelector('#modal-visual').innerHTML = `<div class="story-poster"><img src="${image.src}" alt="${image.alt}" loading="eager"><span class="story-image-count">1 / 1</span></div>`;
      document.querySelector('#modal-details').innerHTML = [['Current Company',company],['Current Role',role],['Salary Package',result],['Previous Domain','See published success poster'],['Current Domain','Business Analysis / IT'],['Career Journey',`Previous experience → ${role}`],['Career Gap','Not publicly disclosed'],['Projects Completed','Capstone and practical business projects'],['Tools Learned','JIRA, documentation, process and analytics tools'],['Placement Month','Not publicly disclosed']].map(([label,value],row) => `<div style="--row:${row}"><strong>${label}</strong><span>${value}</span></div>`).join('');
      const cta = modal.querySelector('.modal-content>.btn'); cta.textContent = 'Book Demo'; cta.style.display = '';
      let enroll = modal.querySelector('.story-enroll');
      if (!enroll) { enroll = document.createElement('a'); enroll.className = 'btn btn-outline story-enroll'; enroll.href = demoUrl; enroll.target = '_blank'; enroll.rel = 'noopener noreferrer'; enroll.textContent = 'Enquire Now'; cta.after(enroll); }
      enroll.removeAttribute('hidden');
      let storyNav = modal.querySelector('.story-modal-nav');
      if (!storyNav) { storyNav = document.createElement('nav'); storyNav.className = 'story-modal-nav'; storyNav.setAttribute('aria-label','Browse success stories'); storyNav.innerHTML = '<button type="button" data-story-modal-prev>← Previous Student</button><span></span><button type="button" data-story-modal-next>Next Student →</button>'; modal.querySelector('.modal-content').appendChild(storyNav); }
      storyNav.querySelector('span').textContent = `${activeStoryIndex + 1} / ${storyCards.length}`;
    } else {
      modal.classList.remove('story-modal');
      modal.classList.remove('tool-modal');
    const base = detailCopy[type];
    const title = trigger.querySelector('h3,b')?.textContent?.trim() || trigger.querySelector('img')?.alt || trigger.textContent?.trim() || base[0];
    const summary = trigger.querySelector('p,small')?.textContent?.trim() || base[1];
    document.querySelector('#modal-kicker').textContent = base[0];
    document.querySelector('#modal-title').textContent = title;
    document.querySelector('#modal-summary').textContent = summary;
    document.querySelector('#modal-details').innerHTML = base[2].map(([label,value]) => `<div><strong>${label}</strong><span>${value}</span></div>`).join('');
    const visual = document.querySelector('#modal-visual');
    const image = trigger.querySelector('img');
    visual.innerHTML = image ? `<img src="${image.src}" alt="">` : `<span>${String(title).slice(0,3).toUpperCase()}</span>`;
    }
    modalReturnFocus = trigger;
    modal.hidden = false; modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); dialog?.focus();
  };
  const closeModal = () => {
    if (!modal || modal.hidden || modal.classList.contains('closing')) return;
    modal.classList.add('closing'); modal.setAttribute('aria-hidden','true');
    setTimeout(() => { modal.hidden = true; modal.classList.remove('closing','tool-modal','story-modal'); document.body.classList.remove('modal-open'); modalReturnFocus?.focus(); }, reducedMotion ? 0 : 190);
  };
  document.querySelectorAll('.success-story-card').forEach(card => {
    const copy = card.querySelector('.success-story-copy');
    if (copy && !copy.querySelector('.view-story')) { const button=document.createElement('button'); button.type='button'; button.className='view-story'; button.dataset.storyOpen=''; button.dataset.storyIndex=card.dataset.storyIndex; button.textContent='View Story →'; button.setAttribute('aria-label',`View ${card.querySelector('h3')?.textContent || 'learner'} success story`); copy.appendChild(button); }
  });
  const interactiveGroups = [['#program .card','highlight'],['.feature-cloud span','curriculum'],['.audience-grid article','audience'],['.month-timeline li','journey'],['.project','project'],['.tools>span','tool'],['.commitment-grid article','guarantee'],['.guarantee-grid article','guarantee'],['.partner-card','partner']];
  interactiveGroups.forEach(([selector,type]) => document.querySelectorAll(selector).forEach(item => {
    item.tabIndex = 0; item.setAttribute('role','button'); item.setAttribute('aria-label',`View details: ${item.textContent.trim().replace(/\s+/g,' ')}`);
    item.addEventListener('click', () => openModal(item,type));
    item.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openModal(item,type); } });
    item.addEventListener('pointerdown', event => {
      if (reducedMotion || item.matches('.tools>span')) return;
      const box=item.getBoundingClientRect(), ripple=document.createElement('i'); ripple.className='card-ripple';
      ripple.style.left=`${event.clientX-box.left}px`; ripple.style.top=`${event.clientY-box.top}px`; item.appendChild(ripple);
      ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});
    });
  }));
  // The visible View Story button is the card's keyboard-accessible control.
  // Avoid nesting that button inside another element with button semantics.
  storyTrack?.addEventListener('click', event => {
    const card = event.target.closest('.success-story-card');
    if (!card) return;
    if (event.target.closest('[data-story-open]')) return;
    if (storyWasDragged) { storyWasDragged = false; return; }
    storyWasDragged = false;
    event.preventDefault(); openModal(card,'story');
  });
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-story-open]');
    if (!button) return;
    const index = Number(button.dataset.storyIndex);
    const card = Number.isInteger(index) ? storyCards[index] : button.closest('.success-story-card');
    if (!card) return;
    event.preventDefault(); event.stopPropagation();
    openModal(card,'story');
  }, true);
  modal?.addEventListener('click', event => { if (event.target.closest('[data-modal-close]')) closeModal(); });
  modal?.addEventListener('click', event => {
    const direction = event.target.closest('[data-tool-prev]') ? -1 : event.target.closest('[data-tool-next]') ? 1 : 0;
    if (!direction || activeToolIndex < 0) return;
    openModal(toolCards[(activeToolIndex + direction + toolCards.length) % toolCards.length], 'tool');
    dialog?.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
  });
  modal?.addEventListener('click', event => {
    const direction = event.target.closest('[data-story-modal-prev]') ? -1 : event.target.closest('[data-story-modal-next]') ? 1 : 0;
    if (!direction || activeStoryIndex < 0) return;
    openModal(storyCards[(activeStoryIndex + direction + storyCards.length) % storyCards.length], 'story');
    dialog?.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
  });
  addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (!modal?.hidden && modal.classList.contains('story-modal') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !event.target.matches('input,textarea,select')) {
      event.preventDefault(); const direction = event.key === 'ArrowLeft' ? -1 : 1;
      openModal(storyCards[(activeStoryIndex + direction + storyCards.length) % storyCards.length], 'story');
      dialog?.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
    }
    if (event.key === 'Tab' && modal && !modal.hidden) {
      const focusable = [...modal.querySelectorAll('button,a[href]')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
