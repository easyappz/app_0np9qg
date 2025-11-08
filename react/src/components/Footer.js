import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-easytag="id1-react/src/components/Footer.js" className="footer">
      <div data-easytag="id2-react/src/components/Footer.js" className="footer-container container">
        <p data-easytag="id3-react/src/components/Footer.js" className="footer-text">
          © {currentYear} Доска объявлений. Все права защищены.
        </p>
      </div>
    </footer>
  );
};

export default Footer;