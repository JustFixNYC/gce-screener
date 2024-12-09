import { Link, To } from "react-router-dom";
import "./Footer.scss";

const SITE_LINKS: LinkWithLabel[] = [
  { label: "Page 1", path: "/" },
  { label: "Page 2", path: "/" },
  { label: "Page 3", path: "/" },
  { label: "Page 4", path: "/" },
  { label: "Page 5", path: "/" },
];

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__content">
      <FooterLinksList links={SITE_LINKS} />
      <div className="footer__divider" />
      <div className="footer__legal_disclaimer">
        Disclaimer: The information in JustFix does not constitute legal advice
        and must not be used as a substitute for the advice of a lawyer
        qualified to give advice on legal issues pertaining to housing. We can
        help direct you to free legal services if necessary.
      </div>
      <div className="footer__legal_pages">
        <a
          href="https://www.justfix.org/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          Privacy Policy
        </a>
        <a
          href="https://www.justfix.org/terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          Terms of Use
        </a>
      </div>
    </div>
  </footer>
);

type LinkWithLabel = { label: string; path: To };

const FooterLink: React.FC<{ link: LinkWithLabel }> = ({ link }) => (
  <Link to={link.path} className="jfcl-link">
    {link.label}
  </Link>
);

const FooterLinksList: React.FC<{ links: LinkWithLabel[] }> = ({ links }) => {
  return (
    <div className="footer__page_links">
      {links.map((link, i) => {
        if (i % 2 === 0) {
          return (
            <div className="footer__page_links__column" key={i}>
              <FooterLink link={link} />
              {!!links[i + 1] && <FooterLink link={links[i + 1]} />}
            </div>
          );
        } else return;
      })}
    </div>
  );
};
