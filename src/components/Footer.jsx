import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import logo from '../assets/logo.png';
import { site } from '../config/site';
import { useCategoryList } from '../api/hooks';
import { slugify } from '../utils/format';
import SocialLinks from './SocialLinks';
import WhatsAppIcon from './WhatsAppIcon';
import { gmailLink, whatsappLink } from '../utils/links';

export default function Footer() {
  const { categories } = useCategoryList();
  const { email, phone, whatsapp, address } = site.contact;

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src={logo} alt={site.name} width="220" height="53" loading="lazy" />
          <p>Construction and finishing for coastal, residential, commercial and corporate spaces.</p>
          <SocialLinks />
        </div>

        <nav aria-label="Footer">
          <p className="site-footer__heading">Explore</p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/clients">Clients</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <nav aria-label="Projects">
          <p className="site-footer__heading">Projects</p>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link to={`/projects/category/${slugify(category.name)}`}>{category.name}</Link>
              </li>
            ))}
            <li><Link to="/projects">All projects</Link></li>
          </ul>
        </nav>

        <div>
          <p className="site-footer__heading">Get in touch</p>
          <ul className="site-footer__contact">
            {email && (<li><Mail size={16} aria-hidden="true" /><a href={gmailLink(email)} target="_blank" rel="noopener noreferrer">{email}</a></li>)}
            {phone && (<li><Phone size={16} aria-hidden="true" /><a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a></li>)}
            {whatsapp && (
              <li>
                <WhatsAppIcon size={16} aria-hidden="true" />
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer">
                  {whatsapp}
                </a>
              </li>
            )}
            {address && (<li><MapPin size={16} aria-hidden="true" /><span>{address}</span></li>)}
            <li><Link className="link-underline" to="/contact">Send us a message</Link></li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__legal">
        <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <Link className="admin-link" to="/admin/login">Admin</Link>
      </div>
    </footer>
  );
}
