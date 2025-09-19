import { useEffect, useState } from "react";
import { I18nProvider, useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";

import { buildLetterHtml, i18nLetter } from "./letter-utils";
import { languageNames, SupportedLocale } from "../../../i18n-base";

import pdfStyles from "./letter-styles-pdf.css?raw";
import { FormFields } from "../../../types/LetterFormTypes";

export const Letter: React.FC<{
  letterData: FormFields;
  isPdf: boolean;
}> = ({ letterData, isPdf }) => {
  const { user_details: user, landlord_details: landlord } = letterData;
  const cssPdf = pdfStyles.replace(/\s+/g, "");

  return (
    <I18nProvider i18n={i18nLetter}>
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <title>Good Cause Eviction Letter</title>
          {isPdf ? (
            <style dangerouslySetInnerHTML={{ __html: cssPdf }} />
          ) : (
            <link rel="stylesheet" href="/letter-styles-html.css" />
          )}
        </head>
        <body>
          <main id="letter">
            <h1>
              <Trans>Good Cause Eviction Letter</Trans>
            </h1>
            <section>
              From:
              <br />
              {user.first_name} {user.last_name}
              <br />
              {user.primary_line}
              {!!user.secondary_line && (
                <>
                  <br />
                  {user.secondary_line}
                </>
              )}
              <br />
              <br />
              To:
              <br />
              {landlord.name}
              <br />
              {landlord.primary_line}
              {!!landlord.secondary_line && (
                <>
                  <br />
                  {landlord.secondary_line}
                </>
              )}
            </section>
            <br />
            <br />
            <section>Asserting Good Cause rights...</section>
          </main>
        </body>
      </html>
    </I18nProvider>
  );
};

export const LetterPreview: React.FC<{
  letterData: FormFields;
}> = ({ letterData }) => {
  const { i18n, _ } = useLingui();

  const [letter, setLetter] = useState<string | undefined>();
  const [previewLocale, setPreviewLocale] = useState<SupportedLocale>(
    i18n.locale as SupportedLocale
  );

  useEffect(() => {
    const prepLetter = async () => {
      const localizedLetterHtml = await buildLetterHtml(
        letterData,
        previewLocale,
        false
      );
      setLetter(localizedLetterHtml);
    };
    prepLetter();
  }, [letterData, previewLocale]);

  return (
    <>
      <h4>
        <Trans>Letter Preview</Trans>
      </h4>
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
    </>
  );
};
