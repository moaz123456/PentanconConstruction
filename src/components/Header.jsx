import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { site } from '../config/site';
import { useCategoryList } from '../api/hooks';
import { imageForCategory } from '../content/categories';
import { slugify } from '../utils/format';
import SocialLinks from './SocialLinks';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About us' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects', mega: true },
  { to: '/clients', label: 'Clients' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact', label: 'Contact' }
];

const categoryPath = (category) => `/projects/category/${slugify(category.name)}`;

export default function Header() {
  const { pathname } = useLocation();
  const { categories } = useCategoryList();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const overHero = pathname === '/';
  const solid = scrolled || !overHero || megaOpen || drawerOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus whenever the page changes.
  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setMegaOpen(false);
      setDrawerOpen(false);
    }
  };

  return (
    <header className={`site-header ${solid ? 'is-solid' : ''}`.trim()} onKeyDown={handleKeyDown}>
      <div className="site-header__bar">
        <Link className="brand" to="/" aria-label={`${site.name} - home`}>
          <img src={logo} alt="" width="200" height="48" />
        </Link>

        <nav className="nav" aria-label="Main">
          <ul className="nav__list">
            {links.map((link) =>
              link.mega ? (
                <li
                  key={link.to}
                  className="nav__item nav__item--mega"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                  onFocus={() => setMegaOpen(true)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setMegaOpen(false);
                  }}
                >
                  <NavLink className="nav__link" to={link.to} aria-haspopup="true" aria-expanded={megaOpen}>
                    {link.label}
                    <ChevronDown size={15} aria-hidden="true" className={megaOpen ? 'is-flipped' : ''} />
                  </NavLink>

                  <div className={`mega ${megaOpen ? 'is-open' : ''}`.trim()}>
                    <div className="mega__inner">
                      <div className="mega__intro">
                        <p className="mega__title">Projects</p>
                        <p className="mega__text">Browse our work by sector.</p>
                        <Link className="link-underline" to="/projects" tabIndex={megaOpen ? 0 : -1}>
                          View all projects
                        </Link>
                      </div>
                      <ul className="mega__grid">
                        {categories.map((category) => {
                          const image = imageForCategory(category);
                          return (
                            <li key={category.id}>
                              <Link className="mega__card" to={categoryPath(category)} tabIndex={megaOpen ? 0 : -1}>
                                <span className="mega__thumb">
                                  {image ? <img src={image} alt="" loading="lazy" /> : <span className="mega__thumb-fallback" />}
                                </span>
                                <span className="mega__name">{category.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.to} className="nav__item">
                  <NavLink className="nav__link" to={link.to} end={link.end}>
                    {link.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>

        <button
          className="menu-button"
          type="button"
          onClick={() => setDrawerOpen((open) => !open)}
          aria-expanded={drawerOpen}
          aria-controls="mobile-menu"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
        >
          {drawerOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div id="mobile-menu" className={`drawer ${drawerOpen ? 'is-open' : ''}`.trim()} hidden={!drawerOpen}>
        <nav aria-label="Mobile">
          <ul className="drawer__list">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink className="drawer__link" to={link.to} end={link.end}>
                  {link.label}
                </NavLink>
                {link.mega && (
                  <ul className="drawer__sub">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link to={categoryPath(category)}>{category.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks className="drawer__social" />
      </div>
    </header>
  );
}
