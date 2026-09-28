import React, { useEffect, useMemo } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqJsonLdProps {
  faqs: FaqItem[];
  id?: string;
  pageUrl?: string;
  pageTitle?: string;
  description?: string;
}

/**
 * Injects Schema.org FAQPage JSON-LD structured data into both the DOM tree
 * and the document.head for maximum Google search visibility and Rich Snippet eligibility.
 */
export const FaqJsonLd: React.FC<FaqJsonLdProps> = ({
  faqs,
  id = 'faq-jsonld-schema',
  pageUrl,
  pageTitle = 'Frequently Asked Questions | SafeNet Security Solutions',
  description = 'Frequently asked questions regarding SafeNet Security operational protocols, NSCDC Category A licensing, guard vetting, 24/7 CCTV surveillance, and offshore maritime escorts.'
}) => {
  // Construct the standardized Schema.org FAQPage payload conforming to Google's Search Central Rich Snippet guidelines
  const schemaData = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;

    const questions = faqs.map((item) => ({
      '@type': 'Question',
      name: item.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.trim()
      }
    }));

    const resolvedUrl = typeof window !== 'undefined' 
      ? (pageUrl || window.location.href)
      : pageUrl;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: pageTitle.trim(),
      description: description.trim(),
      ...(resolvedUrl ? { url: resolvedUrl } : {}),
      mainEntity: questions
    };
  }, [faqs, pageUrl, pageTitle, description]);

  // Sync to document.head for automated crawlers and Schema.org rich result validators
  useEffect(() => {
    if (!schemaData || typeof document === 'undefined') return;

    const scriptId = `schema-${id}`;
    let existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!existingScript) {
      existingScript = document.createElement('script');
      existingScript.id = scriptId;
      existingScript.type = 'application/ld+json';
      document.head.appendChild(existingScript);
    }

    existingScript.textContent = JSON.stringify(schemaData, null, 2);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [schemaData, id]);

  if (!schemaData) return null;

  return (
    <script
      id={`script-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData, null, 2) }}
    />
  );
};
