import { Button, RadioButton } from "@justfixnyc/component-library";
import "./Form.scss";

export const Form = () => {
  return (
    <>
      <Button
        labelText="Back"
        labelIcon="chevronLeft"
        size="small"
        variant="secondary"
      />
      <h2>Screener Survey</h2>
      <p>
        We'll use this information from this 5-question survey to run through
        the laws and find out if you're covered.
      </p>

      <div className="address">7 Renaissance Court, Brooklyn</div>

      <fieldset className="form-step">
        <p className="form-step-number">Question 1 of 5</p>

        <p className="form-step-question">How many bedrooms are in your apartment?</p>

        <div className="radio-options">
          <RadioButton className="radio-button" name="bedrooms" labelText="Studio" id="bedrooms-studio"></RadioButton>
          <RadioButton className="radio-button" name="bedrooms" labelText="1" id="bedrooms-1"></RadioButton>
          <RadioButton className="radio-button" name="bedrooms" labelText="2" id="bedrooms-2"></RadioButton>
          <RadioButton className="radio-button" name="bedrooms" labelText="3" id="bedrooms-3"></RadioButton>
          <RadioButton className="radio-button" name="bedrooms" labelText="4+" id="bedrooms-4"></RadioButton>
        </div>
      </fieldset>

      <fieldset className="form-step">
        <p className="form-step-number">Question 2 of 5</p>

        <p className="form-step-question">What is the total monthly rent for your entire unit??</p>
        <p className="form-step-description">
          If you are above or below, based on the number of rooms in your
          apartment, that impacts something something... . . .
        </p>
        <div className="radio-options">
          <RadioButton className="radio-button" name="rent" labelText="Less than $5,846" id="rent-less-than-5846"></RadioButton>
          <RadioButton className="radio-button" name="rent" labelText="More than $5,846" id="rent-more-than-5846"></RadioButton>
        </div>
      </fieldset>
      <Button labelText="Submit" labelIcon="check"/>
    </>
  );
};
