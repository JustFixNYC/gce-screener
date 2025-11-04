import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { FormHookProps } from "../../../types/LetterFormTypes";
import { ContentBox, ContentBoxItem } from "../../ContentBox/ContentBox";
import { GoodCauseProtections } from "../../KYRContent/KYRContent";

export const GoodCauseGivenStep: React.FC<FormHookProps> = () => {
  const { _ } = useLingui();

  return (
    <>
      <ContentBox
        subtitle={_(
          msg`Lorem ipsum dolor sit amet consectetur adipisicing elit`
        )}
        className="good-cause-given"
      >
        <ContentBoxItem accordion={false}>
          <p>
            <Trans>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
              quaerat alias magni nam beatae aliquam architecto laudantium
              mollitia expedita tempora rem, deleniti, dolorum, nemo assumenda!
              Commodi architecto dolor eius perferendis!
            </Trans>
          </p>
        </ContentBoxItem>
        <ContentBoxItem title={_(msg`Tip 1`)}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. At
            deleniti, minus ea laudantium, suscipit saepe explicabo velit quis
            beatae esse iusto neque fuga rerum optio corporis labore maiores
            consequuntur necessitatibus?
          </p>
        </ContentBoxItem>
      </ContentBox>
      <GoodCauseProtections />
    </>
  );
};
