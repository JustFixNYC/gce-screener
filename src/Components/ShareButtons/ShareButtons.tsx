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
  const subjectParam = emailSubject ? `subject=${emailSubject}` : "";
  const bodyParam = emailBody ? `body=${emailBody}` : "";
  const mailtoLink = `mailto:?${subjectParam}&${bodyParam}`;

  const emailButton = (x: string, key: React.Key) => (
    <a
      href={mailtoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="share-button jfcl-link"
      key={key}
    >
      <Icon icon="envelope" type="regular" />
      {x}
    </a>
  );

  const downloadButton = (x: string, key: React.Key) => (
    <button onClick={window.print} className="share-button jfcl-link" key={key}>
      <Icon icon="download" type="regular" />
      {x}
    </button>
  );

  const printButton = (x: string, key: React.Key) => (
    <button onClick={window.print} className="share-button jfcl-link" key={key}>
      <Icon icon="print" type="regular" />
      {x}
    </button>
  );

  const bookmarkButton = (x: string, key: React.Key) => (
    <button onClick={() => {}} className="share-button jfcl-link" key={key}>
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
      {buttonsInfo.map((b, i) => {
        const buttonFun = buttonElements[b[0]];
        const message = b[1];
        return buttonFun(message, i);
      })}
    </div>
  );
};
