import { ContentBoxFooter } from "../../ContentBox/ContentBox";
import { Header } from "../../Header/Header";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { JFCLLinkInternal } from "../../JFCLLink";
import "./RentCalculator.scss";
import {
  CPI,
  GoodCauseProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { formatMoney } from "../../../helpers";
import { Button, TextInput } from "@justfixnyc/component-library";
import { useState } from "react";
import { PhoneNumberCallout } from "../Results/Results";
import { gtmPush } from "../../../google-tag-manager";

export const RentCalculator: React.FC = () => {
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
        title="Calculate your rent increase"
        subtitle="If you are covered by Good Cause legislation, you have a right to limited rent
            increases. Use this calculator to determine the allowable rent increase for your apartment under Good Cause."
      ></Header>
      <div className="content-section">
        <div className="content-section__content">
          <div className="rent-calculator-callout-box">
            <span className="callout-box__header">
              Find out how much your landlord can increase your rent
            </span>
            <form
              className="rent-input-container"
              onSubmit={handleSubmit}
              aria-label="Enter the total monthly rent for your entire apartment"
            >
              <TextInput
                labelText="Enter the total monthly rent for your entire apartment"
                type="money"
                id="rent-input"
                value={rentInput}
                onChange={handleInputChange}
                onWheel={(e) => {
                  // prevents scroll incrementing value
                  e.currentTarget.blur();
                  e.stopPropagation();
                  setTimeout(() => e.currentTarget.focus(), 0);
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
                Allowable rent increase amount:
              </p>
              <p className="rent-increase-result">
                {rentInput && showRentInput ? (
                  <>
                    <span className="rent-increase-formula">
                      {`${formatMoney(Number(rentInput))} + ${increase_pct}% =`}{" "}
                    </span>
                    <span className="rent-increase-amount">
                      {`${formatMoney(
                        Number(rentInput) * (1 + increase_pct / 100)
                      )} `}
                    </span>
                  </>
                ) : (
                  <>{`Your current monthly rent + ${increase_pct}%`}</>
                )}
              </p>
            </div>
          </div>
          <div className="rent-increase-explanation">
            <p>
              If your rent was increased after April 20, 2024 beyond the
              allowable rent increase amount calculated above, your rent
              increase could be found unreasonable by housing court.
            </p>
            <p>
              The Good Cause law establishes a Reasonable Rent Increase, which
              is set every year at the rate of inflation plus 5%, with a maximum
              of 10% total. As of May 1, 2024, the rate of inflation for New
              York City is 3.82%, meaning that the current local Reasonable Rent
              Increase is 8.82%.
            </p>
            <p>
              Note: Landlords can increase the rent beyond the Reasonable Rent
              Increase limit, but they must explain why and must prove increases
              in their costs or substantial repairs they did to the apartment or
              building.
            </p>
            <strong>Find out if you’re covered by Good Cause</strong>{" "}
            <p className="mobile-breakpoint"></p>
            <JFCLLinkInternal
              to="/"
              onClick={() =>
                gtmPush("gce_return_survey", {
                  from: "rent-calculator-page",
                })
              }
            >
              Take the survey
            </JFCLLinkInternal>
          </div>
          <div className="divider__print" />
          <PhoneNumberCallout gtmId="rent-calculator-page" />

          <GoodCauseProtections
            rent={showRentInput ? Number(rentInput) : undefined}
            subtitle={"Protections under Good Cause"}
          >
            <ContentBoxFooter
              message="Find out if you’re covered by Good Cause"
              linkText="Take the survey"
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
