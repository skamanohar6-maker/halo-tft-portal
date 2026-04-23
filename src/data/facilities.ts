import { FacilityTypeConfig } from "@/types";

export const FACILITY_TYPES: readonly FacilityTypeConfig[] = [
  {
    id: "term_loan",
    name: "Term Loan",
    facilities: [
      {
        id: "tl_f1",
        name: "Facility 1",
        fundName: "Fund A",
        tranches: [
          { id: "tl_f1_t1", name: "Tranche 1" },
          { id: "tl_f1_t2", name: "Tranche 2" },
        ],
      },
    ],
  },
  {
    id: "working_capital",
    name: "Working Capital",
    facilities: [
      {
        id: "wc_f1",
        name: "Facility 1",
        fundName: "Fund B",
        tranches: [
          { id: "wc_f1_t1", name: "Tranche 1" },
        ],
      },
    ],
  },
  {
    id: "equity_investment",
    name: "Equity Investment",
    facilities: [
      {
        id: "ei_f1",
        name: "Facility 1",
        fundName: "Fund C",
        tranches: [
          { id: "ei_f1_t1", name: "Tranche 1" },
        ],
      },
    ],
  },
];
