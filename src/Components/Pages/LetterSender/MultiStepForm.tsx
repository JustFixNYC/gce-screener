import {
  Controller,
  FieldName,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import z from "zod";
import { Button, TextInput } from "@justfixnyc/component-library";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  formatPhoneNumber,
  handleFormNoDefault,
  parseFormattedPhoneNumber,
} from "../../../form-utils";
import { ProgressBar } from "./ProgressBar";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";

const FormSchema = z.object({
  firstName: z.string().min(1, "Name is required for the letter"),
  lastName: z.string().min(1, "Name is required for the letter"),
  phone: z
    .string({
      error: (iss) =>
        iss.input === undefined || iss.input === ""
          ? "Phone number is required for follow up"
          : "Please enter a complete US phone number",
    })
    .length(10, "Please enter a complete US phone number"),
  // Email has god default validator regex, plus alternatives, and way to
  // include custom ({pattern: /<regex>/})
  // To customize error messages add a function that checks different possible issues with the field
  email: z.email({
    error: (iss) =>
      iss.input === undefined || iss.input === ""
        ? "Email is required to send your copy of the letter"
        : "Please enter a valid email",
  }),
  houseNumber: z.string(),
  streetName: z.string(),
  borough: z.string(),
  zipcode: z.string().length(5).optional(),
  bbl: z.string().regex(/^d{10}$/),
});

type FormFields = z.infer<typeof FormSchema>;

// type Step = { id: string; name: string; fields?: FieldName<FormFields>[] };
interface Step {
  id: string;
  name: string;
  fields?: FieldName<FormFields>[];
}

const steps: Step[] = [
  {
    id: "Step 1",
    name: "Contact information",
    fields: ["email", "phone", "firstName", "lastName"],
  },
  {
    id: "Step 2",
    name: "Your address",
    fields: ["houseNumber", "streetName", "borough", "zipcode", "bbl"],
  },
  {
    id: "Step 3",
    name: "Landlord details",
    fields: ["houseNumber", "streetName", "borough", "zipcode", "bbl"],
  },

  { id: "Step 4", name: "Complete" },
];

export const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormFields>({
    // Issue with the inferred type being "unknown" when preprocess() is used to
    // handle values that should be changed to undefined
    resolver: zodResolver(FormSchema) as Resolver<FormFields>,
    mode: "onSubmit",
  });

  const processForm: SubmitHandler<FormFields> = (data: FormFields) => {
    console.log({ data });
    reset();
  };

  console.log({ address: watch("houseNumber") });

  const next = async () => {
    console.log("next");
    const fields = steps[currentStep].fields;

    if (!fields) {
      setCurrentStep((step) => step + 1);
      return;
    }

    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <form onSubmit={handleFormNoDefault(next)} className="letter-form">
      <h3>
        <pre>MultiStepForm</pre>
      </h3>
      <p>Multi step state management, customized errors</p>
      <ProgressBar steps={steps} currentStep={currentStep} />
      {currentStep === 0 && (
        <>
          <TextInput
            {...register("firstName")}
            id="form-firstName"
            labelText="First name"
            invalid={!!errors?.firstName}
            invalidText={errors?.firstName?.message}
            invalidRole="status"
            type="text"
          />
          <TextInput
            {...register("lastName")}
            id="form-lastName"
            labelText="Last name"
            invalid={!!errors?.lastName}
            invalidText={errors?.lastName?.message}
            invalidRole="status"
            type="text"
          />
          <TextInput
            {...register("email")}
            id="form-email"
            labelText="Email"
            invalid={!!errors?.email}
            invalidText={errors?.email?.message}
            invalidRole="status"
            type="email"
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                value={formatPhoneNumber(field.value)}
                onChange={(e) =>
                  field.onChange(parseFormattedPhoneNumber(e.target.value))
                }
                id="form-phone"
                labelText="Phone"
                invalid={!!errors?.phone}
                invalidText={errors?.phone?.message}
                invalidRole="status"
                type="tel"
              />
            )}
          />
        </>
      )}
      {currentStep === 1 && (
        <>
          <GeoSearchInput
            onChange={(addr) => {
              setValue("bbl", addr.bbl);
              setValue("houseNumber", addr.houseNumber);
              setValue("streetName", addr.streetName);
              setValue("borough", addr.borough);
              setValue("zipcode", addr.zipcode);
            }}
            invalid={!!errors.houseNumber}
            setInvalid={(val) => {
              if (val) {
                setError("houseNumber", {
                  type: "custom",
                  message: "Error with address selection",
                });
              }
            }}
          />
        </>
      )}
      <div className="form-buttons">
        {currentStep > 0 && (
          <Button variant="tertiary" labelText="Back" onClick={prev} />
        )}
        <Button
          labelText={currentStep < steps.length - 1 ? "Next" : "Submit"}
          type="submit"
        />
      </div>
    </form>
  );
};
