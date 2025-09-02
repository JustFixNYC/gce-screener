import { Controller } from "react-hook-form";
import { TextInput } from "@justfixnyc/component-library";
import {
  formatPhoneNumber,
  parseFormattedPhoneNumber,
} from "../../../form-utils";
import { FormHookProps } from "../../../types/LetterFormTypes";

export const UserDetailsStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    control,
    formState: { errors },
  } = props;

  const userErrors = errors.userDetails;

  return (
    <>
      <TextInput
        {...register("userDetails.firstName")}
        id="form-firstName"
        labelText="First name"
        invalid={!!userErrors?.firstName}
        invalidText={userErrors?.firstName?.message}
        invalidRole="status"
        type="text"
      />
      <TextInput
        {...register("userDetails.lastName")}
        id="form-lastName"
        labelText="Last name"
        invalid={!!userErrors?.lastName}
        invalidText={userErrors?.lastName?.message}
        invalidRole="status"
        type="text"
      />
      <TextInput
        {...register("userDetails.email")}
        id="form-email"
        labelText="Email"
        invalid={!!userErrors?.email}
        invalidText={userErrors?.email?.message}
        invalidRole="status"
        type="email"
      />
      <Controller
        name="userDetails.phone"
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
            invalid={!!userErrors?.phone}
            invalidText={userErrors?.phone?.message}
            invalidRole="status"
            type="tel"
          />
        )}
      />
    </>
  );
};
