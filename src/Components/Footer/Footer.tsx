import { Link } from "react-router-dom";
import { Trans } from "@lingui/react/macro";

import { LocaleToggle } from "../LocaleToggle/LocaleToggle";
import "./Footer.scss";

export const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer__content">
      <div>
        <div className="footer__locale-toggle">
          <span>
            <Trans>Language</Trans>:
          </span>{" "}
          <LocaleToggle />
        </div>

        <div className="footer__legal-disclaimer">
          <span>
            <Trans>Disclaimer</Trans>
          </span>
          <Trans>
            The information on this website does not constitute legal advice and
            must not be used as a substitute for the advice of a lawyer
            qualified to give advice on legal issues pertaining to housing.
          </Trans>
        </div>
      </div>
      <nav className="footer__legal-pages">
        <a
          href="privacy_policy"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          <Trans>Privacy Policy</Trans>
        </a>
        <a
          href="terms_of_use"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          <Trans>Terms of Use</Trans>
        </a>
        <a
          href="https://form.typeform.com/to/QUPQjBlI"
          target="_blank"
          rel="noopener noreferrer"
          className="jfcl-link"
        >
          <Trans>Feedback Form</Trans>
        </a>
      </nav>
    </div>
    <hr />
    <div className="footer__bottom-bar">
      <div className="footer__name">
        <Link to="/" className="jfcl-link">
          <Trans>Good Cause NYC</Trans>
        </Link>
      </div>
      <div className="footer__collab">
        <Trans>
          By{" "}
          <a
            href="https://housingjusticeforall.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="jfcl-link"
          >
            Housing Justice for All
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
        </Trans>
      </div>
    </div>
  </footer>
);
