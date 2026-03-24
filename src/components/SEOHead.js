import { useEffect } from 'react';

const SEOHead = ({ title, description, path, image }) => {
  const siteName = 'VigyaanKart';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - The Science of Smart Earning`;
  const fullDesc = description || 'Step-by-step blueprint ebooks to help you earn lakhs per month. Proven strategies from industry experts.';

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, property) => {
      const attr = property ? 'property' : 'name';
      const key = property || name;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', fullDesc);
    setMeta(null, fullTitle, 'og:title');
    setMeta(null, fullDesc, 'og:description');
    setMeta(null, 'website', 'og:type');
    setMeta(null, siteName, 'og:site_name');
    if (path) setMeta(null, `${window.location.origin}${path}`, 'og:url');
    if (image) setMeta(null, image, 'og:image');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', fullDesc);
    setMeta('robots', 'index, follow');
    setMeta('author', 'VigyaanKart');

    // Set canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    if (path) canonical.setAttribute('href', `${window.location.origin}${path}`);
  }, [fullTitle, fullDesc, path, image]);

  return null;
};

export default SEOHead;
