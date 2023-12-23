import React, { useState } from 'react';
import styles from './TopbarLanguageSelector.module.css';

const LanguageSelector = ({ currentLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define language subdomains
  const languageSubdomains = {
    en: 'en',
    el: 'el',
    // Add other languages and their subdomains here
  };

  // Language full names
  const languageNames = {
    en: 'English',
    el: 'Ελληνικά',
    // Add other language full names here
  };

  // Language flag emojis
  const languageEmojis = {
    en: '🇬🇧', // Flag emoji for English
    el: '🇬🇷', // Flag emoji for Greek
    // Add other language flag emojis here
  };

  // Function to detect environment (dev or test)
  const detectEnvironment = () => {
    if (window.location.href.includes('.dev.')) {
      return 'dev';
    } else if (window.location.href.includes('.test.')) {
      return 'test';
    }
    return '';
  };

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    const environment = detectEnvironment();
    let newUrl = `https://${languageSubdomains[languageCode]}.sekond.gr`;
    if (environment) {
      newUrl = `https://${languageSubdomains[languageCode]}.${environment}.sekond.gr`;
    }
    window.location.href = newUrl;
  };

  return (
    <div className={styles.languageSelector} onClick={() => setIsOpen(!isOpen)}>
      <div className={styles.currentLanguage}>
        {languageNames[currentLanguage]}
        &nbsp;&nbsp;&nbsp; {/* Add a space between the two elements */}
        <span className={styles.flagEmoji}>{languageEmojis[currentLanguage]}</span>
      </div>
      {isOpen && (
        <div className={styles.languageOptions}>
          {Object.entries(languageNames).map(([code, name]) => (
            <div
              key={code}
              className={styles.languageOption}
              onClick={() => handleLanguageChange(code)}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
