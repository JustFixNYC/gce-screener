import { SelectButton } from "@justfixnyc/component-library";
import { FormFields } from "../Pages/Form/Form";
import "./RadioGroup.scss";

type RadioGroupProps = {
  fields: FormFields;
  radioGroup: {
    name: keyof FormFields;
    options: { label: string; value: string }[];
  };
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  fields,
  radioGroup,
  onChange,
}) => {
  return (
    <div className="radio-options">
      {radioGroup.options.map((option) => {
        return (
          <SelectButton
            className="radio-button"
            name={radioGroup.name}
            labelText={option.label}
            id={`${radioGroup.name}-${option.value}`}
            key={`${radioGroup.name}-${option.value}`}
            data-value={option.value}
            checked={fields[radioGroup.name] === option.value}
            onChange={onChange}
          ></SelectButton>
        );
      })}
    </div>
  );
};
