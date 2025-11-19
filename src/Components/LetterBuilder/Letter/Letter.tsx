import { I18nProvider, useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";

import { i18nLetter } from "./letter-utils";
import { FormFields } from "../../../types/LetterFormTypes";
import { currentDateLong, toTitleCase } from "../../../helpers";
import {
  CPI,
  CPI_EFFECTIVE_DATE,
} from "../../Pages/RentCalculator/RentIncreaseValues";

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
        {ud.first_name} {ud.last_name}
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
        {ld.name}
        <br />
        {ld.urbanization && (
          <>
            {ld.urbanization}
            <br />
          </>
        )}
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
  const { landlord_details: ld, user_details: ud } = letterData;
  return (
    <>
      <p className="salutation" style={{ paddingTop: "1em" }}>
        <Trans>Dear {ld.name},</Trans>
      </p>
      <section className="intro">
        <p>
          <Trans>
            I am writing to inform you that my tenancy at{" "}
            {`${toTitleCase(ud.primary_line)}${
              ud.secondary_line ? ` ${toTitleCase(ud.secondary_line)}` : ""
            }, ${toTitleCase(ud.city)}, ${ud.zip_code} ${" "}`}
            is covered under New York State Real Property Law (RPL) Article 6-A,
            also known as the Good Cause Eviction Law, which took effect in New
            York City on April 20, 2024. As a tenant covered by this law, I want
            to outline my protections and our mutual responsibilities.
          </Trans>
        </p>
      </section>
    </>
  );
};

const LetterRightsList = () => {
  const { _ } = useLingui();

  return (
    <section className="rights">
      <ol>
        <li style={{ fontWeight: "bold" }}>
          <span style={{ fontWeight: "normal" }}>
            <strong>
              <Trans>Legal Limits on Rent Increases</Trans>
            </strong>
            <p>
              <Trans>
                Under Good Cause Eviction Law, rent increases are presumptively
                unreasonable if they exceed the lower of:
              </Trans>
            </p>
            <ul style={{ listStyleType: "disc" }}>
              <li>
                <Trans>10%, or</Trans>
              </li>
              <li>
                <Trans>
                  5% plus the annual percent change in the regional Consumer
                  Price Index (CPI).
                </Trans>
              </li>
            </ul>
            <p>
              <Trans>
                For New York City, the CPI change is {CPI + 5}% as of{" "}
                {_(CPI_EFFECTIVE_DATE)}, meaning increases above this level
                require justification under the statute.
              </Trans>
            </p>
          </span>
        </li>

        <li style={{ fontWeight: "bold" }}>
          <span style={{ fontWeight: "normal" }}>
            <strong>
              <Trans>Right to Lease Renewals</Trans>
            </strong>
            <p>
              <Trans>
                Under Good Cause Eviction Law, a landlord may not lawfully evict
                a tenant or refuse a new lease unless there is a statutorily
                defined "good cause."
              </Trans>
            </p>
          </span>
        </li>

        <li style={{ fontWeight: "bold" }}>
          <span style={{ fontWeight: "normal" }}>
            <strong>
              <Trans>Required Notices from the Landlord</Trans>
            </strong>
            <p>
              <Trans>
                Under Good Cause Eviction Law, you must provide a Good Cause
                Eviction notice when issuing:
              </Trans>
            </p>
            <ul style={{ listStyleType: "disc" }}>
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
            <p>
              <Trans>This notice must state whether the unit is covered by Article 6-A
              and explain the tenant's rights.</Trans>
            </p>
          </span>
        </li>
      </ol>
    </section>
  );
};

const LetterReason: React.FC<LetterData> = ({ letterData }) => (
  <section className="reason">
    <h2 style={{ margin: "unset", fontSize: "1.125rem" }}>
      {letterData.reason === "PLANNED_INCREASE" ? (
        <Trans>Concerning the proposed rent increase:</Trans>
      ) : (
        <Trans>Concerning your intent to end my tenancy</Trans>
      )}
    </h2>
    <p>
      {letterData.reason === "PLANNED_INCREASE" ? (
        <Trans>
          Based on the rent amount stated in your recent lease offer, the
          increase appears to exceed the lawful limit under Good Cause Eviction
          Law. The difference between my current rent and the proposed rent
          appears to exceed {CPI + 5}%.
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
    <h2 style={{ fontSize: "1.125rem" }}>
      <Trans>I respectfully request the following:</Trans>
    </h2>
    <ul style={{ marginLeft: "-1em" }}>
      <li>
        <Trans>
          Please confirm in writing that this unit is covered under Good Cause
          Eviction Law, as required by RPL § 213.
        </Trans>
      </li>
      <li>
        {letterData.reason === "PLANNED_INCREASE" ? (
          <Trans>
            Please send me a new lease with a rent increase of less than{" "}
            {CPI + 5}%, consistent with the limits established under RPL §
            216(1)(a).
          </Trans>
        ) : (
          <Trans>
            Please confirm whether you intend to renew my lease, If you do not
            intend to renew, please provide the specific “good cause” ground, as
            required under RPL § 215 and RPL § 216(4). If you do not provide
            such reason, I will assume I retain the right to continue my tenancy
            under existing terms.
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
        uphold both legal obligations and good-faith communication.{" "}
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
        Cause Eviction law, visit:{" "}
        <a
          href="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page
        </a>
      </Trans>
    </p>
    <p>
      <Trans>To read the full law, visit:</Trans>{" "}
      <a
        href="https://www.nysenate.gov/legislation/laws/RPP/A6-A"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.nysenate.gov/legislation/laws/RPP/A6-A
      </a>
    </p>
  </section>
);

const LetterFooter: React.FC<LetterData> = ({ letterData }) => {
  const { user_details: ud } = letterData;
  return (
    <footer style={{ display: "block", textAlign: "right" }}>
      <p><Trans>Regards</Trans>,</p>
      <p>
        {ud.first_name} {ud.last_name}
      </p>
      {ud.email && <p>{ud.email}</p>}
    </footer>
  );
};
