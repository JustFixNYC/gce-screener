// WOW API

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

export type ComingSoonSignupPostData = {
  phone_number?: string;
};

export type ComingSoonSignupResponse = {
  success: boolean;
};
