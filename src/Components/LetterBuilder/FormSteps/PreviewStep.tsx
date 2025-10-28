import { useContext, useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";

import { FormContext } from "../../../types/LetterFormTypes";
import { languageNames, SupportedLocale } from "../../../i18n-base";
import { buildLetterHtml } from "../Letter/letter-utils";

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

  useEffect(() => {
    const prepLetter = async () => {
      const localizedLetterHtml = await buildLetterHtml(
        letterData,
        previewLocale
      );
      setLetter(localizedLetterHtml);
    };
    prepLetter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewLocale]);

  return (
    <>
      <section>
        <h4>
          <Trans>Review your letter</Trans>
        </h4>
        <p>
          <Trans>
            Make sure the information below is accurate. If it is not, you can
            go back to make changes.
          </Trans>
        </p>
      </section>

      <section>
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
        <p>
          <Trans>
            <strong>Note:</strong> You will be able to download a PDF version of
            this letter later.
          </Trans>
        </p>
      </section>
    </>
  );
};
