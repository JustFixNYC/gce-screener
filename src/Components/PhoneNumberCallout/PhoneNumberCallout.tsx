import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useRollbar } from "@rollbar/react";
import { Button, Icon, TextInput } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

import { CoverageResult, GCEUser } from "../../types/APIDataTypes";
import { gtmPush } from "../../google-tag-manager";
import { useSendGceData } from "../../api/hooks";
import { useSessionStorage } from "../../hooks/useSessionStorage";

import "./PhoneNumberCallout.scss";

export const PhoneNumberCallout: React.FC<{
  headerText?: string;
  bodyText?: string;
  coverageResult?: CoverageResult;
  gtmId?: string;
}> = ({
  headerText,
  bodyText,
  coverageResult,
  gtmId,
}) => {
  const { _ } = useLingui();
  const defaultHeaderText = _(msg`Help build tenant power in NYC`);
  const defaultBodyText = _(msg`We'll text you once a year to learn about your housing conditions. We'll use your answers to better advocate for your rights.`);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showFieldError, setShowFieldError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const VALID_PHONE_NUMBER_LENGTH = 10;

  const [, setUser] = useSessionStorage<GCEUser>("user");
  const { user } = useLoaderData() as {
    user?: GCEUser;
  };
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();

  const formatPhoneNumber = (value: string): string => {
    // remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // limit to 10 characters
    const limited = cleaned.slice(0, 10);

    // format with parentheses and dashes e.g. (555) 666-7777
    const match = limited.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const [, part1, part2, part3] = match;
      const formatted = [
        part1 ? `(${part1}` : "",
        part2 ? `) ${part2}` : "",
        part3 ? `-${part3}` : "",
      ]
        .join("")
        .trim();
      return formatted;
    }
    return value;
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = formatPhoneNumber(e.target.value);
    setPhoneNumber(value);
    setShowSuccess(false);
    setShowFieldError(false);
    setShowError(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length !== VALID_PHONE_NUMBER_LENGTH) {
      setShowFieldError(true);
      return;
    }
    try {
      const sendData = async () => {
        const postData = {
          id: user?.id,
          phone_number: parseInt(cleaned),
        };
        const userResp = (await trigger(postData)) as GCEUser;
        if (!user?.id) setUser(userResp);
      };
      sendData();
      setShowFieldError(false);
      setShowSuccess(true);
      gtmPush("gce_phone_submit", {
        gce_result: coverageResult,
        from: gtmId,
      });
    } catch {
      setShowError(true);
      rollbar.critical("Cannot connect to tenant platform");
    }
  };

  return (
    <div className="phone-number-callout-box">
      <div className="callout-box__column">
        <span className="callout-box__header">{headerText || defaultHeaderText}</span>
        <p>{bodyText || defaultBodyText}</p>
      </div>
      <form className="callout-box__column" onSubmit={handleSubmit}>
        <div className="phone-number-input-container">
          <TextInput
            labelText={_(msg`Phone number`)}
            placeholder={_(msg`(123) 456-7890`)}
            invalid={showFieldError}
            invalidText={_(msg`Enter a valid phone number`)}
            id="phone-number-input"
            name="phone-number-input"
            value={phoneNumber}
            onChange={handleInputChange}
          />
          <Button
            className="phone-number-submit__desktop"
            labelText={_(msg`Submit`)}
            variant="secondary"
            size="small"
            type="submit"
          />
          <div className="phone-number-description">
            {showSuccess && (
              <div className="success-message">
                <Icon icon="check" />
                <Trans>Phone number submitted</Trans>
              </div>
            )}
            {showError && (
              <div className="error-message">
                <Icon icon="circleExclamation" />
                <Trans>Something went wrong. Try again later.</Trans>
              </div>
            )}
            <Trans>
              We will never call you or share your phone number. You can opt-out
              at any time.
            </Trans>
          </div>
        </div>
        <div className="phone-number-submit__mobile">
          <Button labelText={_(msg`Submit`)} variant="secondary" size="small" />
        </div>
      </form>
    </div>
  );
};
