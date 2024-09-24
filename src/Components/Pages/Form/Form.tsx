import { Button, RadioButton } from "@justfixnyc/component-library";
import "./Form.scss";
import { useNavigate } from "react-router";
import { FormStep } from "../../FormStep/FormStep";

export const Form = () => {
  const navigate = useNavigate();
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

      <div className="address">7 Renaissance Court, Brooklyn</div>

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
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="bedrooms"
            labelText="1"
            id="bedrooms-1"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="bedrooms"
            labelText="2"
            id="bedrooms-2"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="bedrooms"
            labelText="3"
            id="bedrooms-3"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="bedrooms"
            labelText="4+"
            id="bedrooms-4"
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
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="rent"
            labelText="More than $5,846"
            id="rent-more-than-5846"
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
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="landlord"
            labelText="No"
            id="landlord-no"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="landlord"
            labelText="I'm not sure"
            id="landlord-not-sure"
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
            name="rent-stabilized"
            labelText="Yes"
            id="rent-stabilized-yes"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="rent-stabilized"
            labelText="No"
            id="rent-stabilized-no"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="rent-stabilized"
            labelText="I'm not sure"
            id="rent-stabilized-not-sure"
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
            name="housing-type"
            labelText="NYCHA/Public Housing"
            id="housing-type-nycha"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="housing-type"
            labelText="Subsidized/Income Restricted"
            id="housing-type-subsidized"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="housing-type"
            labelText="Manufactured Housing"
            id="housing-type-manufactured"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="housing-type"
            labelText="None of these?"
            id="housing-type-none"
          ></RadioButton>
          <RadioButton
            className="radio-button"
            name="housing-type"
            labelText="I'm not sure"
            id="housing-type-not-sure"
          ></RadioButton>
        </div>
      </FormStep>

      <Button labelText="Submit" labelIcon="check" />
    </>
  );
};
