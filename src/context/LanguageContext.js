import React, { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  en: {
    // Navbar
    'nav.explore': 'Explore eBooks',
    'nav.success': 'Success Stories',
    'nav.how': 'How It Works',
    'nav.about': 'About Us',
    'nav.blog': 'Blog',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.login': 'Login / Sign Up',
    'nav.library': 'My Library',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'nav.cta': 'Start Earning Now',
    'nav.announcement': 'Learn Skills That Can Help You Earn ₹1L–₹10L/Month',
    // Hero
    'hero.badge': "India's Fastest Growing Platform",
    'hero.title1': 'Learn the System to Turn',
    'hero.title2': 'Knowledge Into ₹10 Lakh/Month Income',
    'hero.subtitle': 'Step-by-step blueprint ebooks to help you earn ₹5L–₹20L per month. Proven strategies from industry experts.',
    'hero.offer': 'Offer ends in:',
    'hero.viewAll': 'View All Ebooks',
    'hero.getStarted': 'Get Started Free',
    // Stats
    'stats.students': 'Students Guided',
    'stats.blueprints': 'Income Blueprints',
    'stats.opportunities': 'Career Opportunities',
    'stats.success': 'Success Rate',
    // Featured
    'featured.title': 'Featured Income Blueprints',
    'featured.subtitle': 'Carefully crafted guides to help you build sustainable income streams',
    'featured.viewAll': 'View All Ebooks',
    // How It Works
    'how.title': 'How It Works',
    'how.subtitle': 'Start your income journey in 3 simple steps',
    'how.step1.title': 'Choose Your Blueprint',
    'how.step1.desc': 'Browse our collection of income blueprints and pick the one that matches your goals and interests.',
    'how.step2.title': 'Learn & Implement',
    'how.step2.desc': 'Follow the step-by-step guides with actionable strategies, templates, and real-world examples.',
    'how.step3.title': 'Start Earning',
    'how.step3.desc': 'Apply what you learn and start building sustainable income streams. Get community support along the way.',
    // About/Govt
    'govt.badge': 'Government Recognized',
    'govt.title': 'India Needs 20 Lakh+ Career Counselors',
    'govt.cta': 'Start Your Career Counseling Business',
    // Testimonials
    'testimonials.title': 'Success Stories',
    'testimonials.subtitle': 'Real results from real people who took action',
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Got questions? We have answers.',
    // CTA
    'cta.title': 'Ready to Transform Your Income?',
    'cta.subtitle': 'Join 10,000+ professionals who have already taken the first step',
    'cta.button': 'Browse All Ebooks',
    // Footer
    'footer.desc': 'Empowering professionals and entrepreneurs with knowledge-based income blueprints.',
    'footer.quickLinks': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.contactUs': 'Contact Us',
    // Common
    'common.buyNow': 'Buy Now',
    'common.readMore': 'Read More',
    'common.loading': 'Loading...',
  },
  hi: {
    // Navbar
    'nav.explore': 'ई-बुक्स देखें',
    'nav.success': 'सफलता की कहानियां',
    'nav.how': 'कैसे काम करता है',
    'nav.about': 'हमारे बारे में',
    'nav.blog': 'ब्लॉग',
    'nav.faq': 'अक्सर पूछे जाने वाले प्रश्न',
    'nav.contact': 'संपर्क करें',
    'nav.login': 'लॉगिन / साइन अप',
    'nav.library': 'मेरी लाइब्रेरी',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.logout': 'लॉगआउट',
    'nav.cta': 'अभी कमाना शुरू करें',
    'nav.announcement': 'ऐसी स्किल्स सीखें जो ₹1L–₹10L/महीना कमाने में मदद करें',
    // Hero
    'hero.badge': 'भारत का सबसे तेज़ बढ़ता प्लेटफॉर्म',
    'hero.title1': 'ज्ञान को',
    'hero.title2': '₹10 लाख/महीना आय में बदलने की प्रणाली सीखें',
    'hero.subtitle': 'हर महीने ₹5L–₹20L कमाने के लिए स्टेप-बाय-स्टेप ब्लूप्रिंट ई-बुक्स। इंडस्ट्री एक्सपर्ट्स की सिद्ध रणनीतियां।',
    'hero.offer': 'ऑफर समाप्त होने में:',
    'hero.viewAll': 'सभी ई-बुक्स देखें',
    'hero.getStarted': 'मुफ्त शुरू करें',
    // Stats
    'stats.students': 'छात्रों को गाइड किया',
    'stats.blueprints': 'आय ब्लूप्रिंट्स',
    'stats.opportunities': 'करियर के अवसर',
    'stats.success': 'सफलता दर',
    // Featured
    'featured.title': 'विशेष आय ब्लूप्रिंट्स',
    'featured.subtitle': 'स्थायी आय धाराओं के निर्माण में मदद करने वाली गाइड्स',
    'featured.viewAll': 'सभी ई-बुक्स देखें',
    // How It Works
    'how.title': 'कैसे काम करता है',
    'how.subtitle': '3 आसान चरणों में अपनी आय यात्रा शुरू करें',
    'how.step1.title': 'अपना ब्लूप्रिंट चुनें',
    'how.step1.desc': 'आय ब्लूप्रिंट्स का हमारा संग्रह ब्राउज़ करें और अपने लक्ष्यों से मेल खाने वाला चुनें।',
    'how.step2.title': 'सीखें और लागू करें',
    'how.step2.desc': 'कार्रवाई योग्य रणनीतियों, टेम्प्लेट्स और वास्तविक उदाहरणों के साथ स्टेप-बाय-स्टेप गाइड फॉलो करें।',
    'how.step3.title': 'कमाना शुरू करें',
    'how.step3.desc': 'जो सीखा उसे लागू करें और स्थायी आय धाराएं बनाना शुरू करें।',
    // About/Govt
    'govt.badge': 'सरकार द्वारा मान्यता प्राप्त',
    'govt.title': 'भारत को 20 लाख+ करियर काउंसलर की जरूरत है',
    'govt.cta': 'अपना करियर काउंसलिंग व्यवसाय शुरू करें',
    // Testimonials
    'testimonials.title': 'सफलता की कहानियां',
    'testimonials.subtitle': 'कार्रवाई करने वाले वास्तविक लोगों के वास्तविक परिणाम',
    // FAQ
    'faq.title': 'अक्सर पूछे जाने वाले प्रश्न',
    'faq.subtitle': 'प्रश्न हैं? हमारे पास उत्तर हैं।',
    // CTA
    'cta.title': 'अपनी आय बदलने के लिए तैयार?',
    'cta.subtitle': '10,000+ पेशेवरों से जुड़ें जिन्होंने पहले ही पहला कदम उठाया है',
    'cta.button': 'सभी ई-बुक्स ब्राउज़ करें',
    // Footer
    'footer.desc': 'ज्ञान-आधारित आय ब्लूप्रिंट्स के साथ पेशेवरों और उद्यमियों को सशक्त बनाना।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.legal': 'कानूनी',
    'footer.contactUs': 'संपर्क करें',
    // Common
    'common.buyNow': 'अभी खरीदें',
    'common.readMore': 'और पढ़ें',
    'common.loading': 'लोड हो रहा है...',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('vk_lang') || 'en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('vk_lang', next);
      return next;
    });
  }, []);

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
