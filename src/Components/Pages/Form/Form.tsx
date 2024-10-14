import {
  Button,
  FormGroup,
  Icon,
  SelectButton,
  TextInput,
} from "@justfixnyc/component-library";
import "./Form.scss";
import { useNavigate } from "react-router";
import { FormStep } from "../../FormStep/FormStep";
import { Address } from "../Home/Home";
import { FormFields } from "../../../App";
import { Link } from "react-router-dom";

type FormProps = {
  address?: Address;
  fields: FormFields;
  setFields: (fields: FormFields) => void;
};

export const Form: React.FC<FormProps> = ({ address, fields, setFields }) => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/results`);
  };

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.dataset.value;
    const updatedFields = {
      ...fields,
      [fieldName]: value,
    };
    setFields(updatedFields);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    const updatedFields = {
      ...fields,
      [fieldName]: value,
    };
    setFields(updatedFields);
  };

  return (
    <div className="form__wrapper">
      <div className="form__navHeader">
        <Link to="home">Home</Link>
        <Icon icon="caretRight" className="form__navHeader__caret" />{" "}
        {address?.address}
      </div>

      <h2 className="form__header">Screener Survey</h2>

      <p className="form__subheader">
        We'll use this information from this 5-question survey to run through
        the laws and find out if you're covered.
      </p>

      <form>
        <FormStep step={1} total={5}>
          <FormGroup legendText="How many bedrooms are in your apartment?">
            <div className="radio-options">
              <SelectButton
                className="radio-button"
                name="bedrooms"
                labelText="Studio"
                id="bedrooms-studio"
                data-value="studio"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="bedrooms"
                labelText="1"
                id="bedrooms-1"
                data-value="1"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="bedrooms"
                labelText="2"
                id="bedrooms-2"
                data-value="2"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="bedrooms"
                labelText="3"
                id="bedrooms-3"
                data-value="3"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="bedrooms"
                labelText="4+"
                id="bedrooms-4"
                data-value="4+"
                onChange={handleRadioChange}
              ></SelectButton>
            </div>
          </FormGroup>
        </FormStep>

        <FormStep step={2} total={5}>
          <TextInput
            labelText="What is the total monthly rent for your entire unit?"
            id="rent-input"
            type="number"
            name="rent"
            onChange={handleInputChange}
          />
        </FormStep>

        <FormStep step={3} total={5}>
          <FormGroup legendText="Does your landlord live in the building?">
            <div className="radio-options">
              <SelectButton
                className="radio-button"
                name="landlord"
                labelText="Yes"
                id="landlord-yes"
                data-value="yes"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="landlord"
                labelText="No"
                id="landlord-no"
                data-value="no"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="landlord"
                labelText="I'm not sure"
                id="landlord-not-sure"
                data-value="not-sure"
                onChange={handleRadioChange}
              ></SelectButton>
            </div>
          </FormGroup>
        </FormStep>

        <FormStep step={4} total={5}>
          <FormGroup legendText="Is your apartment rent-stabilized?">
            <div className="radio-options">
              <SelectButton
                className="radio-button"
                name="rentStabilized"
                labelText="Yes"
                id="rent-stabilized-yes"
                data-value="yes"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="rentStabilized"
                labelText="No"
                id="rent-stabilized-no"
                data-value="no"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="rentStabilized"
                labelText="I'm not sure"
                id="rent-stabilized-not-sure"
                data-value="not-sure"
                onChange={handleRadioChange}
              ></SelectButton>
            </div>
          </FormGroup>
        </FormStep>

        <FormStep step={5} total={5}>
          <FormGroup legendText="Which housing type is your apartment associated with?">
            <div className="radio-options">
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="NYCHA/Public Housing"
                id="housing-type-public"
                data-value="public"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="Subsidized/Income Restricted"
                id="housing-type-subsidized"
                data-value="subsidized"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="Manufactured Housing"
                id="housing-type-manufactured"
                data-value="manufactured"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="None of these?"
                id="housing-type-none"
                data-value="none"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="I'm not sure"
                id="housing-type-not-sure"
                data-value="not-sure"
                onChange={handleRadioChange}
              ></SelectButton>
            </div>
          </FormGroup>
        </FormStep>
      </form>
      <div className="form__buttons">
        <Button
          labelText="Back"
          labelIcon="chevronLeft"
          variant="secondary"
          onClick={() => navigate("/confirm_address")}
        />
        <Button
          labelText="Next"
          onClick={handleSubmit}
          disabled={Object.values(fields).includes(null)}
        />
      </div>
    </div>
  );
};
