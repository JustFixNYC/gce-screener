import { useState } from "react";
import { Button, TextInput } from "@justfixnyc/component-library";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";

import { ContentBoxFooter } from "../../ContentBox/ContentBox";
import { Header } from "../../Header/Header";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { JFCLLinkInternal } from "../../JFCLLink";
import {
  GoodCauseProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { formatMoney } from "../../../helpers";
import { gtmPush } from "../../../google-tag-manager";
import { PhoneNumberCallout } from "../../PhoneNumberCallout/PhoneNumberCallout";
import { CPI, CPI_EFFECTIVE_DATE } from "./RentIncreaseValues";
import { Notice } from "../../Notice/Notice";
import "./RentCalculator.scss";

export const RentCalculator: React.FC = () => {
  const { _ } = useLingui();
  useAccordionsOpenForPrint();

  const increase_pct = CPI + 5;

  const [rentInput, setRentInput] = useState("");
  const [showRentInput, setShowRentInput] = useState(false);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (showRentInput) {
      setShowRentInput(false);
    }
    const value = e.target.value;
    setRentInput(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowRentInput(true);
    gtmPush("gce_rent_calculator_submit");
  };

  return (
    <div id="rent-calculator-page">
      <Header
        showProgressBar={false}
        title={_(msg`Calculate your rent increase`)}
        subtitle={_(
          msg`If you are covered by Good Cause legislation, you have a right to limited rent increases. Use this calculator to determine the allowable rent increase for your apartment under Good Cause.`
        )}
      ></Header>
      <div className="content-section">
        <div className="content-section__content">
          <div className="rent-calculator-callout-box">
            <span className="callout-box__header">
              <Trans>
                Find out how much your landlord can increase your rent
              </Trans>
            </span>
            <form className="rent-input-container" onSubmit={handleSubmit}>
              <TextInput
                labelText={_(
                  msg`Enter the total monthly rent for your entire apartment`
                )}
                type="money"
                id="rent-input"
                value={rentInput}
                onChange={handleInputChange}
                onWheel={(e) => {
                  // prevents scroll incrementing value
                  e.currentTarget.blur();
                  e.stopPropagation();
                  setTimeout(() => e?.currentTarget?.focus(), 0);
                }}
              />
              <Button
                type="submit"
                variant="primary"
                size="small"
                labelText="Calculate"
              />
            </form>
            <div className="rent-increase-container">
              <p className="rent-increase-header">
                <Trans>Allowable rent increase amount:</Trans>
              </p>
              {rentInput && showRentInput ? (
                <>
                  <p className="rent-increase-result">
                    <span className="rent-increase-formula">
                      {`${formatMoney(Number(rentInput))} + ${increase_pct}% =`}{" "}
                    </span>
                    <span className="rent-increase-amount">
                      {`${formatMoney(
                        Number(rentInput) * (1 + increase_pct / 100)
                      )} `}
                    </span>
                  </p>
                  <LetterSenderCallout />
                </>
              ) : (
                <p className="rent-increase-result">
                  <Trans>Your current monthly rent</Trans> + {increase_pct}%
                </p>
              )}
            </div>
          </div>
          <div className="rent-increase-explanation">
            <p>
              <Trans>
                If your rent was increased after April 20, 2024 beyond the
                allowable rent increase amount calculated above, your rent
                increase could be found unreasonable by housing court.
              </Trans>
            </p>
            <p>
              <Trans>
                The Good Cause law establishes a Reasonable Rent Increase, which
                is set every year at the rate of inflation plus 5%, with a
                maximum of 10% total. As of ${_(CPI_EFFECTIVE_DATE)}, the rate
                of inflation for New York City is ${CPI}%, meaning that the
                current local Reasonable Rent Increase is ${CPI + 5}%.
              </Trans>
            </p>
            <p>
              <Trans>
                Note: Landlords can increase the rent beyond the Reasonable Rent
                Increase limit, but they must explain why and must prove
                increases in their costs or substantial repairs they did to the
                apartment or building.
              </Trans>
            </p>
            <strong>
              <Trans>Find out if you’re covered by Good Cause</Trans>
            </strong>{" "}
            <p className="mobile-breakpoint"></p>
            <JFCLLinkInternal
              to="/"
              onClick={() =>
                gtmPush("gce_return_survey", {
                  from: "rent-calculator-page",
                })
              }
            >
              <Trans>Take the survey</Trans>
            </JFCLLinkInternal>
          </div>
          <div className="divider__print" />
          <PhoneNumberCallout
            headerText={_(msg`Help build tenant power in NYC`)}
            bodyText={_(
              msg`We’ll text you once a year to learn about your housing conditions. We’ll use your answers to better advocate for your rights.`
            )}
            gtmId="rent-calculator-page"
          />

          <GoodCauseProtections
            rent={showRentInput ? Number(rentInput) : undefined}
            subtitle={_(msg`Protections under Good Cause`)}
          >
            <ContentBoxFooter
              message={_(msg`Find out if you’re covered by Good Cause`)}
              linkText={_(msg`Take the survey`)}
              linkTo="/"
              linkOnClick={() =>
                gtmPush("gce_return_survey", {
                  from: "rent-calculator-page",
                })
              }
            />
          </GoodCauseProtections>
          <UniversalProtections />
        </div>
      </div>
    </div>
  );
};

const LetterSenderCallout = () => {
  const { i18n } = useLingui();
  return (
    <Notice icon="circleInfo" className="letter-callout" color="off-white-100">
      <p>
        <strong>If you’re covered by Good Cause</strong> and your landlord is
        planning to raise your rent beyond this amount, you can send a
        legally-vetted letter to your landlord to ask for a lower rent increase.
      </p>
      <ul>
        <li>
          <JFCLLinkInternal to={`/${i18n.locale}/letter`}>
            Check out the Letter Sender
          </JFCLLinkInternal>
        </li>
        <li>
          <JFCLLinkInternal to={`/${i18n.locale}`}>
            Find out if I’m covered
          </JFCLLinkInternal>
        </li>
      </ul>
    </Notice>
  );
};
