import { Trans } from "@lingui/react/macro";
import { Icon } from "@justfixnyc/component-library";

import { GCELetterConfirmation } from "../../../types/APIDataTypes";
import { base64ToBlob } from "../Letter/letter-utils";
import { JFCLLinkExternal } from "../../JFCLLink";
import {
  LetterNextSteps,
  LetterResponsesNonRenewal,
  LetterResponsesRentIncrease,
  LetterWhoCanHelp,
} from "../LetterNextSteps/LetterNextSteps";
import "./ConfirmationStep.scss";

const USPS_TRACKING_URL_PREFIX =
  "https://tools.usps.com/go/TrackConfirmAction?tLabels=";

export const ConfirmationStep: React.FC<{
  confirmationResponse?: GCELetterConfirmation;
}> = ({ confirmationResponse }) => {
  if (!confirmationResponse) return <Trans>Loading...</Trans>;

  const { data } = confirmationResponse;
  const pdfBlob = base64ToBlob(data.letter_pdf, "application/pdf");
  const fileURL = URL.createObjectURL(pdfBlob);

  const allEmailsSent = [data.landlord_email, data.user_email]
    .concat(data.extra_emails)
    .filter((email): email is string => !!email);

  return (
    <div className="confirmation-step">
      <div className="success-container">
        <div>
          <Icon icon="envelopeCircleCheck" className="success-icon" />
        </div>
        <section>
          {data.mail_choice === "WE_WILL_MAIL" ? (
            <>
              <h3>
                <Trans>Your letter is on its way</Trans>
              </h3>
              <p>
                <Trans>
                  Your letter is now on its way to your landlord. Your USPS
                  Certified Mail® tracking number is{" "}
                  <JFCLLinkExternal
                    to={USPS_TRACKING_URL_PREFIX + data.tracking_number}
                  >
                    {data.tracking_number}
                  </JFCLLinkExternal>
                </Trans>
              </p>
            </>
          ) : (
            <>
              <h3>
                <Trans>Your letter is ready for download</Trans>
              </h3>
              <p>
                <Trans>
                  Your letter has been created and is now ready for you to
                  download and mail yourself.
                </Trans>
              </p>
            </>
          )}

          <div className="success-letter-buttons">
            {/* TODO: we should probably just give in an make a JFCL link styled as button and button as link */}
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="jfcl-button jfcl-variant-primary jfcl-size-small"
            >
              <span className="jfcl-button__label">
                <span className="jfcl-button__icon">
                  <Icon icon="downloadRegular" />
                </span>
                <Trans>Download letter (PDF)</Trans>
              </span>
            </a>
            {data.mail_choice === "WE_WILL_MAIL" && (
              <a
                href={USPS_TRACKING_URL_PREFIX + data.tracking_number}
                target="_blank"
                rel="noopener noreferrer"
                className="jfcl-button jfcl-variant-secondary jfcl-size-small"
              >
                <span className="jfcl-button__label">
                  <Trans>Track your letter</Trans>
                  <span className="jfcl-button__icon jfcl-button__icon_right">
                    <Icon icon="squareArrowUpRight" />
                  </span>
                </span>
              </a>
            )}
          </div>
        </section>
      </div>

      {allEmailsSent && (
        <div className="emails-sent-callout-box">
          <div>
            <Icon icon="paperPlaneLight" className="emails-sent-icon" />
          </div>
          <section>
            <h4>
              <Trans>
                A PDF copy of your letter has been sent to the following email
                addresses:
              </Trans>
            </h4>
            <ul>
              {allEmailsSent.map((email) => (
                <li>
                  <Trans>{email}</Trans>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <LetterNextSteps className="next-steps" />

      {data.reason === "NON_RENEWAL" ? (
        <LetterResponsesNonRenewal includeUniversal />
      ) : data.reason === "PLANNED_INCREASE" ? (
        <LetterResponsesRentIncrease includeUniversal />
      ) : null}

      <LetterWhoCanHelp />
    </div>
  );
};
