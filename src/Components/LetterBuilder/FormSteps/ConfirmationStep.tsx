import { Trans } from "@lingui/react/macro";
import { Icon } from "@justfixnyc/component-library";

import { GCELetterConfirmation } from "../../../types/APIDataTypes";
import { base64ToBlob } from "../Letter/letter-utils";
import { JFCLLinkExternal } from "../../JFCLLink";

export const ConfirmationStep: React.FC<{
  confirmationResponse?: GCELetterConfirmation;
}> = ({ confirmationResponse }) => {
  if (!confirmationResponse) return <Trans>Loading...</Trans>;

  const { data, errors } = confirmationResponse;
  const pdfBlob = base64ToBlob(data.letter_pdf, "application/pdf");
  const fileURL = URL.createObjectURL(pdfBlob);

  return (
    <>
      <ul>
        {errors.landlord_email?.error ? (
          <li>
            <Icon icon="xmark" />
            <Trans>
              An error occurred when emailing your letter to your landlord.
            </Trans>
          </li>
        ) : errors.landlord_email?.error === false ? (
          <li>
            <Icon icon="check" />
            <Trans>Your letter has been emailed to your landlord.</Trans>
          </li>
        ) : null}
        {errors.user_email?.error ? (
          <li>
            <Icon icon="xmark" />
            <Trans>
              An error occurred when emailing a copy of your letter to you.
            </Trans>
          </li>
        ) : (
          <li>
            <Icon icon="check" />
            <Trans>A copy of your letter has been emailed to you.</Trans>
          </li>
        )}
        {errors.letter_mail?.error ? (
          <li>
            <Icon icon="xmark" />
            <Trans>
              An error occurred when mailing your letter to your landlord.
            </Trans>
          </li>
        ) : (
          <li>
            <Icon icon="check" />
            <Trans>Your letter has been mailed to your landlord.</Trans>
            {data.tracking_number && (
              <Trans>
                You can track the letter via USPS Certified Mail with this
                tracking number: {data.tracking_number}
              </Trans>
            )}
          </li>
        )}
        {errors.textit_campaign?.error ? (
          <li>
            <Icon icon="xmark" />
            <Trans>
              An error occurred when sending you a text message for follow up.
            </Trans>
          </li>
        ) : (
          <li>
            <Icon icon="check" />
            <Trans>
              We have sent you a text message with the USPS tracking number for
              your letter.
            </Trans>
          </li>
        )}
      </ul>
      <JFCLLinkExternal to={fileURL}>
        <Trans>View Letter PDF</Trans>
      </JFCLLinkExternal>
    </>
  );
};
