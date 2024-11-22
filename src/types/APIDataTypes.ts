import { Criteria, Determination } from "../hooks/eligibility";

type AcrisProperty = {
  bbl: string;
  doc_id: string;
  doc_date: string;
  unitsres: number;
};

export type AcrisDocument = {
  doc_id: string;
  doc_type: string;
  doc_date: string;
};

export type WowBuildings = {
  bbl: string;
  addr: string;
  distance_ft: number;
  match_name: boolean;
  match_bizaddr_unit: boolean;
  match_bizaddr_nounit: boolean;
  unitsres: number;
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
  acris_data: AcrisProperty[] | null;
  wow_data: WowBuildings[] | null;
};

export type GCEUser = {
  id: number;
};

export type Coverage = "COVERED" | "NOT_COVERED" | "UNKNOWN";

export type CriteriaDetermination = {
  [key in Criteria]?: Determination;
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
  form_bedrooms?: string;
  form_rent?: number;
  form_owner_occupied?: string;
  form_rent_stab?: string;
  form_subsidy?: string;
  result_coverage?: Coverage;
  result_criteria?: CriteriaDetermination;
};
