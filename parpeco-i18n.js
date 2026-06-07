/* Parpeco i18n — shared translation engine */
function getTranslation(key, lang, translations) {
  if (translations[lang] && translations[lang][key] !== undefined) {
    return translations[lang][key];
  }
  if (translations[key] && translations[key][lang] !== undefined) {
    return translations[key][lang];
  }
  return null;
}

function translateNode(node, lang, translations) {
  if (node.nodeType === 3) {
    const text = node.textContent.trim();
    if (text) {
      if (node.originalText === undefined) node.originalText = node.textContent;
      const val = getTranslation(node.originalText.trim(), lang, translations);
      if (val !== null) {
        const leadingWs = node.originalText.match(/^\s*/)[0];
        const trailingWs = node.originalText.match(/\s*$/)[0];
        node.textContent = leadingWs + val + trailingWs;
      } else if (lang === 'fr') {
        node.textContent = node.originalText;
      }
    }
  } else if (node.nodeType === 1) {
    if (node.hasAttribute('data-i18n')) {
      const key = node.getAttribute('data-i18n');
      if (node.originalText === undefined) node.originalText = node.textContent;
      if (node.originalAlt === undefined && node.tagName === 'IMG') {
        node.originalAlt = node.getAttribute('alt') || '';
      }
      if (node.originalPlaceholder === undefined && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
        node.originalPlaceholder = node.getAttribute('placeholder') || '';
      }
      const val = getTranslation(key, lang, translations);
      if (val !== null) {
        if (node.tagName === 'IMG') node.setAttribute('alt', val);
        else if ((node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') && node.hasAttribute('placeholder')) {
          node.setAttribute('placeholder', val);
        } else node.textContent = val;
      } else if (lang === 'fr') {
        if (node.tagName === 'IMG') node.setAttribute('alt', node.originalAlt);
        else if ((node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') && node.hasAttribute('placeholder')) {
          node.setAttribute('placeholder', node.originalPlaceholder || node.getAttribute('placeholder'));
        } else node.textContent = node.originalText;
      }
      return;
    }
    if (node.hasAttribute('placeholder')) {
      if (node.originalPlaceholder === undefined) {
        node.originalPlaceholder = node.getAttribute('placeholder');
      }
      const val = getTranslation(node.originalPlaceholder.trim(), lang, translations);
      if (val !== null) node.setAttribute('placeholder', val);
      else if (lang === 'fr') node.setAttribute('placeholder', node.originalPlaceholder);
    }
    if (node.tagName === 'IMG' && node.hasAttribute('alt') && !node.hasAttribute('data-i18n')) {
      if (node.originalAlt === undefined) node.originalAlt = node.getAttribute('alt');
      const val = getTranslation(node.originalAlt.trim(), lang, translations);
      if (val !== null) node.setAttribute('alt', val);
      else if (lang === 'fr') node.setAttribute('alt', node.originalAlt);
    }
    for (const child of node.childNodes) translateNode(child, lang, translations);
  }
}

function updateLangTrigger(lang) {
  const triggerImg = document.querySelector('.lang-trigger img');
  const triggerSpan = document.querySelector('.lang-trigger span');
  if (!triggerImg || !triggerSpan) return;
  const parts = (triggerImg.getAttribute('src') || '').split('/');
  if (!parts.length) return;
  if (lang === 'fr') {
    parts[parts.length - 1] = 'icons8-france-circulaire-48.png';
    triggerSpan.textContent = 'FR';
  } else if (lang === 'en') {
    parts[parts.length - 1] = 'icons8-angleterre-circulaire-48.png';
    triggerSpan.textContent = 'EN';
  } else if (lang === 'ar') {
    parts[parts.length - 1] = 'icons8-tunisie-circulaire-48.png';
    triggerSpan.textContent = 'AR';
  }
  triggerImg.setAttribute('src', parts.join('/'));
}

function initParpecoI18n(translations) {
  function applyTranslation(lang) {
    translateNode(document.body, lang, translations);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateLangTrigger(lang);
    localStorage.setItem('lang', lang);
  }
  window.switchLang = applyTranslation;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyTranslation(localStorage.getItem('lang') || 'fr');
    });
  } else {
    applyTranslation(localStorage.getItem('lang') || 'fr');
  }
}

