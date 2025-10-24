import { I18nProvider, useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";

import { i18nLetter } from "./letter-utils";
import { FormFields } from "../../../types/LetterFormTypes";
import { currentDateLong, toTitleCase } from "../../../helpers";
import { CPI } from "../../Pages/RentCalculator/RentIncreaseValues";

import letterStyles from "./letter-styles.css?raw";

type LetterData = { letterData: FormFields };

export const Letter: React.FC<LetterData> = ({ letterData }) => {
  return (
    <I18nProvider i18n={i18nLetter}>
      <html lang={`${i18nLetter.locale}-US`}>
        <head>
          <meta charSet="UTF-8" />
          <title>Good Cause Eviction Letter</title>
          <style
            dangerouslySetInnerHTML={{
              __html: letterStyles.replace(/\s+/g, " "),
            }}
          />
        </head>
        <body>
          <LetterHeader letterData={letterData} />
          <main id="letter">
            <LetterIntro letterData={letterData} />
            <LetterRightsList />
            <LetterReason letterData={letterData} />
            <LetterRequest letterData={letterData} />
            <LetterOutro />
          </main>
          <LetterFooter letterData={letterData} />
        </body>
      </html>
    </I18nProvider>
  );
};

const LetterHeader: React.FC<LetterData> = ({ letterData }) => {
  const { user_details: ud, landlord_details: ld } = letterData;
  const { i18n } = useLingui();
  return (
    <header>
      <address>
        <strong>
          {ud.first_name} {ud.last_name}
        </strong>
        <br />
        {ud.primary_line}
        <br />
        {ud.secondary_line && (
          <>
            {ud.secondary_line}
            <br />
          </>
        )}
        {toTitleCase(ud.city)}, {ud.state} {ud.zip_code}
        <br />
        {ud.email}
      </address>

      <time dateTime={new Date().toISOString().slice(0, 10)}>
        {currentDateLong(i18n.locale)}
      </time>

      <address>
        <strong>{ld.name}</strong>
        <br />
        {ld.primary_line}
        <br />
        {ld.secondary_line && (
          <>
            {ld.secondary_line}
            <br />
          </>
        )}
        {toTitleCase(ld.city)}, {ld.state} {ld.zip_code}
      </address>
    </header>
  );
};

const LetterIntro: React.FC<LetterData> = ({ letterData }) => {
  const { landlord_details: ud } = letterData;
  return (
    <>
      <p className="salutation">
        <Trans>Dear {ud.name},</Trans>
      </p>
      <section className="intro">
        <p>
          <Trans>
            I am writing to inform you that my tenancy at this address is
            covered under New York State’s Good Cause Eviction Law, which took
            effect in New York City on April 20, 2024. As a tenant covered by
            this law, I want to outline both my protections and our mutual
            responsibilities.
          </Trans>
        </p>
      </section>
    </>
  );
};

const LetterRightsList = () => {
  return (
    <section className="rights">
      <ol>
        <li>
          <Trans>Legal Limits on Rent Increases</Trans>
          <p>
            <Trans>
              Rent increases are presumptively unreasonable if they exceed the
              lower of:
            </Trans>
          </p>
          <ul>
            <li>
              <Trans>10%, or</Trans>
            </li>
            <li>
              <Trans>
                5% plus the annual change in the Consumer Price Index (CPI) for
                the region ({CPI + 5}% in NYC in 2024)
              </Trans>
            </li>
          </ul>
        </li>

        <li>
          <Trans>Right to lease renewals</Trans>
          <p>
            <Trans>
              Under the Good Cause Eviction law, a landlord may not lawfully
              evict a tenant or refuse lease renewal unless there is a
              statutorily defined “good cause.”
            </Trans>
          </p>
        </li>

        <li>
          <Trans>Required Notices from the Landlord</Trans>
          <p>
            <Trans>
              By law, you must provide a Good Cause Eviction notice when
              issuing:
            </Trans>
          </p>
          <ul>
            <li>
              <Trans>A new lease or renewal</Trans>
            </li>
            <li>
              <Trans>A rent increase above the thresholds, or</Trans>
            </li>
            <li>
              <Trans>A non-renewal or eviction notice</Trans>
            </li>
          </ul>
        </li>
      </ol>
    </section>
  );
};

const LetterReason: React.FC<LetterData> = ({ letterData }) => (
  <section className="reason">
    <h2>
      {letterData.reason === "PLANNED_INCREASE" ? (
        <Trans>Concerning the proposed rent increase:</Trans>
      ) : (
        <Trans>Concerning your intent to end my tenancy</Trans>
      )}
    </h2>
    <p>
      {letterData.reason === "PLANNED_INCREASE" ? (
        <Trans>
          I believe the rent detailed in the new lease you’ve offered exceeds
          the lawful limit under the Good Cause Eviction law. The difference
          between my current rent and the proposed rent appears to exceed{" "}
          {CPI + 5}%.
        </Trans>
      ) : (
        <Trans>
          Under the Good Cause Eviction law, tenants are entitled to renewal of
          their lease unless the landlord can establish a valid “good cause”
          reason for non-renewal.
        </Trans>
      )}
    </p>
  </section>
);

const LetterRequest: React.FC<LetterData> = ({ letterData }) => (
  <section className="request">
    <h2>
      <Trans>I respectfully request the following:</Trans>
    </h2>
    <ul>
      <li>
        <Trans>
          Please confirm in writing that this unit is covered under the Good
          Cause Eviction law.
        </Trans>
      </li>
      <li>
        {letterData.reason === "PLANNED_INCREASE" ? (
          <Trans>
            Please send me a new lease with a rent increase of less than{" "}
            {CPI + 5}%.
          </Trans>
        ) : (
          <Trans>
            Please confirm whether you intend to renew my lease, and if not,
            provide the specific good cause reason in writing as required by
            law. If you do not provide such reason, I will assume I retain the
            right to continue my tenancy under existing terms.
          </Trans>
        )}
      </li>
    </ul>
  </section>
);

const LetterOutro = () => (
  <section className="outro">
    <p>
      <Trans>
        I value our landlord–tenant relationship and wish to continue it on
        clear and lawful terms. Please let me know if you’d like to discuss or
        clarify any of these requirements. I hope we can work cooperatively to
        uphold both legal obligations and good-faith communication.
      </Trans>
    </p>
    <p>
      <Trans>
        Thank you for your attention to this matter. I look forward to hearing
        from you.
      </Trans>
    </p>
    <p>
      <Trans>
        To learn more about tenant and landlord responsibilities under Good
        Cause Eviction law, you can visit{" "}
        <a
          href="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page
        </a>
      </Trans>
    </p>
  </section>
);

const LetterFooter: React.FC<LetterData> = ({ letterData }) => {
  const { user_details: ud } = letterData;
  return (
    <footer>
      <p>
        {ud.first_name} {ud.last_name}
      </p>
      {ud.email && <p>{ud.email}</p>}
    </footer>
  );
};
