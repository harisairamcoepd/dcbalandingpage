(() => {
  const root = document.documentElement;
  const gate = document.querySelector('#lead-gate');
  const form = document.querySelector('#gate-form');
  const processing = document.querySelector('.gate-processing');
  const success = document.querySelector('.gate-success');
  const explore = document.querySelector('#explore-program');
  if (!gate || !form) return;

  let unlocked = false;
  try { unlocked = sessionStorage.getItem('dcbaLeadSubmitted') === 'true'; } catch (error) { unlocked = false; }
  if (unlocked) {
    root.classList.remove('lead-gated');
    root.classList.add('lead-unlocked');
    gate.hidden = true;
    return;
  }

  const messageFor = field => {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    if (!value) return field.type === 'checkbox' ? 'Consent is required.' : 'This field is required.';
    if (field.name === 'name' && field.value.trim().length < 3) return 'Enter your full name.';
    if (field.name === 'phone' && field.value.replace(/\D/g, '').length !== 10) return 'Enter a valid 10-digit mobile number.';
    if (field.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) return 'Enter a valid email address.';
    if (field.name === 'goal' && field.value.trim().length < 10) return 'Please describe your career goal in at least 10 characters.';
    return '';
  };

  const validateField = field => {
    const message = messageFor(field);
    const label = field.closest('label');
    label?.classList.toggle('invalid', Boolean(message));
    const error = label?.querySelector('small');
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  };

  form.querySelectorAll('input,select,textarea').forEach(field => {
    field.addEventListener(field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.closest('label')?.classList.contains('invalid')) validateField(field); });
  });

  const celebrate = () => {
    const colors = ['#f97316','#163d8c','#22c55e','#facc15','#60a5fa'];
    for (let index = 0; index < 34; index += 1) {
      const piece = document.createElement('i');
      piece.className = 'gate-confetti';
      piece.style.left = `${8 + Math.random() * 84}%`;
      piece.style.setProperty('--x', `${-90 + Math.random() * 180}px`);
      piece.style.setProperty('--confetti', colors[index % colors.length]);
      piece.style.animationDelay = `${Math.random() * .25}s`;
      gate.querySelector('.gate-card')?.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove(), {once:true});
    }
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = [...form.querySelectorAll('input,select,textarea')];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      sessionStorage.setItem('dcbaLeadData', JSON.stringify({...data, submittedAt:new Date().toISOString()}));
      sessionStorage.setItem('dcbaLeadSubmitted', 'true');
    } catch (error) {
      /* Continue the in-page experience when storage is unavailable. */
    }
    form.hidden = true;
    processing.hidden = false;
    window.setTimeout(() => {
      processing.hidden = true;
      success.hidden = false;
      celebrate();
      explore?.focus();
    }, 1300);
  });

  explore?.addEventListener('click', () => {
    root.classList.remove('lead-gated');
    root.classList.add('lead-unlocked');
    gate.setAttribute('aria-hidden','true');
    window.setTimeout(() => { gate.hidden = true; document.querySelector('#home')?.scrollIntoView(); }, 650);
  });
})();
