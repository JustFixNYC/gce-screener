import "./Footer.scss";

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__content">
      <div className="footer__legal_disclaimer">
        Disclaimer: The information in JustFix does not constitute legal advice
        and must not be used as a substitute for the advice of a lawyer
        qualified to give advice on legal issues pertaining to housing. We can
        help direct you to free legal services if necessary.
      </div>
      <nav className="footer__legal_pages">
        <a
          href="privacy_policy"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          Privacy Policy
        </a>
        <a
          href="terms_of_use"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          Terms of Use
        </a>
      </nav>
    </div>
  </footer>
);
