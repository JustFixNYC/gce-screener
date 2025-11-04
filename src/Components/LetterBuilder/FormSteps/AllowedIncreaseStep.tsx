import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { ContentBox, ContentBoxItem } from "../../ContentBox/ContentBox";
import { GoodCauseProtections } from "../../KYRContent/KYRContent";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";

export const AllowedIncreaseStep: React.FC = () => {
  const { _ } = useLingui();

  return (
    <>
      <ContentBox
        subtitle={_(
          msg`You have reported that your rent increase is less than the allowable amount.`
        )}
        className="allowed-increase"
      >
        <ContentBoxItem accordion={false}>
          {/* TODO: This is not quite to designs, need to check with corey */}
          <p>
            <Trans>
              Since your rent increase is below the allowable rent increase
              limit under Good Cause, we cannot assert your Good Cause rights in
              regard to your increase. However, here are some tips to help you
              negotiate a lower increase.
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
      <BackNextButtons hideButon2 />
    </>
  );
};
