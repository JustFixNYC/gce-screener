type AcrisProperty = {
  bbl: string;
  doc_id: string;
  doc_date: string;
  unitsres: number;
};

export type BuildingEligibilityInfo = {
  bbl: string;
  unitsres: number;
  wow_portfolio_units: number;
  wow_portfolio_bbls: number;
  bldgclass: string;
  yearbuilt: number;
  latest_co: string;
  co_bin: string;
  post_hstpa_rs_units: number;
  is_nycha: boolean;
  is_subsidized: boolean;
  subsidy_name: string;
  end_421a: string;
  end_j51: string;
  acris_data: AcrisProperty[] | null;
};
