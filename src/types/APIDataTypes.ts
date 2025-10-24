// WOW API

import { FormFields } from "./LetterFormTypes";

export type AcrisDocument = {
  doc_id: string;
  doc_type: string;
  doc_date: string;
};

export type RelatedProperty = {
  bbl: string;
  address: string;
  unitsres: number;
  match_wow: boolean;
  match_ownername: boolean;
  match_multidoc: boolean;
  distance_ft: number;
  wow_match_name: boolean;
  wow_match_bizaddr_unit: boolean;
  party_name_match: boolean;
  acris_docs: AcrisDocument[];
};

export type BuildingData = {
  bbl: string;
  unitsres: number;
  wow_portfolio_units: number;
  wow_portfolio_bbls: number;
  bldgclass: string;
  yearbuilt: number;
  co_issued: string;
  co_bin: string;
  post_hstpa_rs_units: number;
  is_nycha: boolean;
  is_subsidized: boolean;
  subsidy_name: string;
  end_421a: string;
  end_j51: string;
  acris_docs: AcrisDocument[];
  related_properties: RelatedProperty[];
};

export type LandlordContact = {
  title: string;
  value: string;
  address: {
    zip: string;
    city: string;
    state: string;
    apartment: string;
    streetname: string;
    housenumber: string;
  };
};

export type LandlordData = {
  bbl: string;
  registrationenddate: string;
  allcontacts: LandlordContact[];
};

// Tenants2 API

export type GCEUser = {
  id: number;
};

export type CriterionResult =
  | "ELIGIBLE"
  | "INELIGIBLE"
  | "UNKNOWN"
  | "OTHER_PROTECTION";

export type CoverageResult =
  | "COVERED"
  | "NOT_COVERED"
  | "UNKNOWN"
  | "RENT_STABILIZED"
  | "NYCHA"
  | "SUBSIDIZED";

export type CriteriaResults = {
  rent?: CriterionResult;
  rent_stab?: CriterionResult;
  building_class?: CriterionResult;
  c_of_o?: CriterionResult;
  subsidy?: CriterionResult;
  portfolio_size?: CriterionResult;
  landlord?: CriterionResult;
};

export type FormAnswers = {
  bedrooms?: string;
  rent?: number;
  owner_occupied?: string;
  rent_stab?: string;
  subsidy?: string;
  portfolio_size?: string;
};

export type GCEPostData = {
  id?: number;
  bbl?: string;
  house_number?: string;
  street_name?: string;
  borough?: string;
  zipcode?: string;
  address_confirmed?: boolean;
  nycdb_results?: BuildingData;
  form_answers?: FormAnswers;
  result_coverage?: CoverageResult;
  result_criteria?: CriteriaResults;
  phone_number?: number;
  result_url?: string;
};

export type GCELetterPostData = Omit<
  FormFields,
  "user_details" | "landlord_details"
> & {
  user_details: Omit<FormFields["user_details"], "no_unit">;
  landlord_details: Omit<FormFields["landlord_details"], "no_unit">;
  html_content: string;
};

type LetterError = {
  error: boolean;
  message?: string;
};

export type GCELetterConfirmation = {
  errors: {
    landlord_email?: LetterError;
    user_email?: LetterError;
    letter_mail?: LetterError;
    textit_campaign?: LetterError;
  };
  data: {
    user_email?: string;
    landlord_email?: string;
    user_phone_number: string;
    letter_pdf: string;
    tracking_number?: string;
  };
};

export type LOBVerificationResponse = {
  id: string;
  recipient: string;
  primary_line: string;
  secondary_line: string;
  urbanization: string;
  last_line: string;
  deliverability: string;
  valid_address: boolean;
  components: {
    primary_number: string;
    street_predirection: string;
    street_name: string;
    street_suffix: string;
    street_postdirection: string;
    secondary_designator: string;
    secondary_number: string;
    pmb_designator: string;
    pmb_number: string;
    extra_secondary_designator: string;
    extra_secondary_number: string;
    city: string;
    state: string;
    zip_code: string;
    zip_code_plus_4: string;
    zip_code_type: string;
    delivery_point_barcode: string;
    address_type: string;
    record_type: string;
    default_building_address: boolean;
    county: string;
    county_fips: string;
    carrier_route: string;
    carrier_route_type: string;
    po_box_only_flag: string;
    latitude: number;
    longitude: number;
  };
  deliverability_analysis: {
    dpv_confirmation: string;
    dpv_cmra: string;
    dpv_vacant: string;
    dpv_active: string;
    dpv_inactive_reason: string;
    dpv_throwback: string;
    dpv_non_delivery_day_flag: string;
    dpv_non_delivery_day_values: string;
    dpv_no_secure_location: string;
    dpv_door_not_accessible: string;
    dpv_footnotes: string[];
    ews_match: boolean;
    lacs_indicator: string;
    lacs_return_code: string;
    suite_return_code: string;
  };
  lob_confidence_score: {
    score: number;
    level: string;
  };
  object: string;
};
