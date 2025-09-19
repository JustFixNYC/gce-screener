import { Trans } from "@lingui/react/macro";

import { FormHookProps } from "../../../types/LetterFormTypes";
import { LetterPreview } from "../Letter/Letter";

export const PreviewStep: React.FC<FormHookProps> = (props) => {
  const { getValues } = props;

  return (
    <>
      <Trans>
        Please review your letter to ensure all the details are correct.
      </Trans>
      <LetterPreview letterData={getValues()} />
    </>
  );
};
