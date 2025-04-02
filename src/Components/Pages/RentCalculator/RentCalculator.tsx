import { useLoaderData, useSearchParams } from "react-router-dom";

import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import { Address } from "../Home/Home";
import { Header } from "../../Header/Header";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { GCEUser } from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Survey";
import { useSearchParamsURL } from "../../../hooks/useSearchParamsURL";
import { JFCLLinkExternal } from "../../JFCLLink";
import { gtmPush } from "../../../google-tag-manager";
import "./RentCalculator.scss";
import {
  CPI,
  GoodCauseExercisingRights,
  GoodCauseProtections,
  RentStabilizedProtections,
} from "../../KYRContent/KYRContent";
import { formatMoney } from "../../../helpers";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
import { Button, TextInput } from "@justfixnyc/component-library";
import { useState } from "react";

export const RentCalculator: React.FC = () => {
  const { user, address, fields } = useLoaderData() as {
    user: GCEUser;
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

  const increase_pct = CPI + 5;
  const rent = fields ? Number(fields.rent) : 0;

  const [rentInput, setRentInput] = useState("");
  const [showRentInput, setShowRentInput] = useState(false);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    //const fieldName = e.target.name;
    if (showRentInput) {
      setShowRentInput(false);
    }
    const value = e.target.value;
    setRentInput(value);
  };

  const handleSubmit = () => {
    setShowRentInput(true);
  };

  return (
    <div id="rent-stabilization-page">
      <Header
        showProgressBar={false}
        title="Calculate your rent increase"
        subtitle="Use this calculator to help you determine what the allowable rent increase is under Good Cause."
      ></Header>
      <div className="content-section">
        <div className="content-section__content">
          <ContentBox subtitle="If you are covered by Good Cause, you have a right to limited rent increases.">
            <ContentBoxItem accordion={false}>
              <p>
                {`The state housing agency must publish each year’s Reasonable Rent
                        Increase by August. This year, the maximum amount your landlord can
                        increase your rent by is ${increase_pct}%.`}
                <br /> <br />
                If you are offered a new lease after April 20th, 2024, then your
                landlord can’t raise your apartment’s monthly rent higher than{" "}
                <b>{`your current monthly rent + ${increase_pct}%`}</b>
              </p>
              <br />
              <div className="callout-box">
                <div className="rent-input-container">
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
                    variant="secondary"
                    size="small"
                    labelText="Calculate"
                    onClick={handleSubmit}
                  />
                </div>
                <p className="rent-increase-description">
                  Allowable rent increase amount:
                </p>
                <span className="rent-increase">
                  {rentInput && showRentInput ? (
                    <>
                      {`${formatMoney(Number(rentInput))} + ${increase_pct}% =`}
                      <b>
                        {" "}
                        {`${formatMoney(
                          Number(rentInput) * (1 + increase_pct / 100)
                        )} `}
                      </b>
                    </>
                  ) : (
                    <>{`Your current monthly rent + ${increase_pct}%`}</>
                  )}
                </span>
              </div>
              <p>
                <strong>Note</strong>
                <br />
                Landlords can increase the rent more than the reasonable rent
                increase but they must explain why and must point to increases
                in their costs or substantial repairs they did to the apartment
                or building.
              </p>
              <br />
              <JFCLLinkExternal
                className="has-label"
                to="https://legalaidnyc.org/get-help/housing-problems/what-you-need-to-know-about-new-yorks-good-cause-eviction-law/#rent-increases"
              >
                Learn more about Reasonable Rent Increase
              </JFCLLinkExternal>
            </ContentBoxItem>
          </ContentBox>
          <div className="divider__print" />

          <GoodCauseProtections rent={Number(fields?.rent)}>
            <ContentBoxFooter
              message="Find out if you’re covered by Good Cause"
              linkText="Take the survey"
              linkTo="/"
            />
          </GoodCauseProtections>
        </div>
      </div>
    </div>
  );
};
