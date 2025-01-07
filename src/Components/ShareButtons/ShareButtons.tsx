import { Icon } from "@justfixnyc/component-library";
import "./ShareButtons.scss";

type ShareButtonType = "email" | "download" | "print" | "bookmark";
type ShareButtonsProps = {
  buttonsInfo: [ShareButtonType, string][];
  emailSubject?: string | null;
  emailBody?: string | null;
};

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  buttonsInfo,
  emailSubject,
  emailBody,
}) => {
  const mailtoLink =
    `mailto:` + emailSubject
      ? `&subject=${emailSubject}`
      : "" + emailBody
      ? `&subject=${emailBody}`
      : "";
  const emailButton = (x: string) => (
    <a
      href={mailtoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="share-button jfcl-link"
    >
      <Icon icon="envelope" type="regular" />
      {x}
    </a>
  );

  const downloadButton = (x: string) => (
    <button onClick={window.print} className="share-button jfcl-link">
      <Icon icon="download" type="regular" />
      {x}
    </button>
  );

  const printButton = (x: string) => (
    <button onClick={window.print} className="share-button jfcl-link">
      <Icon icon="print" type="regular" />
      {x}
    </button>
  );

  const bookmarkButton = (x: string) => (
    <button onClick={() => {}} className="share-button jfcl-link">
      <Icon icon="bookmark" type="regular" />
      {x}
    </button>
  );

  const buttonElements = {
    email: emailButton,
    download: downloadButton,
    print: printButton,
    bookmark: bookmarkButton,
  };

  return (
    <div className="share-button__container">
      {buttonsInfo.map((b) => {
        const buttonFun = buttonElements[b[0]];
        const message = b[1];
        return buttonFun(message);
      })}
    </div>
  );
};
