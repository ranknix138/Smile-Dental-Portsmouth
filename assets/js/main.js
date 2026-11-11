/* ==========================================================================
   One Smile Dental - Portsmouth | High-Conversion Interactive Controller
   ========================================================================== */
(function () {
  'use strict';

  // 1. Mobile Top Hamburger Drawer
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
    mobileDrawer.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Mobile Bottom Nav "Services" Quick-Sheet
  const sheetBackdrop = document.getElementById('services-sheet-backdrop');
  const openSheetBtns = document.querySelectorAll('[data-open-services-sheet]');
  const closeSheetBtn = document.getElementById('close-services-sheet');

  function openSheet() {
    if (!sheetBackdrop) return;
    sheetBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    if (!sheetBackdrop) return;
    sheetBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openSheetBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openSheet();
    });
  });

  if (closeSheetBtn) closeSheetBtn.addEventListener('click', closeSheet);
  if (sheetBackdrop) {
    sheetBackdrop.addEventListener('click', function (e) {
      if (e.target === sheetBackdrop) closeSheet();
    });
  }

  // 3. Instant Callback / Lead Capture Modal
  const leadModal = document.getElementById('lead-modal');
  const closeLeadModal = document.getElementById('close-lead-modal');
  const modalLeadForm = document.getElementById('modal-lead-form');
  const modalLeadSuccess = document.getElementById('modal-lead-success');
  const modalLeadTopic = document.getElementById('modal-lead-topic');

  function openLeadModal(topic) {
    if (!leadModal) return;
    closeSheet();
    if (modalLeadForm && modalLeadSuccess) {
      modalLeadForm.style.display = '';
      modalLeadSuccess.style.display = 'none';
    }
    if (modalLeadTopic && topic) {
      for (let i = 0; i < modalLeadTopic.options.length; i++) {
        if (modalLeadTopic.options[i].value === topic) {
          modalLeadTopic.selectedIndex = i;
          break;
        }
      }
    }
    leadModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLead() {
    if (!leadModal) return;
    leadModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-lead-modal]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openLeadModal(btn.getAttribute('data-lead-topic') || '');
    });
  });

  if (closeLeadModal) closeLeadModal.addEventListener('click', closeLead);
  if (leadModal) {
    leadModal.addEventListener('click', function (e) {
      if (e.target === leadModal) closeLead();
    });
  }

  function pushDataLayer(eventName, payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
  }

  // 4. Lead, Hero & Contact Page Forms
  function wireLeadForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (!form || !success) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      success.style.display = 'block';
      pushDataLayer('lead_form_submit', { form_id: formId });
    });
  }
  wireLeadForm('modal-lead-form', 'modal-lead-success');
  wireLeadForm('home-callback-form', 'home-callback-success');
  wireLeadForm('practice-enquiry-form', 'enquiry-success');

  // 4a. Phone Call & Online Portal Click Tracking for GTM
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      pushDataLayer('phone_call_click', { phone_number: href.slice(4), link_url: href });
    } else if (href.indexOf('portal.dental') !== -1) {
      pushDataLayer('online_booking_click', { link_url: href });
    }
  });

  // 4b. 3-in-1 Patient Experience Spotlight Tabs
  const spotTabs = document.querySelectorAll('[data-spot-tab]');
  const spotPanels = document.querySelectorAll('[data-spot-panel]');
  if (spotTabs.length && spotPanels.length) {
    spotTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-spot-tab');
        spotTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        spotPanels.forEach(function (p) {
          p.classList.toggle('hidden-spot', p.getAttribute('data-spot-panel') !== target);
        });
      });
    });
  }

  // 5. Interactive Dental Services Category Switcher
  const catButtons = document.querySelectorAll('[data-cat-tab]');
  const serviceCards = document.querySelectorAll('.service-card[data-cat]');
  if (catButtons.length && serviceCards.length) {
    catButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const selected = btn.getAttribute('data-cat-tab');
        catButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        serviceCards.forEach(function (card) {
          const cats = (card.getAttribute('data-cat') || '').split(/\s+/);
          card.classList.toggle('hidden-card', !(selected === 'all' || cats.includes(selected)));
        });
      });
    });
  }

  // 6. Interactive Homepage Fee Tabs (NHS vs Private)
  const homeFeeTabs = document.querySelectorAll('[data-home-fee-tab]');
  const homeFeePanels = document.querySelectorAll('[data-home-fee-panel]');
  if (homeFeeTabs.length && homeFeePanels.length) {
    homeFeeTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-home-fee-tab');
        homeFeeTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        homeFeePanels.forEach(function (p) {
          p.style.display = p.getAttribute('data-home-fee-panel') === target ? '' : 'none';
        });
      });
    });
  }

  // 7. Interactive Fee Page Tabs (on nhs-fees.html)
  const feeTabs = document.querySelectorAll('[data-fee-tab]');
  const feePanels = document.querySelectorAll('[data-fee-panel]');
  if (feeTabs.length && feePanels.length) {
    feeTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-fee-tab');
        feeTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        feePanels.forEach(function (panel) {
          const show = target === 'all' || panel.getAttribute('data-fee-panel') === target;
          panel.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // 8. FAQ Accordion
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const item = trigger.closest('.faq-item');
      if (!item) return;
      const wasOpen = item.classList.contains('open');
      const list = item.closest('.faq-list');
      if (list) {
        list.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          openItem.classList.remove('open');
        });
      }
      if (!wasOpen) item.classList.add('open');
    });
  });

  // 9. Gallery Lightbox
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('gallery-lightbox-img');
  const lightboxCaption = document.getElementById('gallery-lightbox-caption');
  const closeLightbox = document.getElementById('close-gallery-lightbox');

  document.querySelectorAll('[data-lightbox-src]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = el.getAttribute('data-lightbox-src');
      lightboxImg.alt = el.getAttribute('data-lightbox-caption') || 'One Smile Dental Portsmouth';
      if (lightboxCaption) lightboxCaption.textContent = el.getAttribute('data-lightbox-caption') || '';
      lightbox.classList.add('open');
    });
  });

  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener('click', function () { lightbox.classList.remove('open'); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  // 10. News Article Reader Modal
  const articleModal = document.getElementById('article-modal');
  const articleTitle = document.getElementById('article-modal-title');
  const articleDate = document.getElementById('article-modal-date');
  const articleBody = document.getElementById('article-modal-body');
  const closeArticle = document.getElementById('close-article-modal');

  const ARTICLES = {
    'white-fillings': {
      date: 'April 7, 2026',
      title: 'The Benefits of White Fillings for a Natural Looking Smile',
      paragraphs: [
        'White fillings are a popular choice for repairing teeth because they combine strength with excellent cosmetic results. At One Smile Dental - Portsmouth we use high quality composite materials that blend with your natural tooth colour, making them ideal for visible areas of your smile.',
        'Composite fillings bond directly to the tooth which means less drilling is needed and more healthy structure can be preserved. They are suitable for both front and back teeth and can treat decay, small chips and worn edges.',
        'Patients across Portsmouth often choose white fillings for their natural appearance and long lasting result. If you have older metal fillings or a tooth that needs repair, talk to our team about upgrading to composite for a discreet and effective solution.'
      ]
    },
    'regular-checkups': {
      date: 'March 10, 2026',
      title: 'Why Regular Check Ups at One Smile Dental - Portsmouth Matter for Your Long Term Oral Health',
      paragraphs: [
        'Regular dental check ups are one of the most effective ways to protect your oral health. At One Smile Dental - Portsmouth we recommend attending routine appointments so potential problems can be spotted early before they become more complex or uncomfortable.',
        'During a check up, your dentist will examine your teeth and gums, assess any changes since your last visit and give personalised advice to keep your mouth healthy. Early detection helps prevent decay and gum disease and also allows us to monitor any existing fillings or restorations.',
        'For families across Portsmouth, consistent dental care plays an important role in maintaining confident smiles. If it has been a while since your last visit, booking a check up is a simple step with long term benefits for your oral health.'
      ]
    }
  };

  document.querySelectorAll('[data-article-open]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const key = btn.getAttribute('data-article-open');
      const data = ARTICLES[key];
      if (!data || !articleModal) return;
      articleDate.textContent = data.date;
      articleTitle.textContent = data.title;
      articleBody.innerHTML = data.paragraphs.map(function (p) {
        return '<p style="margin-bottom:0.9rem;color:#475569;font-size:0.95rem;">' + p + '</p>';
      }).join('');
      articleModal.classList.add('open');
    });
  });

  if (closeArticle && articleModal) {
    closeArticle.addEventListener('click', function () { articleModal.classList.remove('open'); });
    articleModal.addEventListener('click', function (e) {
      if (e.target === articleModal) articleModal.classList.remove('open');
    });
  }

  // 11. Active Nav & Mobile Bottom Bar Highlighting
  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
    const pages = (link.getAttribute('data-page') || '').split(',');
    if (pages.includes(currentFile) || (currentFile === '' && pages.includes('index.html'))) {
      link.classList.add('active');
    }
  });
  document.querySelectorAll('.mbnit[data-page]').forEach(function (item) {
    const pages = (item.getAttribute('data-page') || '').split(',');
    if (pages.includes(currentFile) || (currentFile === '' && pages.includes('index.html'))) {
      item.classList.add('active');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSheet();
      closeLead();
      if (lightbox) lightbox.classList.remove('open');
      if (articleModal) articleModal.classList.remove('open');
    }
  });
})();