/* Common nav & footer keys */
const PARPECO_COMMON_I18N = {
  fr: {
    'header-accueil': 'Accueil',
    'header-apropos': 'À propos',
    'header-durable': 'Développement Durable',
    'header-produit': 'Produit',
    'header-avantages': 'Avantages du produit',
    'header-nos-produits': 'Nos produits',
    'header-services': 'Services',
    'header-contact': 'Contact',

    // Footer
    'footer-liens': 'Liens rapides',
    'footer-contact': 'Informations de contact',
    'footer-infos-legales': 'Informations légales',
    'footer-paragraph': 'Notre priorité est la satisfaction de nos clients. Nous établissons des relations de partenariat basées sur la confiance et la transparence.',
    'footer-check-1': 'Construire vert, bâtir l\'avenir.',
    'footer-check-2': 'Des parpaings écologiques pour un monde durable.',
    'footer-check-3': 'Solidité et écologie, main dans la main.',
    'footer-logo-tagline': 'MATÉRIAUX ÉCOLOGIQUES',
    'footer-legal-link-legal': 'LEGAL',
    'footer-legal-link-cgv': 'CGV',
    'footer-legal-link-reglement': 'RÈGLEMENT',
    'footer-social-whatsapp': 'WhatsApp',
    'footer-social-facebook': 'Facebook',
    'footer-contact-address': 'Route de Tunis Dhehari 8020 SOLIMAN',
    'footer-copy': '© 2026 Parpeco - Tous droits réservés. Bâtir l\'écologie, ensemble.'
  },
  en: {
    'header-accueil': 'Home',
    'header-apropos': 'About',
    'header-durable': 'Sustainability',
    'header-produit': 'Product',
    'header-avantages': 'Product Benefits',
    'header-nos-produits': 'Our Products',
    'header-services': 'Services',
    'header-contact': 'Contact',

    // Footer
    'footer-liens': 'Quick Links',
    'footer-contact': 'Contact information',
    'footer-infos-legales': 'Legal information',
    'footer-paragraph': 'Our priority is customer satisfaction. We build partnership relationships based on trust and transparency.',
    'footer-check-1': 'Build green, shape the future.',
    'footer-check-2': 'Eco-friendly blocks for a sustainable world.',
    'footer-check-3': 'Strength and ecology, side by side.',
    'footer-logo-tagline': 'ECOLOGICAL MATERIALS',
    'footer-legal-link-legal': 'LEGAL',
    'footer-legal-link-cgv': 'Terms',
    'footer-legal-link-reglement': 'POLICY',
    'footer-contact-address': 'Route de Tunis Dhehari 8020 SOLIMAN',
    'footer-copy': '© 2026 Parpeco - All rights reserved. Building ecology, together.'
  },
  ar: {
    'header-accueil': 'الصفحة الرئيسية',
    'header-apropos': 'من نحن',
    'header-durable': 'التنمية المستدامة',
    'header-produit': 'المنتج',
    'header-avantages': 'مزايا المنتج',
    'header-nos-produits': 'منتجاتنا',
    'header-services': 'الخدمات',
    'header-contact': 'اتصل بنا',

    // Footer
    'footer-liens': 'روابط سريعة',
    'footer-contact': 'معلومات الاتصال',
    'footer-infos-legales': 'المعلومات القانونية',
    'footer-paragraph': 'أولوية Parpeco هي رضا عملائنا. نحن نبني علاقات شراكة قائمة على الثقة والشفافية.',
    'footer-check-1': 'بنِ أخضر… واصنع المستقبل.',
    'footer-check-2': 'بلوكات بيئية لعالم مستدام.',
    'footer-check-3': 'متانة وبيئة معاً، جنباً إلى جنب.',
    'footer-logo-tagline': 'مُواد بيئية',
    'footer-legal-link-legal': 'قانوني',
    'footer-legal-link-cgv': 'الشروط',
    'footer-legal-link-reglement': 'اللوائح',
    'footer-contact-address': 'Route de Tunis Dhehari 8020 SOLIMAN',
    'footer-copy': '© 2026 Parpeco - جميع الحقوق محفوظة. نبني البيئة معاً.'
  }
};

function mergeI18n(...objects) {
  const out = { fr: {}, en: {}, ar: {} };
  for (const obj of objects) {
    for (const lang of ['fr', 'en', 'ar']) {
      if (obj[lang]) Object.assign(out[lang], obj[lang]);
    }
  }
  return out;
}
