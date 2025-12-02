import type { StoredExpression } from "../lib/expression";

export type SavedCalcExpression = {
  name: string;
  description: string;
  expression: StoredExpression;
};

const expr = (source: string): StoredExpression => ({
  version: 1,
  source,
});

export const savedCalcsExpressions: SavedCalcExpression[] = [
  {
    name: "p1Count",
    description: "P1/P2 incidents after reduction",
    expression: expr("{{p1p2Count}} * (1 - {{p1Reduction}})"),
  },
  {
    name: "p345CountCurrent",
    description: "Baseline P3-P5 incident volume",
    expression: expr("{{p345Count}}"),
  },
  {
    name: "p345CountPD",
    description: "P3-P5 volume under AIOps scenario",
    expression: expr("{{p345Count}} * (1 - {{solAiops}} * {{aiopsP345Reduction}})"),
  },
  {
    name: "laborCostCurrent",
    description: "Current annual incident labor cost",
    expression: expr(
      "{{p1Count}} * {{p1p2Duration}} * {{p1p2Responders}} * {{hourlyRate}} + {{p345CountCurrent}} * {{p345Duration}} * {{p345Responders}} * {{hourlyRate}}"
    ),
  },
  {
    name: "adjP1p2Responders",
    description: "Adjusted P1/P2 responders",
    expression: expr("{{p1p2Responders}} * (1 - {{p1p2ResponderReduction}})"),
  },
  {
    name: "adjP345Responders",
    description: "Adjusted P3-P5 responders",
    expression: expr("{{p345Responders}} * (1 - {{p345ResponderReduction}})"),
  },
  {
    name: "durationImprovement",
    description: "Remaining duration after improvements",
    expression: expr("1 - {{incidentDurationImprovement}}"),
  },
  {
    name: "aiopsFactor",
    description: "Additional duration factor from AIOps",
    expression: expr("1 - {{solAiops}} * {{aiopsDurationReduction}}"),
  },
  {
    name: "laborCostPD",
    description: "Projected labor cost with improvements",
    expression: expr(
      "{{p1Count}} * {{p1p2Duration}} * {{durationImprovement}} * {{aiopsFactor}} * {{adjP1p2Responders}} * {{hourlyRate}} + {{p345CountPD}} * {{p345Duration}} * {{durationImprovement}} * {{aiopsFactor}} * {{adjP345Responders}} * {{hourlyRate}}"
    ),
  },
  {
    name: "laborCostCurrentAnnual",
    description: "Alias for current labor cost",
    expression: expr("{{laborCostCurrent}}"),
  },
  {
    name: "laborCostPDAnnual",
    description: "Alias for PD labor cost",
    expression: expr("{{laborCostPD}}"),
  },
  {
    name: "laborSavingsAnnual",
    description: "Annual labor savings",
    expression: expr("{{laborCostCurrentAnnual}} - {{laborCostPDAnnual}}"),
  },
  {
    name: "toolSavingsAnnual",
    description: "Tooling savings when in full mode",
    expression: expr("{{modeFull}} * ({{currentSpend}} - {{eimContract}})"),
  },
  {
    name: "revenueBenefitAnnual",
    description: "Revenue benefit from faster resolution",
    expression: expr(
      "{{p1Count}} * {{percentRevenueImpacting}} * {{p1p2Duration}} * {{incidentDurationImprovement}} * {{revenueAtRisk}}"
    ),
  },
  {
    name: "pirValueAnnual",
    description: "PIR effort reduction value",
    expression: expr(
      "{{solEim}} * {{p1Count}} * {{pirHours}} * {{pirParticipants}} * {{hourlyRate}} * {{pirReduction}}"
    ),
  },
  {
    name: "eimValueAnnual",
    description: "Total annual EIM value",
    expression: expr(
      "{{laborSavingsAnnual}} + {{toolSavingsAnnual}} + {{revenueBenefitAnnual}} + {{pirValueAnnual}}"
    ),
  },
  {
    name: "aiopsValueAnnual",
    description: "Annual AIOps value",
    expression: expr(
      "{{solAiops}} * {{alerts}} * {{alertReduction}} * ({{aiopsTimeSaved}} / 60) * {{hourlyRate}}"
    ),
  },
  {
    name: "automationValueAnnual",
    description: "Annual automation value",
    expression: expr("{{solAutomation}} * {{automations}} * {{avgTimeSaved}} * {{hourlyRate}}"),
  },
  {
    name: "csopsValueAnnual",
    description: "Annual CSOps value",
    expression: expr("{{solCsops}} * {{customerIncidents}} * 5000"),
  },
  {
    name: "statusValueAnnual",
    description: "Annual Status Page value",
    expression: expr("{{solStatus}} * {{statusSubscribers}} * 10"),
  },
  {
    name: "analyticsValueAnnual",
    description: "Annual Analytics value",
    expression: expr("{{solAnalytics}} * {{analyticsUsers}} * 10 * {{hourlyRate}}"),
  },
  {
    name: "rampFactor",
    description: "Ramp multiplier (3-year)",
    expression: expr("2.7"),
  },
  {
    name: "eimValue",
    description: "Ramped EIM value",
    expression: expr("{{eimValueAnnual}} * {{rampFactor}}"),
  },
  {
    name: "aiopsValue",
    description: "Ramped AIOps value",
    expression: expr("{{aiopsValueAnnual}} * {{rampFactor}}"),
  },
  {
    name: "automationValue",
    description: "Ramped automation value",
    expression: expr("{{automationValueAnnual}} * {{rampFactor}}"),
  },
  {
    name: "csopsValue",
    description: "Ramped CSOps value",
    expression: expr("{{csopsValueAnnual}} * {{rampFactor}}"),
  },
  {
    name: "statusValue",
    description: "Ramped Status value",
    expression: expr("{{statusValueAnnual}} * {{rampFactor}}"),
  },
  {
    name: "analyticsValue",
    description: "Ramped Analytics value",
    expression: expr("{{analyticsValueAnnual}} * {{rampFactor}}"),
  },
  {
    name: "totalValue",
    description: "Total ramped value",
    expression: expr(
      "{{eimValue}} + {{aiopsValue}} + {{automationValue}} + {{csopsValue}} + {{statusValue}} + {{analyticsValue}}"
    ),
  },
  {
    name: "pdTotalCost",
    description: "Total contract cost",
    expression: expr("{{eimContract}} * {{elaYears}}"),
  },
  {
    name: "costOfDoingNothingAnnualBase",
    description: "Annual cost of status quo",
    expression: expr(
      "{{laborCostCurrentAnnual}} + ({{modeFull}} * {{currentSpend}} + (1 - {{modeFull}}) * {{pdCurrentSpend}})"
    ),
  },
  {
    name: "costOfDoingNothing",
    description: "Ramped cost of doing nothing",
    expression: expr("{{costOfDoingNothingAnnualBase}} * {{rampFactor}}"),
  },
  {
    name: "roi",
    description: "Return on investment (%)",
    expression: expr(
      "({{pdTotalCost}} > 0) * ((({{totalValue}} - {{pdTotalCost}}) / {{pdTotalCost}}) * 100)"
    ),
  },
  {
    name: "paybackMonths",
    description: "Payback period in months",
    expression: expr(
      "({{pdTotalCost}} > 0) * (({{pdTotalCost}} / ({{totalValue}} / {{elaYears}})) * 12)"
    ),
  },
  {
    name: "npv",
    description: "Net present value",
    expression: expr("{{totalValue}} / ((1 + {{discountRate}}) ^ {{elaYears}})"),
  },
];
