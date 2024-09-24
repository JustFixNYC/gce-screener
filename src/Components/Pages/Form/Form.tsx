import { Button, RadioButton } from "@justfixnyc/component-library";
import "./Form.scss";
import { useNavigate } from "react-router";
import { FormStep } from "../../FormStep/FormStep";
// import { useState } from "react";
import { Address } from "../Home/Home";
// import { useState } from "react";
import { FormFields } from "../../../App";


type FormProps = {
  address?: Address;
  fields: FormFields;
  setFields: (fields: FormFields) => void;
};

export const Form: React.FC<FormProps> = ({ address, fields, setFields }) => {
  const navigate = useNavigate();


  const handleSubmit = () => {
    navigate("/results")
  };

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.dataset.value;
    const updatedFields = {
      ...fields,
      [fieldName]: value,
    };
    setFields(updatedFields);
  };

  return (
    <>
      <Button
        labelText="Back"
        labelIcon="chevronLeft"
        size="small"
        variant="secondary"
        onClick={() => navigate("home")}
      />
      <h2>Screener Survey</h2>
      <p>
        We'll use this information from this 5-question survey to run through
        the laws and find out if you're covered.
      </p>

      <div className="address">{address?.label}</div>
      <form>
        <FormStep
          step={1}
          total={5}
          question="How many bedrooms are in your apartment?"
        >
          <div className="radio-options">
            <RadioButton
              className="radio-button"
              name="bedrooms"
              labelText="Studio"
              id="bedrooms-studio"
              data-value="studio"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="bedrooms"
              labelText="1"
              id="bedrooms-1"
              data-value="1"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="bedrooms"
              labelText="2"
              id="bedrooms-2"
              data-value="2"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="bedrooms"
              labelText="3"
              id="bedrooms-3"
              data-value="3"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="bedrooms"
              labelText="4+"
              id="bedrooms-4"
              data-value="4+"
              onChange={handleOnChange}
            ></RadioButton>
          </div>
        </FormStep>

        <FormStep
          step={2}
          total={5}
          question="What is the total monthly rent for your entire unit?"
          description="If you are above or below, based on the number of rooms in your
            apartment, that impacts something something... . . ."
        >
          <div className="radio-options">
            <RadioButton
              className="radio-button"
              name="rent"
              labelText="Less than $5,846"
              id="rent-less-than-5846"
              data-value="<5846"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rent"
              labelText="$5,847 - $6,005"
              id="rent-5847-6005"
              data-value="5847-6005"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rent"
              labelText="$6,006 - $6,742"
              id="rent-6006-6742"
              data-value="6006-6742"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rent"
              labelText="$6,743 - $8,413"
              id="rent-6743-8413"
              data-value="6743-8413"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rent"
              labelText="$8,413 - $9,065"
              id="rent-8413-9065"
              data-value="8413-9065"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rent"
              labelText="More than $9,066"
              id="rent-9066"
              data-value=">9066"
              onChange={handleOnChange}
            ></RadioButton>
          </div>
        </FormStep>

        <FormStep
          step={3}
          total={5}
          question="Does your landlord live in the building?"
        >
          <div className="radio-options">
            <RadioButton
              className="radio-button"
              name="landlord"
              labelText="Yes"
              id="landlord-yes"
              data-value="yes"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="landlord"
              labelText="No"
              id="landlord-no"
              data-value="no"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="landlord"
              labelText="I'm not sure"
              id="landlord-not-sure"
              data-value="not-sure"
              onChange={handleOnChange}
            ></RadioButton>
          </div>
        </FormStep>

        <FormStep
          step={4}
          total={5}
          question="Is your apartment rent-stabilized?"
        >
          <div className="radio-options">
            <RadioButton
              className="radio-button"
              name="rentStabilized"
              labelText="Yes"
              id="rent-stabilized-yes"
              data-value="yes"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rentStabilized"
              labelText="No"
              id="rent-stabilized-no"
              data-value="no"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="rentStabilized"
              labelText="I'm not sure"
              id="rent-stabilized-not-sure"
              data-value="not-sure"
              onChange={handleOnChange}
            ></RadioButton>
          </div>
        </FormStep>

        <FormStep
          step={5}
          total={5}
          question="Which housing type is your apartment associated with?"
        >
          <div className="radio-options">
            <RadioButton
              className="radio-button"
              name="housingType"
              labelText="NYCHA/Public Housing"
              id="housing-type-public"
              data-value="public"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="housingType"
              labelText="Subsidized/Income Restricted"
              id="housing-type-subsidized"
              data-value="subsidized"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="housingType"
              labelText="Manufactured Housing"
              id="housing-type-manufactured"
              data-value="manufactured"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="housingType"
              labelText="None of these?"
              id="housing-type-none"
              data-value="none"
              onChange={handleOnChange}
            ></RadioButton>
            <RadioButton
              className="radio-button"
              name="housingType"
              labelText="I'm not sure"
              id="housing-type-not-sure"
              data-value="not-sure"
              onChange={handleOnChange}
            ></RadioButton>
          </div>
        </FormStep>
      </form>

      <Button labelText="Submit!" labelIcon="check" onClick={handleSubmit} />
    </>
  );
};
