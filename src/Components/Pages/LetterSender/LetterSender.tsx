import { useEffect, useState } from "react";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Button } from "@justfixnyc/component-library";

import { Header } from "../../Header/Header";
import { LetterBuilderForm } from "../../LetterBuilder/LetterBuilderForm";
import { FormFields, sampleFormValues } from "../../../types/LetterFormTypes";
import { buildLetterHtml } from "../../LetterBuilder/Letter/letter-utils";
import { GCELetterPostData } from "../../../types/APIDataTypes";
import { useSendGceLetterData } from "../../../api/hooks";
import { languageNames, SupportedLocale } from "../../../i18n-base";
import "./LetterSender.scss";

export const LetterSender: React.FC = () => {
  const { _ } = useLingui();

  return (
    <div id="letter-sender-page">
      <Header
        title={_(
          msg`Send a free letter asserting your rights under Good Cause`
        )}
        showProgressBar={false}
      />

      <div className="content-section">
        <div className="content-section__content">
          <p>For testing letter content and backend</p>
          <LetterTester letterData={sampleFormValues} />
          <LetterBuilderForm />
        </div>
      </div>
    </div>
  );
};

// This is just to help with testing letter and backend so you don't have to
// complete all form steps each time. This should all be removed later
export const LetterTester: React.FC<{ letterData: FormFields }> = ({
  letterData,
}) => {
  const { i18n, _ } = useLingui();

  const { trigger: sendLetter } = useSendGceLetterData();

  const [letter, setLetter] = useState<string | undefined>();
  const [previewLocale, setPreviewLocale] = useState<SupportedLocale>(
    i18n.locale as SupportedLocale
  );

  useEffect(() => {
    const prepLetter = async () => {
      const localizedLetterHtml = await buildLetterHtml(
        letterData,
        previewLocale
      );
      setLetter(localizedLetterHtml);
    };
    prepLetter();
  }, [letterData, previewLocale]);

  return (
    <>
      <div className="locale-toggle">
        <Trans>Preview language:</Trans>
        <button
          className="jfcl-link"
          onClick={() => setPreviewLocale("es")}
          disabled={previewLocale === "es"}
        >
          {languageNames["es"]}
        </button>
        <button
          className="jfcl-link"
          onClick={() => setPreviewLocale("en")}
          disabled={previewLocale === "en"}
        >
          {languageNames["en"]}
        </button>
      </div>

      <iframe
        title={_(msg`Good Cause Letter Preview`)}
        srcDoc={letter}
        width="600"
        height="600"
      />

      <Button
        labelText="submit letter"
        onClick={async () => {
          const letterHtml = await buildLetterHtml(sampleFormValues, "en");
          const letterPostData: GCELetterPostData = {
            ...sampleFormValues,
            html_content: letterHtml,
          };
          await sendLetter(letterPostData);
        }}
      />
    </>
  );
};
