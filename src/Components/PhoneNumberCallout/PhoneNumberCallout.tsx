import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useRollbar } from "@rollbar/react";
import { Button, Icon, TextInput } from "@justfixnyc/component-library";

import { CoverageResult, GCEUser } from "../../types/APIDataTypes";
import { gtmPush } from "../../google-tag-manager";
import { useSendGceData } from "../../api/hooks";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import Modal from "../Modal/Modal";

import "./PhoneNumberCallout.scss";

interface PhoneNumberUIProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  showFieldError: boolean;
  phoneNumber: string;
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  showSuccess: boolean;
  showError: boolean;
  modalIsOpen?: boolean;
  modalOnClose?: () => void;
  headerText: string;
  bodyText: string;
}

interface PhoneNumberCaptureProps {
  PhoneNumberUI: React.FC<PhoneNumberUIProps>;
  coverageResult?: CoverageResult;
  gtmId?: string;
  modalOnClose?: () => void;
  headerText?: string;
  bodyText?: string;
}

const PhoneNumberCapture: React.FC<PhoneNumberCaptureProps> = (props) => {
  const {
    PhoneNumberUI,
    coverageResult,
    gtmId,
    modalOnClose,
    headerText = "Save your result to your phone",
    bodyText = "Get a text with a unique URL to your results page.",
    ...UIProps
  } = props;
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
        const resultUrlParam =
          window.location.pathname === "/results"
            ? {
                result_url: window.location.href,
              }
            : {};
        const postData = {
          id: user?.id,
          phone_number: parseInt(cleaned),
          ...resultUrlParam,
        };
        const userResp = (await trigger(postData)) as GCEUser;
        if (!user?.id) setUser(userResp);
      };
      sendData();
      setShowFieldError(false);
      if (modalOnClose) {
        modalOnClose();
      } else {
        setShowSuccess(true);
      }
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
    <PhoneNumberUI
      {...UIProps}
      handleSubmit={handleSubmit}
      showFieldError={showFieldError}
      phoneNumber={phoneNumber}
      handleInputChange={handleInputChange}
      showSuccess={showSuccess}
      showError={showError}
      headerText={headerText}
      bodyText={bodyText}
      modalOnClose={modalOnClose}
    />
  );
};

const PhoneNumberCalloutUI: React.FC<PhoneNumberUIProps> = ({
  handleSubmit,
  showFieldError,
  phoneNumber,
  handleInputChange,
  showSuccess,
  showError,
  headerText,
  bodyText,
}) => {
  return (
    <div className="phone-number-callout-box">
      <div className="callout-box__column">
        <span className="callout-box__header">{headerText}</span>
        <p>{bodyText}</p>
      </div>
      <form className="callout-box__column" onSubmit={handleSubmit}>
        <div className="phone-number-input-container">
          <TextInput
            labelText="Phone number (optional)"
            placeholder="(123) 456-7890"
            invalid={showFieldError}
            invalidText="Enter a valid phone number"
            id="phone-number-input"
            name="phone-number-input"
            value={phoneNumber}
            onChange={handleInputChange}
          />
          <Button
            className="phone-number-submit__desktop"
            labelText="Submit"
            variant="secondary"
            size="small"
            type="submit"
          />
          <div className="phone-number-description">
            {showSuccess && (
              <div className="success-message">
                <Icon icon="check" />
                Phone number submitted
              </div>
            )}
            {showError && (
              <div className="error-message">
                <Icon icon="circleExclamation" />
                Something went wrong. Try again later.
              </div>
            )}
            We will never call you or share your phone number. We may text you
            later in the year to see how things are going. Opt-out at any time.
          </div>
        </div>
        <div className="phone-number-submit__mobile">
          <Button labelText="Submit" variant="secondary" size="small" />
        </div>
      </form>
    </div>
  );
};

export const PhoneNumberCallout: React.FC<
  Omit<PhoneNumberCaptureProps, "PhoneNumberUI">
> = (props) => {
  return <PhoneNumberCapture {...props} PhoneNumberUI={PhoneNumberCalloutUI} />;
};

const PhoneNumberModalUI: React.FC<PhoneNumberUIProps> = ({
  handleSubmit,
  showFieldError,
  phoneNumber,
  handleInputChange,
  showSuccess,
  showError,
  modalIsOpen,
  modalOnClose,
  headerText,
  bodyText,
}) => {
  return (
    <Modal
      header={headerText}
      isOpen={modalIsOpen!}
      onClose={modalOnClose}
      hasCloseBtn={true}
      className="phone-capture-modal"
    >
      <p>{bodyText}</p>
      <form className="phone-number-input-container" onSubmit={handleSubmit}>
        <TextInput
          labelText="Phone number"
          placeholder="(123) 456-7890"
          invalid={showFieldError}
          invalidText="Enter a valid phone number"
          id="phone-number-input"
          name="phone-number-input"
          value={phoneNumber}
          onChange={handleInputChange}
        />
        <div className="phone-number-description">
          We will never call you or share your phone number. We may text you
          later in the year to see how things are going. Opt-out at any time.{" "}
        </div>
        <div className="phone-number-button-container">
          <Button
            className="phone-number-cancel"
            labelText="No, thanks"
            variant="tertiary"
            type="button"
            onClick={modalOnClose}
          />
          <Button
            className="phone-number-submit"
            labelText="Submit"
            variant="primary"
            type="submit"
          />
        </div>
        <div className="phone-number-submit-message">
          {showSuccess && (
            <div className="success-message">
              <Icon icon="check" />
              Phone number submitted
            </div>
          )}
          {showError && (
            <div className="error-message">
              <Icon icon="circleExclamation" />
              Something went wrong. Try again later.
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export const PhoneNumberModal: React.FC<
  Omit<PhoneNumberCaptureProps, "PhoneNumberUI"> &
    Pick<PhoneNumberUIProps, "modalIsOpen" | "modalOnClose">
> = (props) => {
  const { modalOnClose, ...otherProps } = props;
  return (
    <PhoneNumberCapture
      {...otherProps}
      PhoneNumberUI={PhoneNumberModalUI}
      modalOnClose={modalOnClose}
    />
  );
};
