import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOByPath, defaultSEO, SITE_NAME, SITE_URL } from '../data/seoData';

/**
 * Reusable, dynamic SEO component for managing title, meta description,
 * keywords, canonical link, Open Graph, Twitter Cards, and JSON-LD schema.
 */
export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema,
}) {
  const location = useLocation();
  const pathSEO = getSEOByPath(location.pathname);

  const finalTitle = title || pathSEO.title || defaultSEO.title;
  const finalDescription = description || pathSEO.description || defaultSEO.description;
  const finalKeywords = keywords || pathSEO.keywords || defaultSEO.keywords;
  const finalImage = image || pathSEO.image || defaultSEO.image;
  const canonicalUrl = url || `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    // 1. Set document title
    document.title = finalTitle;

    // Helper: update or create <meta>
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper: update or create <link>
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', finalDescription);
    setMetaTag('name', 'keywords', finalKeywords);

    // 3. Canonical URL
    setLinkTag('canonical', canonicalUrl);

    // 4. Open Graph Tags (Facebook, WhatsApp, LinkedIn)
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:site_name', SITE_NAME);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);

    // 6. JSON-LD Structured Data for Google
    const schemaScriptId = 'page-jsonld-schema';
    let scriptTag = document.getElementById(schemaScriptId);

    const baseSchema = schema || {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      publisher: {
        '@type': 'NGO',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/ngo-logo.png`
      }
    };

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaScriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(baseSchema);

  }, [finalTitle, finalDescription, finalKeywords, finalImage, canonicalUrl, type, schema]);

  return null;
}
