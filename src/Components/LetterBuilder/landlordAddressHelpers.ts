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
  if (!owner?.address?.housenumber || !owner.address.streetname) {
    return;
  }

  const wowLandlordDetails = wowContactToLandlordDetails(owner);

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
  // TODO: review LOC methodology more closely
  // https://github.com/JustFixNYC/tenants2/blob/master/loc/landlord_lookup.py
  if (data === undefined) return;

  return (
    data.allcontacts
      .filter((contact) =>
        ["HeadOfficer", "IndividualOwner", "JointOwner"].includes(contact.title)
      )
      // Sort by title in above order, just happens to be alpha order by default
      .sort((a, b) => a.title.localeCompare(b.title))?.[0]
  );
};

export const formatLandlordDetailsAddress = (
  ld: FormFields["landlord_details"]
): string => {
  return `${ld.primary_line}${
    ld.secondary_line ? " " + ld.secondary_line : ""
  }, ${ld.city}, ${ld.state} ${ld.zip_code}`;
};

const wowContactToLandlordDetails = (
  contact: LandlordContact
): FormFields["landlord_details"] => {
  const { address } = contact;
  return {
    // on load, there is an error from unexpected "null" without || ""
    name: contact.value || "",
    primary_line: `${address.housenumber} ${address.streetname}`,
    secondary_line: address.apartment || "",
    city: address.city || "",
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
