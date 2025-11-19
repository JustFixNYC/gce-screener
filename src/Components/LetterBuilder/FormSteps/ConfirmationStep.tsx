import React, { useContext } from "react";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { Icon } from "@justfixnyc/component-library";

import { JFCLLinkExternal } from "../../JFCLLink";
import {
  LetterNextSteps,
  LetterResponsesNonRenewal,
  LetterResponsesRentIncrease,
  LetterWhoCanHelp,
} from "../LetterNextSteps/LetterNextSteps";
import { Notice } from "../../Notice/Notice";
import { GCELetterConfirmation } from "../../../types/APIDataTypes";
import { FormContext } from "../../../types/LetterFormTypes";
import "./ConfirmationStep.scss";

const USPS_TRACKING_URL_PREFIX =
  "https://tools.usps.com/go/TrackConfirmAction?tLabels=";

export type GCELetterSubmissionError = { error: boolean };

function letterResponseIsError(
  resp?: GCELetterConfirmation | GCELetterSubmissionError
): resp is GCELetterSubmissionError {
  return !!resp && "error" in resp;
}

export const ConfirmationStep: React.FC<{
  confirmationResponse?: GCELetterConfirmation | GCELetterSubmissionError;
}> = ({ confirmationResponse: confirmationResponseProp }) => {
  // Allow passing props instead of context so we can use sample values for testing
  const { confirmationResponse } = useContext(FormContext) || {
    confirmationResponse: confirmationResponseProp,
  };

  const { i18n } = useLingui();

  if (!confirmationResponse) {
    return (
      <div className="confirmation-step">
        <Notice
          className="loading-notice"
          color="off-white-200"
          icon="envelopeRegular" // TODO: envelopeLight
          header={<Trans>We’re finishing up your letter…</Trans>}
        >
          <p>
            <Trans>
              This can take up to a few seconds. Please don’t refresh or close
              the page.
            </Trans>
          </p>
        </Notice>
      </div>
    );
  } else if (letterResponseIsError(confirmationResponse)) {
    const supportSubject = "Good Cause Letter submission error";
    const supportBody =
      "There was an error and my Good Cause letter could not be completed. To look up my letter and resolve this problem, my phone number is: <YOUR PHONE NUMBER>";
    const mailToSupport = `mailto:support@justfix.org?subject=${supportSubject}&body=${supportBody}`;
    return (
      <div className="confirmation-step">
        <Notice
          className="error-notice"
          color="yellow"
          icon="circleExclamationRegular" // TODO: custom icon "envelopeCircleExclamationLight"
          header={<Trans>We couldn’t finish your letter</Trans>}
        >
          <p>
            <Trans>
              Something unexpected happened while trying to generate your
              letter. We apologize for the inconvenience.
            </Trans>
          </p>
          <p>
            <Trans>
              You can try again or contact our support team at
              support@justfix.org if the issue continues.{" "}
            </Trans>
          </p>
          <div className="error-letter-buttons">
            {/* TODO: we should probably just give in an make a JFCL link styled as button and button as link */}
            <a
              href={`/${i18n.locale}/letter`}
              className="jfcl-button jfcl-variant-primary jfcl-size-small"
            >
              <span className="jfcl-button__label">
                <Trans>Try again</Trans>
              </span>
            </a>
            <a
              href={mailToSupport}
              target="_blank"
              rel="noopener noreferrer"
              className="jfcl-button jfcl-variant-secondary jfcl-size-small"
            >
              <span className="jfcl-button__label">
                <Trans>Contact support</Trans>
                <span className="jfcl-button__icon jfcl-button__icon_right">
                  <Icon icon="squareArrowUpRight" />
                </span>
              </span>
            </a>
          </div>
        </Notice>
      </div>
    );
  }

  const { data } = confirmationResponse;

  const letterPdfUrl = `${import.meta.env.VITE_TENANTS2_API_BASE_URL}/${
    data.letter_url
  }`;

  const allEmailsSent = [data.user_email, data.landlord_email]
    .concat(data.extra_emails)
    .filter((email): email is string => !!email);

  return (
    <div className="confirmation-step">
      <Notice
        className="success-notice"
        color="green"
        icon="envelopeCircleCheck"
        header={
          data.mail_choice === "WE_WILL_MAIL" ? (
            <Trans>Your letter is on its way</Trans>
          ) : (
            <Trans>Your letter is ready for download</Trans>
          )
        }
      >
        {data.mail_choice === "WE_WILL_MAIL" ? (
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
        ) : (
          <p>
            <Trans>
              Your letter has been created and is now ready for you to download
              and mail yourself.
            </Trans>
          </p>
        )}

        <div className="success-letter-buttons">
          {/* TODO: we should probably just give in an make a JFCL link styled as button and button as link */}
          <a
            href={letterPdfUrl}
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
      </Notice>

      {!!allEmailsSent?.length && (
        <Notice
          className="emails-sent-notice"
          color="off-white-200"
          icon="paperPlaneLight"
          header={
            <Trans>
              A PDF copy of your letter has been sent to the following email
              addresses:
            </Trans>
          }
        >
          <ul>
            {allEmailsSent.map((email, index) => (
              <li key={index}>
                <Trans>{email}</Trans>
              </li>
            ))}
          </ul>
        </Notice>
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
