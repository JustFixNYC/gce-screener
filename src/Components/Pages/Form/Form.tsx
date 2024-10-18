import {
  Button,
  FormGroup,
  Icon,
  TextInput,
} from "@justfixnyc/component-library";
import "./Form.scss";
import { useNavigate } from "react-router";
import { FormStep } from "../../FormStep/FormStep";
import { Address } from "../Home/Home";
import { Link } from "react-router-dom";
import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { useState } from "react";
import { RadioGroup } from "../../RadioGroup/RadioGroup";

type FormFields = {
  bedrooms: "studio" | "1" | "2" | "3" | "4+" | null;
  rent: "$5,846" | "$6,005" | "$6,742" | "$8,413" | "$9,065" | ">$9,065" | null;
  landlord: "yes" | "no" | "maybe" | null;
  rentStabilized: "yes" | "no" | "maybe" | null;
  housingType: "public" | "subsidized" | "none" | "not-sure" | null;
};

const initialFields: FormFields = {
  bedrooms: null,
  rent: null,
  landlord: null,
  rentStabilized: null,
  housingType: null,
};

export const Form: React.FC = () => {
  const [address] = useSessionStorage<Address>("address");
  const [fields, setFields] = useSessionStorage<FormFields>(
    "fields",
    initialFields
  );
  const [localFields, setLocalFields] = useState<FormFields>(
    fields || initialFields
  );

  const bbl = address?.bbl || "3082320055";

  const { data: bldgData } = useGetBuildingEligibilityInfo(bbl);

  const navigate = useNavigate();

  const handleSubmit = () => {
    setFields(localFields);
    navigate(`/results`);
  };

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.dataset.value || null;
    const updatedFields = {
      ...localFields,
      [fieldName]: value,
    };
    setLocalFields(updatedFields as FormFields);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    const updatedFields = {
      ...localFields,
      [fieldName]: value,
    };
    setLocalFields(updatedFields as FormFields);
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
            <RadioGroup
              fields={localFields}
              radioGroup={{
                name: "bedrooms",
                options: [
                  { label: "Studio", value: "studio" },
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4+", value: "4+" },
                ],
              }}
              onChange={handleRadioChange}
            />
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
            <RadioGroup
              fields={localFields}
              radioGroup={{
                name: "landlord",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                  { label: "I'm not sure", value: "not-sure" },
                ],
              }}
              onChange={handleRadioChange}
            />
          </FormGroup>
        </FormStep>

        <FormStep step={4} total={5}>
          <FormGroup
            legendText="Is your apartment rent-stabilized?"
            helperText={rsHelperText}
          >
            <RadioGroup
              fields={localFields}
              radioGroup={{
                name: "rentStabilized",
                options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                  { label: "I'm not sure", value: "not-sure" },
                ],
              }}
              onChange={handleRadioChange}
            />
          </FormGroup>
        </FormStep>

        <FormStep step={5} total={5}>
          <FormGroup
            legendText="Is your apartment associated with any of the following?"
            helperText={subsidyHelperText}
          >
            <RadioGroup
              fields={localFields}
              radioGroup={{
                name: "housingType",
                options: [
                  { label: "NYCHA", value: "public" },
                  { label: "Subsidized housing", value: "subsidized" },
                  { label: "None of these", value: "none" },
                  { label: "I'm not sure", value: "not-sure" },
                ],
              }}
              onChange={handleRadioChange}
            />
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
          disabled={!localFields || !Object.values(localFields).every(Boolean)}
        />
      </div>
    </div>
  );
};
