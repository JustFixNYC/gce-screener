import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";

import { FormContext } from "../../../types/LetterFormTypes";
import { languageNames, SupportedLocale } from "../../../i18n-base";
import { buildLetterHtml } from "../Letter/letter-utils";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import "./PreviewStep.scss";

export const PreviewStep: React.FC = () => {
  const {
    formMethods: { getValues },
  } = useContext(FormContext);

  const { i18n, _ } = useLingui();
  const letterData = getValues();

  const [letter, setLetter] = useState<string | undefined>();
  const [previewLocale, setPreviewLocale] = useState<SupportedLocale>(
    i18n.locale as SupportedLocale
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const prepLetter = async () => {
      const localizedLetterHtml = await buildLetterHtml(
        letterData,
        previewLocale
      );
      setLetter(localizedLetterHtml);
    };
    prepLetter();
  }, [previewLocale, letterData]);

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // make sure content is fully rendered
    setTimeout(() => {
      try {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        const body = iframeDoc.body;
        const html = iframeDoc.documentElement;

        // get the actual content height
        const height = Math.max(
          body?.scrollHeight || 0,
          body?.offsetHeight || 0,
          html?.clientHeight || 0,
          html?.scrollHeight || 0,
          html?.offsetHeight || 0
        );

        if (height > 0) {
          iframe.style.height = `${height}px`;
        }
      } catch (error) {
        console.warn("Could not resize iframe:", error);
      }
    }, 100);
  }, []);

  // resize iframe when letter content changes
  useEffect(() => {
    if (letter && iframeRef.current) {
      // delay to ensure iframe content is rendered
      const timer = setTimeout(() => {
        resizeIframe();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [letter, resizeIframe]);

  return (
    <div id="preview-step">
      <div className="preview-step__page-header">
        <h3>
          <Trans>Review your letter</Trans>
        </h3>
        <p>
          <Trans>
            Make sure the information below is accurate. If it is not, you can
            go back to make changes.
          </Trans>
        </p>
      </div>
      <div className="preview-step__locale-toggle">
        <Trans>Letter preview language:</Trans>{" "}
        <button
          className="jfcl-link"
          onClick={() => setPreviewLocale("en")}
          disabled={previewLocale === "en"}
        >
          {languageNames["en"]}
        </button>
        {" / "}
        <button
          className="jfcl-link"
          onClick={() => setPreviewLocale("es")}
          disabled={previewLocale === "es"}
        >
          {languageNames["es"]}
        </button>
      </div>
      <div className="preview-step__letter-container">
        <iframe
          ref={iframeRef}
          title={_(msg`Good Cause Letter Preview`)}
          srcDoc={letter}
          className="preview-step__iframe"
          onLoad={resizeIframe}
        />
      </div>
      <div className="preview-step__note">
        <Trans>
          <strong>Note:</strong> You will be able to download a PDF version of
          this letter later.
        </Trans>
      </div>
      {/* TODO: consider taking this step out of the <form> since there are no inputs, 
        and then we'd need to change button2 to be type="button" and onClick={next} */}
      <BackNextButtons />
    </div>
  );
};
