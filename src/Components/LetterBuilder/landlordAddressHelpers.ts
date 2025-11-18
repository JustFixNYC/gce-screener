import {
  LandlordContact,
  LandlordData,
  LOBVerificationResponse,
} from "../../types/APIDataTypes";
import { FormFields, LobAddressFields } from "../../types/LetterFormTypes";
import {
  separateBbl,
  Tenants2ApiFetcherVerifyAddress,
  WowApiFetcher,
} from "../../api/helpers";
import { toTitleCase } from "../../helpers";

export type Deliverability =
  | "deliverable"
  | "undeliverable"
  | "missing_unit"
  | "incorrect_unit"
  | "unnecessary_unit";

export const getVerifiedHpdLandlord = async (
  bbl: FormFields["user_details"]["bbl"]
): Promise<Omit<FormFields["landlord_details"], "email"> | undefined> => {
  if (!bbl) return;

  const { borough, block, lot } = separateBbl(bbl);
  const url = `/address/wowza?borough=${borough}&block=${block}&lot=${lot}`;
  const wowData = await WowApiFetcher(url);
  const owner = getOwnerContact(wowData?.addrs?.[0]);
  if (!owner || !hasUsefulPartialAddress(owner)) {
    return;
  }

  const wowLandlordDetails = wowContactToLandlordDetails(owner);

  if (!hasRequiredVerifyFields(wowLandlordDetails)) {
    return wowLandlordDetails;
  }

  try {
    const verification = await Tenants2ApiFetcherVerifyAddress(
      "/gceletter/verify_address",
      {
        arg: wowLandlordDetails,
      }
    );
    const lobAddress = LobVerificationToLandlordAddress(verification);
    return {
      ...wowLandlordDetails,
      ...lobAddress,
    };
  } catch (e) {
    console.warn(e);
    return wowLandlordDetails;
  }
};

const getOwnerContact = (data?: LandlordData): LandlordContact | undefined => {
  // https://github.com/JustFixNYC/tenants2/blob/master/loc/landlord_lookup.py
  if (data === undefined) return;
  if (data.allcontacts === null) return;

  return (
    data.allcontacts
      .filter((contact) =>
        ["HeadOfficer", "IndividualOwner", "JointOwner"].includes(contact.title)
      )
      // Sort by title in above order, just happens to be alpha order by default
      .sort((a, b) => a.title.localeCompare(b.title))?.[0]
  );
};

const wowContactToLandlordDetails = (
  contact: LandlordContact
): FormFields["landlord_details"] => {
  const { address } = contact;
  return {
    // on load, there is an error from unexpected "null" without || ""
    name: toTitleCase(contact.value) || "",
    primary_line: `${address.housenumber} ${toTitleCase(address.streetname)}`,
    secondary_line: toTitleCase(address.apartment) || "",
    city: toTitleCase(address.city) || "",
    state: address.state || "",
    zip_code: address.zip || "",
    no_unit: !address.apartment,
    urbanization: undefined,
  };
};

const LobVerificationToLandlordAddress = (
  verification: LOBVerificationResponse
): LobAddressFields => {
  return {
    primary_line: verification.primary_line,
    secondary_line: verification.secondary_line,
    city: verification.components.city,
    state: verification.components.state,
    urbanization: verification.urbanization,
    zip_code: verification.components.zip_code,
    no_unit: !verification.secondary_line,
  };
};

export const verifyAddress = async (
  landlordDetails: FormFields["landlord_details"]
): Promise<{
  verifiedAddress: LobAddressFields;
  deliverability: Deliverability;
}> => {
  // TODO: try/catch
  const verification = await Tenants2ApiFetcherVerifyAddress(
    "/gceletter/verify_address",
    { arg: landlordDetails }
  );

  const verifiedAddress = LobVerificationToLandlordAddress(verification);

  const deliverability: Deliverability =
    verification.deliverability === "undeliverable" &&
    verification.valid_address === false
      ? "undeliverable"
      : verification.deliverability === "deliverable_missing_unit"
      ? "missing_unit"
      : verification.deliverability === "deliverable_incorrect_unit"
      ? "incorrect_unit"
      : verification.deliverability === "deliverable_unnecessary_unit"
      ? "unnecessary_unit"
      : "deliverable";

  return { verifiedAddress, deliverability };
};

function hasRequiredVerifyFields(
  fields: FormFields["landlord_details"]
): boolean {
  return (
    !!fields.primary_line &&
    (!!fields.zip_code || (!!fields.city && !!fields.state))
  );
}

function hasUsefulPartialAddress(
  wowContact: LandlordContact | undefined
): boolean {
  return (
    !!wowContact?.address?.housenumber || !!wowContact?.address?.streetname
  );
}
