import React, { useEffect, useState } from 'react';
import { useConfiguration } from '../../context/configurationContext';
import loadable from '@loadable/component';

const SectionBuilder = loadable(
  () => import('../PageBuilder/PageBuilder'),
  {
    resolveComponent: components => components.SectionBuilder,
  }
);

const translateContent = async (content, targetLanguage, apiKey) => {
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
    method: "POST",
    body: JSON.stringify({
      q: content,
      target: targetLanguage
    }),
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  return data.data.translations[0].translatedText;
};

const FooterComponent = () => {
  const { footer = {} } = useConfiguration();
  const [translatedFooter, setTranslatedFooter] = useState(null);
  const apiKey = 'AIzaSyAptPNvdvfher2FNhlYCymWE5kI8kT0R1w';

  useEffect(() => {
    if (Object.keys(footer).length === 0) {
      return;
    }

    const translateFooter = async () => {
      const targetLanguage = window.location.hostname.startsWith('en.') ? 'en' : 'el';

      // Translate blocks
      for (let i = 0; i < footer.blocks.length; i++) {
        const block = footer.blocks[i];
        footer.blocks[i].text.content = await translateContent(block.text.content, targetLanguage, apiKey);
      }

      // Translate slogan and copyright
      const translatedSlogan = await translateContent(footer.slogan.content, targetLanguage, apiKey);
      const translatedCopyright = await translateContent(footer.copyright.content, targetLanguage, apiKey);
      setTranslatedFooter({
        ...footer,
        slogan: { ...footer.slogan, content: translatedSlogan },
        copyright: { ...footer.copyright, content: translatedCopyright }
      });
    };

    translateFooter();
  }, [footer]);

  if (!translatedFooter) {
    return <div>Loading...</div>;
  }

  const footerSection = {
    ...translatedFooter,
    sectionId: 'footer',
    sectionType: 'footer',
  };

  return <SectionBuilder sections={[footerSection]} />;
};

export default FooterComponent;
