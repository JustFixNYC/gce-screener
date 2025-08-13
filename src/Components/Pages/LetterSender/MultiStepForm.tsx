import {
  Controller,
  FieldPath,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import z from "zod";
import {
  Button,
  FormGroup,
  RadioButton,
  TextInput,
} from "@justfixnyc/component-library";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  formatPhoneNumber,
  handleFormNoDefault,
  parseFormattedPhoneNumber,
} from "../../../form-utils";
import { ProgressBar } from "./ProgressBar";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { useGetLandlordData } from "../../../api/hooks";
import { LandlordContact, LandlordData } from "../../../types/APIDataTypes";

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
  email: z.email({
    // To customize error messages add a function that checks different possible
    // issues with the field, since z.email("invalid format") would also give
    // the same message even if empty input
    error: (iss) =>
      iss.input === undefined || iss.input === ""
        ? "Email is required to send your copy of the letter"
        : "Please enter a valid email",
  }),
  address: z.object({
    houseNumber: z.string(),
    streetName: z.string(),
    borough: z.string(),
    zipcode: z.string().length(5).optional(),
    bbl: z.string().regex(/^\d{10}$/),
  }),
  landlordAddress: z.object({
    houseNumber: z.string(),
    streetName: z.string(),
    city: z.string(),
    state: z.string(),
    zipcode: z.string().length(5),
  }),
  // TODO: add fieldArray of issues (see https://react-hook-form.com/docs/usefieldarray)
});

type FormFields = z.infer<typeof FormSchema>;

interface Step {
  id: string;
  name: string;
  fields?: FieldPath<FormFields>[];
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
    fields: ["address"],
  },
  {
    id: "Step 3",
    name: "Landlord details",
    fields: ["landlordAddress"],
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
    getValues,
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

  console.log({ address: watch("address") });

  const next = async () => {
    const fields = steps[currentStep].fields;

    if (!fields) {
      setCurrentStep((step) => step + 1);
      return;
    }

    // console.log(FormSchema.safeParse(getValues()));

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

  const {
    data: landlordData,
    isLoading,
    error,
  } = useGetLandlordData(getValues("address.bbl"));

  const owners = getOwnerContacts(landlordData);
  console.log({ step: currentStep, owner: owners });

  return (
    <form onSubmit={handleFormNoDefault(next)} className="letter-form">
      <h3>
        <pre>MultiStepForm</pre>
      </h3>
      <p>Multi step state management, customized errors</p>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="letter-form__content">
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
              // extra keys (eg. longLat) are ignored
              onChange={(addr) => setValue("address", addr)}
              invalid={!!errors.address}
              setInvalid={(isError) => {
                if (isError) {
                  setError("address", {
                    type: "custom",
                    message: "Error with address selection",
                  });
                }
              }}
            />
          </>
        )}

        {currentStep === 2 && (
          <>
            {isLoading && <>Loading...</>}
            {error && <>Failed to lookup landlord information</>}
            {!isLoading && !error && owners && (
              <>
                <strong>Are any of these your landlord's information?</strong>
                <FormGroup legendText="Are any of these your landlord's information?">
                  {errors?.landlordAddress && (
                    <span className="error">
                      {errors?.landlordAddress?.message}
                    </span>
                  )}
                  {owners.map((owner, index) => (
                    // TODO: should update JFCL to allow label to be string or ReactNode
                    // try changing to controlled component with value={JSON.stringifed LLaddr object}, checked={compared stringifed value with current selection)}, onchange={set value}
                    <RadioButton
                      labelText={`${owner.value}: ${formatLandlordAddress(
                        owner.address
                      )}`}
                      id={`landlord-address_${index}`}
                      key={index}
                      name="landlord-address-radio-group"
                    />
                  ))}
                  <RadioButton
                    labelText="Other"
                    helperText="Enter landlord's contact information yourself"
                    id={`landlord-address_other`}
                    key={owners.length}
                    name="landlord-address-radio-group"
                  />
                  {/* when other selected, show inputs to manually enter.
                  can this use ...register() for same field as above controlled radios? */}
                </FormGroup>
              </>
            )}
          </>
        )}
      </div>
      <div className="letter-form__buttons">
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

const getOwnerContacts = (
  data?: LandlordData
): LandlordContact[] | undefined => {
  // TODO: review LOC methodology more closely
  // https://github.com/JustFixNYC/tenants2/blob/master/loc/landlord_lookup.py
  if (data === undefined) return;

  const owners = data.allcontacts
    .filter((contact) =>
      ["HeadOfficer", "IndividualOwner", "JointOwner"].includes(contact.title)
    )
    // Sort by title in above order, just happens to be alpha order by default
    .sort((a, b) => a.title.localeCompare(b.title));
  return owners;
};

const formatLandlordAddress = (addr: LandlordContact["address"]): string => {
  return `${addr.housenumber} ${addr.streetname}${
    addr.apartment ? " " + addr.apartment : ""
  }, ${addr.city}, ${addr.state} ${addr.zip}`;
};
