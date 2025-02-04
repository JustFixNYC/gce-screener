import { Link } from "react-router-dom";
import "./Footer.scss";

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__content">
      <div className="footer__legal-disclaimer">
        <span>Disclaimer</span>
        The information on this website does not constitute legal advice and
        must not be used as a substitute for the advice of a lawyer qualified to
        give advice on legal issues pertaining to housing.
      </div>
      <nav className="footer__legal-pages">
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
        <a
          href="https://form.typeform.com/to/QUPQjBlI"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          Feedback Form
        </a>
      </nav>
    </div>
    <hr />
    <div className="footer__bottom-bar">
      <div className="footer__name">
        <Link to="/" className="jfcl-link">
          Good Cause NYC
        </Link>
      </div>
      <div className="footer__collab">
        By{" "}
        <a
          href="https://housingjusticeforall.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          HJ4A
        </a>{" "}
        &{" "}
        <a
          href="https://justfix.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          JustFix
        </a>
      </div>
    </div>
  </footer>
);
