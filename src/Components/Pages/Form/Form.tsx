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
import { useGetBuildingEligibilityInfo } from "../../../api/hooks";

type FormProps = {
  address?: Address;
  fields: FormFields;
  setFields: (fields: FormFields) => void;
};

export const Form: React.FC<FormProps> = ({ address, fields, setFields }) => {
  const bbl = address?.bbl || "3082320055";

  const { data: bldgData } = useGetBuildingEligibilityInfo(bbl);

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

  const rsHelperText = !bldgData
    ? undefined
    : bldgData.post_hstpa_rs_units >= bldgData.unitsres
    ? "Our data shows that all apartments in your building are registered as rent stabilized."
    : new Date(bldgData.end_421a) > new Date()
    ? "Your building appears to receive the 421a tax exemption. This means your apartment is rent stabilized."
    : new Date(bldgData.end_j51) > new Date()
    ? "Your building appears to receive the J51 tax exemption. This means your apartment is rent stabilized."
    : bldgData.post_hstpa_rs_units > 0
    ? "Our data shows that some apartments in your building are registered as rent stabilized."
    : bldgData.yearbuilt < 1974 && bldgData.unitsres >= 6
    ? "Based on the size and age of your building, your apartment might be rent stabilized."
    : undefined;

  const subsidyHelperText = !bldgData
    ? undefined
    : bldgData.is_nycha
    ? "Based on our data, it looks like your building is part of NYCHA"
    : bldgData.is_subsidized
    ? `Based on our data, it looks like your building receives ${bldgData.subsidy_name} subsidy`
    : "If your apartment is kept affordable for people based on their income level, then you live in what’s called “subsidized housing.”" +
      " Your apartment is not considered subsidized if you receive a housing voucher that can be used anywhere.";

  return (
    <div className="form__wrapper">
      <div className="form__navHeader">
        <Link to="home">Home</Link>
        <Icon icon="caretRight" className="form__navHeader__caret" />{" "}
        {address?.address}
      </div>

      <h2>Screener Survey</h2>

      <p className="form__subheader">
        We'll use your answers to help learn if you're covered.
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
            helperText="Please provide the total rent of your unit, not just the portion of rent that you pay."
            id="rent-input"
            type="money"
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
          <FormGroup
            legendText="Is your apartment rent-stabilized?"
            helperText={rsHelperText}
          >
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
          <FormGroup
            legendText="Is your apartment associated with any of the following?"
            helperText={subsidyHelperText}
          >
            <div className="radio-options">
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="NYCHA"
                id="housing-type-public"
                data-value="public"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="Subsidized housing"
                id="housing-type-subsidized"
                data-value="subsidized"
                onChange={handleRadioChange}
              ></SelectButton>
              <SelectButton
                className="radio-button"
                name="housingType"
                labelText="None of these"
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
