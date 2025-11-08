import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div data-easytag="id1-react/src/components/Layout.js" className="layout">
      <Header />
      <main data-easytag="id2-react/src/components/Layout.js" className="layout-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;