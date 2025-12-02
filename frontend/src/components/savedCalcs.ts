import type { Program } from "../lib/calc";

export const program: Program = {
  "inputs": [
    {
      name: "p1p2Count",
      description: "Number of P1/P2 incidents in the period",
      type: "integer",
      units: "incidents",
      default: 40
    },
    {
      name: "p1p2Duration",
      description: "Average duration of P1/P2 incidents",
      type: "float",
      units: "hours",
      step: 0.1,
      default: 2.5
    },
    {
      name: "p1p2Responders",
      description: "Average number of responders for P1/P2 incidents",
      type: "float",
      units: "people",
      default: 6
    },
    {
      name: "p345Count",
      description: "Number of P3-P5 incidents in the period",
      type: "integer",
      group: "P3-P5 Incidents",
      units: "incidents",
      default: 800,
    },
    {
      name: "p345Duration",
      description: "Average duration of P3-P5 incidents",
      type: "float",
      group: "P3-P5 Incidents",
      units: "hours",
      default: 0.5,
    },
    {
      name: "p345Responders",
      description: "Average number of responders for P3-P5 incidents",
      type: "integer",
      group: "P3-P5 Incidents",
      units: "people",
      default: 2,
    },

    {
      name: "eimContract",
      description: "Annual EIM contract cost",
      type: "float",
      group: "Financials",
      units: "currency",
      default: 500000,
    },
    {
      name: "currentSpend",
      description: "Current annual tooling spend (baseline)",
      type: "float",
      group: "Financials",
      units: "currency",
      default: 150000,
    },
    {
      name: "pdCurrentSpend",
      description: "Current PagerDuty annual spend (baseline)",
      type: "float",
      group: "Financials",
      units: "currency",
      default: 150000,
    },

    {
      name: "hourlyRate",
      description: "Average fully loaded hourly rate",
      type: "float",
      group: "Financials",
      units: "currency",
      default: 60,
    },
    {
      name: "incidentDurationImprovement",
      description: "Estimated reduction in incident duration (0-1)",
      type: "float",
      group: "Impact Factors",
      units: "percent",
      default: 0.2,
    },
    {
      name: "revenueAtRisk",
      description: "Revenue at risk per hour of impact",
      type: "float",
      group: "Financials",
      units: "currency",
      default: 100000,
    },
    {
      name: "percentRevenueImpacting",
      description: "Percent of P1/P2 incidents that are revenue impacting (0-1)",
      type: "float",
      group: "Impact Factors",
      units: "percent",
      default: 1.0,
    },
    {
      name: "discountRate",
      description: "Discount rate used for NPV (0-1)",
      type: "float",
      group: "Financials",
      units: "percent",
      default: 0.08,
    },
    {
      name: "elaYears",
      description: "Contract term length",
      type: "integer",
      group: "Financials",
      units: "years",
      default: 3,
    },
    {
      name: "pdReduction",
      description: "Percent reduction from vendor ELA pricing (0-1)",
      type: "float",
      group: "Impact Factors",
      units: "percent",
      default: 0.2,
    },
    {
      name: "pirHours",
      description: "Post-incident review hours per incident",
      type: "float",
      group: "PIR",
      units: "hours",
      default: 3,
    },
    {
      name: "pirParticipants",
      description: "Number of participants involved in PIR",
      type: "integer",
      group: "PIR",
      units: "people",
      default: 5,
    },
    {
      name: "pirReduction",
      description: "Percent reduction in PIR effort with EIM (0-1)",
      type: "float",
      group: "PIR",
      units: "percent",
      default: 0.3,
    },

    {
      name: "p1Reduction",
      description: "Percent reduction in P1 incident count (0-1)",
      type: "float",
      group: "Reductions",
      units: "percent",
      default: 0.1,
    },
    {
      name: "p1p2ResponderReduction",
      description: "Percent reduction in responders on P1/P2 (0-1)",
      type: "float",
      group: "Reductions",
      units: "percent",
      default: 0.15,
    },
    {
      name: "p345ResponderReduction",
      description: "Percent reduction in responders on P3-P5 (0-1)",
      type: "float",
      group: "Reductions",
      units: "percent",
      default: 0.25,
    },
    {
      name: "alerts",
      description: "Number of actionable alerts per period",
      type: "integer",
      group: "AIOps",
      units: "count",
      default: 0,
    },
    {
      name: "alertReduction",
      description: "Percent reduction in alerts with AIOps (0-1)",
      type: "float",
      group: "AIOps",
      units: "percent",
      default: 0.3,
    },
    {
      name: "aiopsTimeSaved",
      description: "Average time saved per alert with AIOps",
      type: "integer",
      group: "AIOps",
      units: "minutes",
      default: 5,
    },
    {
      name: "aiopsDurationReduction",
      description: "Percent reduction in incident duration with AIOps (0-1)",
      type: "float",
      group: "AIOps",
      units: "percent",
      default: 0.2,
    },
    {
      name: "aiopsP345Reduction",
      description: "Percent reduction in P3-P5 volume with AIOps (0-1)",
      type: "float",
      group: "AIOps",
      units: "percent",
      default: 0.3,
    },
    {
      name: "automations",
      description: "Number of automations executed per period",
      type: "integer",
      group: "Automation",
      units: "count",
      default: 0,
    },
    {
      name: "avgTimeSaved",
      description: "Average time saved per automation",
      type: "float",
      group: "Automation",
      units: "hours",
      default: 0.5,
    },
    {
      name: "customerIncidents",
      description: "Number of customer-impacting incidents",
      type: "integer",
      group: "Customer & Comms",
      units: "incidents",
      default: 30,
    },
    {
      name: "statusSubscribers",
      description: "Number of subscribers to status updates",
      type: "integer",
      group: "Customer & Comms",
      units: "count",
      default: 0,
    },
    {
      name: "analyticsUsers",
      description: "Number of analytics users",
      type: "integer",
      group: "Analytics",
      units: "count",
      default: 0,
    },
    {
      name: "modeFull",
      description: "Use full-mode scenario (vs. PD-only spend)",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
    {
      name: "solEim",
      description: "Enable EIM solution assumptions",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
    {
      name: "solAiops",
      description: "Enable AIOps solution assumptions",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
    {
      name: "solAutomation",
      description: "Enable Automation solution assumptions",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
    {
      name: "solCsops",
      description: "Enable CSOps solution assumptions",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
    {
      name: "solStatus",
      description: "Enable Status Page solution assumptions",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
    {
      name: "solAnalytics",
      description: "Enable Analytics solution assumptions",
      type: "boolean",
      group: "Scenario",
      default: 1,
    },
  ],
  "steps": [
    { "let": "p1Count", "expr": ["Multiply", "p1p2Count", ["Subtract", 1, "p1Reduction"]] },

    { "let": "p345CountCurrent", "expr": "p345Count" },
    {
      "let": "p345CountPD",
      "expr": ["If",
        ["Equal", "solAiops", 1],
        ["Multiply", "p345Count", ["Subtract", 1, "aiopsP345Reduction"]],
        "p345Count"
      ]
    },

    {
      "let": "laborCostCurrent",
      "expr": ["Add",
        ["Multiply", "p1Count", "p1p2Duration", "p1p2Responders", "hourlyRate"],
        ["Multiply", "p345CountCurrent", "p345Duration", "p345Responders", "hourlyRate"]
      ]
    },

    { "let": "adjP1p2Responders", "expr": ["Multiply", "p1p2Responders", ["Subtract", 1, "p1p2ResponderReduction"]] },
    { "let": "adjP345Responders", "expr": ["Multiply", "p345Responders", ["Subtract", 1, "p345ResponderReduction"]] },
    { "let": "durationImprovement", "expr": ["Subtract", 1, "incidentDurationImprovement"] },
    { "let": "aiopsFactor", "expr": ["If", ["Equal", "solAiops", 1], ["Subtract", 1, "aiopsDurationReduction"], 1] },

    {
      "let": "laborCostPD",
      "expr": ["Add",
        ["Multiply", "p1Count", ["Multiply", "p1p2Duration", "durationImprovement", "aiopsFactor"], "adjP1p2Responders", "hourlyRate"],
        ["Multiply", "p345CountPD", ["Multiply", "p345Duration", "durationImprovement", "aiopsFactor"], "adjP345Responders", "hourlyRate"]
      ]
    },

    { "let": "laborCostCurrentAnnual", "expr": "laborCostCurrent" },
    { "let": "laborCostPDAnnual", "expr": "laborCostPD" },
    { "let": "laborSavingsAnnual", "expr": ["Subtract", "laborCostCurrentAnnual", "laborCostPDAnnual"] },

    {
      "let": "toolSavingsAnnual",
      "expr": ["If",
        ["Equal", "modeFull", 1],
        ["Subtract", "currentSpend", "eimContract"],
        0
      ]
    },

    {
      "let": "revenueBenefitAnnual",
      "expr": ["Multiply",
        "p1Count", "percentRevenueImpacting", "p1p2Duration", "incidentDurationImprovement", "revenueAtRisk"
      ]
    },

    {
      "let": "pirValueAnnual",
      "expr": ["If",
        ["Equal", "solEim", 1],
        ["Multiply", ["Multiply", "p1Count", "pirHours", "pirParticipants", "hourlyRate"], "pirReduction"],
        0
      ]
    },

    {
      "let": "eimValueAnnual",
      "expr": ["Add", "laborSavingsAnnual", "toolSavingsAnnual", "revenueBenefitAnnual", "pirValueAnnual"]
    },

    {
      "let": "aiopsValueAnnual",
      "expr": ["If",
        ["Equal", "solAiops", 1],
        ["Multiply", "alerts", "alertReduction", ["Divide", "aiopsTimeSaved", 60], "hourlyRate"],
        0
      ]
    },

    {
      "let": "automationValueAnnual",
      "expr": ["If",
        ["Equal", "solAutomation", 1],
        ["Multiply", "automations", "avgTimeSaved", "hourlyRate"],
        0
      ]
    },

    {
      "let": "csopsValueAnnual",
      "expr": ["If",
        ["Equal", "solCsops", 1],
        ["Multiply", "customerIncidents", 5000],
        0
      ]
    },

    {
      "let": "statusValueAnnual",
      "expr": ["If",
        ["Equal", "solStatus", 1],
        ["Multiply", "statusSubscribers", 10],
        0
      ]
    },

    {
      "let": "analyticsValueAnnual",
      "expr": ["If",
        ["Equal", "solAnalytics", 1],
        ["Multiply", "analyticsUsers", 10, "hourlyRate"],
        0
      ]
    },

    { "let": "rampFactor", "expr": 2.7 },

    { "let": "eimValue", "expr": ["Multiply", "eimValueAnnual", "rampFactor"] },
    { "let": "aiopsValue", "expr": ["Multiply", "aiopsValueAnnual", "rampFactor"] },
    { "let": "automationValue", "expr": ["Multiply", "automationValueAnnual", "rampFactor"] },
    { "let": "csopsValue", "expr": ["Multiply", "csopsValueAnnual", "rampFactor"] },
    { "let": "statusValue", "expr": ["Multiply", "statusValueAnnual", "rampFactor"] },
    { "let": "analyticsValue", "expr": ["Multiply", "analyticsValueAnnual", "rampFactor"] },

    {
      "let": "totalValue",
      "expr": ["Add", "eimValue", "aiopsValue", "automationValue", "csopsValue", "statusValue", "analyticsValue"]
    },

    { "let": "pdTotalCost", "expr": ["Multiply", "eimContract", "elaYears"] },

    {
      "let": "costOfDoingNothingAnnualBase",
      "expr": ["Add", "laborCostCurrentAnnual",
        ["If", ["Equal", "modeFull", 1], "currentSpend", "pdCurrentSpend"]
      ]
    },
    { "let": "costOfDoingNothing", "expr": ["Multiply", "costOfDoingNothingAnnualBase", "rampFactor"] },

    {
      "let": "roi",
      "expr": ["If",
        ["Greater", "pdTotalCost", 0],
        ["Multiply",
          ["Divide", ["Subtract", "totalValue", "pdTotalCost"], "pdTotalCost"],
          100
        ],
        0
      ]
    },

    {
      "let": "paybackMonths",
      "expr": ["If",
        ["Greater", "pdTotalCost", 0],
        ["Multiply",
          ["Divide", "pdTotalCost", ["Divide", "totalValue", "elaYears"]],
          12
        ],
        0
      ]
    },

    {
      "let": "npv",
      "expr": ["Divide", "totalValue", ["Power", ["Add", 1, "discountRate"], "elaYears"]]
    },
  ],
  "outputs": [
    {
      name: "eimValue",
      description: "EIM value (3-yr, ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: "eimValue",
    },
    {
      name: "aiopsValue",
      description: "AIOps value (3-yr, ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: "aiopsValue",
    },
    {
      name: "automationValue",
      description: "Automation value (3-yr, ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: "automationValue",
    },
    {
      name: "csopsValue",
      description: "CSOps value (3-yr, ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: "csopsValue",
    },
    {
      name: "statusValue",
      description: "Status value (3-yr, ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: "statusValue",
    },
    {
      name: "analyticsValue",
      description: "Analytics value (3-yr, ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: "analyticsValue",
    },
    {
      name: "pirValue3yr",
      description: "PIR value over 3 years (ramped)",
      group: "Solution Value",
      type: "float",
      units: "currency",
      value: ["Multiply", "pirValueAnnual", "rampFactor"],
    },

    {
      name: "totalValue",
      description: "Total solution value (3-yr, ramped)",
      group: "Financial Metrics",
      type: "float",
      units: "currency",
      value: "totalValue",
    },
    {
      name: "roi",
      description: "Return on Investment (percent)",
      group: "Financial Metrics",
      type: "float",
      units: "percent",
      value: "roi",
    },
    {
      name: "paybackMonths",
      description: "Payback period (months)",
      group: "Financial Metrics",
      type: "float",
      units: "months",
      value: "paybackMonths",
    },
    {
      name: "npv",
      description: "Net Present Value",
      group: "Financial Metrics",
      type: "float",
      units: "currency",
      value: "npv",
    },

    {
      name: "costOfDoingNothing",
      description: "Cost of doing nothing (3-yr)",
      group: "Costs",
      type: "float",
      units: "currency",
      value: "costOfDoingNothing",
    },
    {
      name: "pdTotalCost",
      description: "PD total contract cost",
      group: "Costs",
      type: "float",
      units: "currency",
      value: "pdTotalCost",
    },
  ],
}
