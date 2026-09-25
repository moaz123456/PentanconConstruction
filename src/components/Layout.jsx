import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingSocial from './FloatingSocial';

export default function Layout() {
  const { pathname } = useLocation();

  // New page = start at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <FloatingSocial />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
