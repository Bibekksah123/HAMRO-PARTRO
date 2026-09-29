export type CalculatorField = {
  name: string;
  label: string;
  type: "number" | "date" | "text" | "select";
  defaultValue: string;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  options?: { value: string; label: string }[];
};

export type CalculatorDefinition = {
  slug: string;
  name: string;
  description: string;
  explanation: string;
  formula: string;
  example: string;
  fields: CalculatorField[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

const numeric = (
  name: string,
  label: string,
  defaultValue: string,
  options: Pick<CalculatorField, "min" | "max" | "step" | "help"> = {},
): CalculatorField => ({
  name,
  label,
  type: "number",
  defaultValue,
  ...options,
});

const definitions: CalculatorDefinition[] = [
  {
    slug: "age",
    name: "Age Calculator",
    description: "Find your exact age in years, months, and days.",
    explanation:
      "Enter a date of birth and an optional date to calculate against. The result uses calendar years and months, including leap years.",
    formula:
      "Completed calendar years, then remaining calendar months and days.",
    example: "Someone born on 2000-01-15 is 25 years old on 2025-01-15.",
    fields: [
      {
        name: "birthDate",
        label: "Date of birth",
        type: "date",
        defaultValue: "2000-01-15",
      },
      {
        name: "asOfDate",
        label: "Calculate age on",
        type: "date",
        defaultValue: "2026-09-28",
      },
    ],
    faqs: [
      {
        question: "Does this account for leap years?",
        answer:
          "Yes. Calendar date arithmetic is used, so leap days are included in the elapsed age.",
      },
      {
        question: "Can I calculate age on another date?",
        answer:
          "Yes. Change the “Calculate age on” date to any valid date on or after the date of birth.",
      },
    ],
    related: ["date-difference", "percentage", "gpa"],
  },
  {
    slug: "emi",
    name: "EMI Calculator",
    description: "Estimate a fixed monthly loan payment and total interest.",
    explanation:
      "Enter the loan principal, annual interest rate, and number of monthly payments. The estimate assumes a fixed rate and equal monthly instalments.",
    formula:
      "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where r is the monthly rate and n is the number of months.",
    example:
      "A रु 1,000,000 loan at 10% a year for 60 months has an estimated EMI of about रु 21,247.",
    fields: [
      numeric("principal", "Loan amount (रु)", "1000000", {
        min: 1,
        step: 1000,
      }),
      numeric("annualRate", "Annual interest rate (%)", "10", {
        min: 0,
        step: 0.01,
      }),
      numeric("months", "Loan duration (months)", "60", { min: 1, step: 1 }),
    ],
    faqs: [
      {
        question: "What does EMI mean?",
        answer:
          "EMI means equated monthly instalment: the fixed payment that covers interest and principal over the selected term.",
      },
      {
        question: "Are fees included?",
        answer:
          "No. Processing fees, insurance, variable rates, and lender-specific rounding can change the actual payment.",
      },
    ],
    related: ["loan", "simple-interest", "compound-interest"],
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    description:
      "Compare a monthly payment with the total cost of a fixed-rate loan.",
    explanation:
      "This calculator uses the standard amortizing loan formula. It is useful for comparing principal, interest rate, and loan term before speaking with a lender.",
    formula:
      "Monthly payment uses P × r × (1 + r)^n ÷ ((1 + r)^n − 1). Total interest = payment × n − P.",
    example:
      "For रु 2,500,000 at 9% annual interest over 15 years, compare the monthly payment and total interest before fees.",
    fields: [
      numeric("principal", "Loan amount (रु)", "2500000", {
        min: 1,
        step: 1000,
      }),
      numeric("annualRate", "Annual interest rate (%)", "9", {
        min: 0,
        step: 0.01,
      }),
      numeric("years", "Loan duration (years)", "15", {
        min: 0.25,
        step: 0.25,
      }),
    ],
    faqs: [
      {
        question: "Is this an amortization schedule?",
        answer:
          "It summarizes the monthly payment and total cost. It does not include a month-by-month schedule or lender fees.",
      },
      {
        question: "Can the rate be zero?",
        answer:
          "Yes. With a 0% rate, the principal is divided evenly across the monthly payments.",
      },
    ],
    related: ["emi", "simple-interest", "savings"],
  },
  {
    slug: "simple-interest",
    name: "Simple Interest Calculator",
    description:
      "Calculate interest and final value using a simple annual rate.",
    explanation:
      "Simple interest is calculated only on the original principal. Enter the principal, annual rate, and time in years.",
    formula: "Interest = P × R × T ÷ 100; final amount = P + interest.",
    example:
      "रु 50,000 at 8% simple interest for 2 years earns रु 8,000 in interest.",
    fields: [
      numeric("principal", "Principal (रु)", "50000", { min: 0, step: 100 }),
      numeric("annualRate", "Annual interest rate (%)", "8", {
        min: 0,
        step: 0.01,
      }),
      numeric("years", "Time (years)", "2", { min: 0, step: 0.1 }),
    ],
    faqs: [
      {
        question: "How is simple interest different from compound interest?",
        answer:
          "Simple interest is charged on the original principal only. Compound interest also earns interest on earlier interest.",
      },
      {
        question: "Can I enter a fraction of a year?",
        answer: "Yes. For example, enter 0.5 for six months.",
      },
    ],
    related: ["compound-interest", "emi", "savings"],
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    description:
      "Estimate how an investment grows when interest is reinvested.",
    explanation:
      "Choose how often interest is compounded. This estimate assumes no extra deposits or withdrawals during the selected period.",
    formula:
      "A = P × (1 + R ÷ (100 × m))^(m × t), where m is the compounding frequency per year.",
    example:
      "रु 100,000 at 8% annual interest compounded monthly grows to about रु 148,985 after 5 years.",
    fields: [
      numeric("principal", "Starting amount (रु)", "100000", {
        min: 0,
        step: 100,
      }),
      numeric("annualRate", "Annual interest rate (%)", "8", {
        min: 0,
        step: 0.01,
      }),
      numeric("years", "Time (years)", "5", { min: 0, step: 0.1 }),
      {
        name: "frequency",
        label: "Compounding",
        type: "select",
        defaultValue: "12",
        options: [
          { value: "1", label: "Yearly" },
          { value: "2", label: "Half-yearly" },
          { value: "4", label: "Quarterly" },
          { value: "12", label: "Monthly" },
          { value: "365", label: "Daily" },
        ],
      },
    ],
    faqs: [
      {
        question: "What does compounding frequency mean?",
        answer:
          "It is how often earned interest is added to the balance and can itself earn interest.",
      },
      {
        question: "Does this include tax or inflation?",
        answer:
          "No. This is a nominal mathematical estimate before taxes, fees, and inflation.",
      },
    ],
    related: ["simple-interest", "savings", "emi"],
  },
  {
    slug: "percentage",
    name: "Percentage Calculator",
    description: "Find a percentage of a number or compare two values.",
    explanation:
      "Enter the part and the total to find what percentage the part represents. The total must be greater than zero.",
    formula: "Percentage = part ÷ total × 100.",
    example: "45 out of 60 is 75%.",
    fields: [
      numeric("part", "Part or marks obtained", "45", { min: 0, step: 0.01 }),
      numeric("total", "Total or full marks", "60", { min: 0.01, step: 0.01 }),
    ],
    faqs: [
      {
        question: "How do I find a percentage increase?",
        answer:
          "Subtract the old value from the new value, divide by the old value, then multiply by 100.",
      },
      {
        question: "Can a percentage be over 100?",
        answer:
          "Yes. If the part is larger than the total, the calculated percentage will be over 100%.",
      },
    ],
    related: ["gpa", "cgpa", "salary"],
  },
  {
    slug: "gpa",
    name: "GPA Calculator",
    description: "Calculate a credit-weighted GPA on a 4-point scale.",
    explanation:
      "Enter grade points and credit hours as comma-separated lists in the same order. This calculator uses a weighted average and the common 0–4 range; use your institution's grade point values.",
    formula: "GPA = sum(grade point × credit hours) ÷ sum(credit hours).",
    example:
      "Grade points 3.5, 3.0 with credits 4, 3 produce a weighted GPA of about 3.29.",
    fields: [
      {
        name: "points",
        label: "Grade points (comma separated)",
        type: "text",
        defaultValue: "3.5, 3.0, 3.7",
        help: "Enter one point value for each course, from 0 to 4.",
      },
      {
        name: "credits",
        label: "Credit hours (same order)",
        type: "text",
        defaultValue: "4, 3, 3",
        help: "For example: 4, 3, 3",
      },
    ],
    faqs: [
      {
        question: "Is every institution's GPA scale the same?",
        answer:
          "No. The 4-point range is a common reference, but grade mappings and rounding rules vary by institution.",
      },
      {
        question: "Why are credit hours used?",
        answer:
          "Credit weighting gives longer or more substantial courses proportionally more influence on the GPA.",
      },
    ],
    related: ["cgpa", "percentage", "age"],
  },
  {
    slug: "cgpa",
    name: "CGPA Calculator",
    description: "Combine semester GPAs into a credit-weighted cumulative GPA.",
    explanation:
      "Enter semester GPAs and their credits in matching comma-separated lists. Each semester GPA must be between 0 and 4.",
    formula:
      "CGPA = sum(semester GPA × semester credits) ÷ sum(semester credits).",
    example:
      "Semester GPAs 3.2 and 3.6 with 15 credits each give a CGPA of 3.40.",
    fields: [
      {
        name: "points",
        label: "Semester GPA values",
        type: "text",
        defaultValue: "3.2, 3.6, 3.4",
        help: "Enter one GPA per semester, from 0 to 4.",
      },
      {
        name: "credits",
        label: "Semester credits (same order)",
        type: "text",
        defaultValue: "15, 15, 18",
        help: "Use the total credits that count toward your CGPA for each semester.",
      },
    ],
    faqs: [
      {
        question: "Should I average semester GPAs directly?",
        answer:
          "Only if every semester carries the same credits. This calculator weights each semester by its credit hours.",
      },
      {
        question: "Why can my official CGPA differ slightly?",
        answer:
          "Institutions may exclude some courses or use different grade conversions and rounding rules.",
      },
    ],
    related: ["gpa", "percentage", "age"],
  },
  {
    slug: "savings",
    name: "Savings Calculator",
    description:
      "Estimate savings growth from a starting balance and monthly deposits.",
    explanation:
      "This estimate assumes deposits are made at the end of each month and a fixed annual rate is compounded monthly.",
    formula:
      "Future value = initial balance × (1 + r)^n + monthly deposit × (((1 + r)^n − 1) ÷ r).",
    example:
      "Start with रु 20,000, add रु 5,000 per month, and compare the projected balance over a chosen term.",
    fields: [
      numeric("initial", "Starting balance (रु)", "20000", {
        min: 0,
        step: 100,
      }),
      numeric("monthly", "Monthly deposit (रु)", "5000", { min: 0, step: 100 }),
      numeric("annualRate", "Annual return (%)", "6", { min: 0, step: 0.01 }),
      numeric("years", "Saving period (years)", "5", { min: 0.1, step: 0.1 }),
    ],
    faqs: [
      {
        question: "When are monthly deposits assumed?",
        answer:
          "At the end of each month. Deposits at the start of each month would earn slightly more.",
      },
      {
        question: "Is this a guaranteed return?",
        answer:
          "No. The return is an input for illustration and actual savings rates and investment performance can change.",
      },
    ],
    related: ["compound-interest", "simple-interest", "salary"],
  },
  {
    slug: "salary",
    name: "Salary Calculator",
    description:
      "Estimate take-home pay after your own deductions and withholding rate.",
    explanation:
      "Enter monthly gross pay, other deductions, and an estimated tax withholding percentage. The result is a planning estimate; use your payroll statement for actual net pay.",
    formula:
      "Estimated monthly take-home = gross pay − other deductions − (gross pay × withholding rate ÷ 100).",
    example:
      "A gross monthly salary of रु 80,000 with रु 5,000 deductions and 10% withholding gives an estimated रु 67,000 take-home.",
    fields: [
      numeric("gross", "Gross monthly salary (रु)", "80000", {
        min: 0,
        step: 100,
      }),
      numeric("deductions", "Other monthly deductions (रु)", "5000", {
        min: 0,
        step: 100,
      }),
      numeric("withholding", "Estimated withholding (%)", "10", {
        min: 0,
        max: 100,
        step: 0.1,
        help: "Enter the rate from your payroll estimate; no tax rate is assumed.",
      }),
    ],
    faqs: [
      {
        question: "Does this calculate Nepal income tax?",
        answer:
          "No. Tax depends on current law and personal circumstances. Enter an estimated withholding rate from your payroll or adviser.",
      },
      {
        question: "What counts as other deductions?",
        answer:
          "You can include provident fund, insurance, or other recurring deductions in the amount you enter.",
      },
    ],
    related: ["percentage", "savings", "emi"],
  },
  {
    slug: "date-difference",
    name: "Date Difference Calculator",
    description:
      "Count the number of calendar days between two Gregorian dates.",
    explanation:
      "Choose a start and end date to count elapsed days. The result is signed, so an earlier end date is reported as a negative interval.",
    formula:
      "Difference in days = (end date − start date) ÷ 86,400,000 milliseconds.",
    example: "There are 7 elapsed days between 2026-09-27 and 2026-10-04.",
    fields: [
      {
        name: "startDate",
        label: "Start date",
        type: "date",
        defaultValue: "2026-09-28",
      },
      {
        name: "endDate",
        label: "End date",
        type: "date",
        defaultValue: "2026-10-05",
      },
    ],
    faqs: [
      {
        question: "Does the count include both dates?",
        answer:
          "It counts elapsed days between the dates. Add one if you need to count both endpoint dates inclusively.",
      },
      {
        question: "Does this account for leap years?",
        answer: "Yes. It uses Gregorian calendar dates, including leap days.",
      },
    ],
    related: ["age", "percentage", "emi"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert common length, weight, and temperature units.",
    explanation:
      "Choose a measurement category, enter a value, and select the units. Temperature uses its own conversion formula; length and weight use standard metric conversions.",
    formula:
      "Length and weight convert through a base metric unit. Fahrenheit = Celsius × 9/5 + 32.",
    example: "1 kilometre is 1,000 metres; 0 °C is 32 °F.",
    fields: [
      numeric("value", "Value", "1", { step: 0.01 }),
      {
        name: "category",
        label: "Category",
        type: "select",
        defaultValue: "length",
        options: [
          { value: "length", label: "Length" },
          { value: "weight", label: "Weight" },
          { value: "temperature", label: "Temperature" },
        ],
      },
      { name: "fromUnit", label: "From", type: "select", defaultValue: "km" },
      { name: "toUnit", label: "To", type: "select", defaultValue: "m" },
    ],
    faqs: [
      {
        question: "Which units are available?",
        answer:
          "Length includes mm, cm, m, km, inch, foot, and mile. Weight includes g, kg, and pound. Temperature includes °C, °F, and K.",
      },
      {
        question: "Are results rounded?",
        answer:
          "Results are shown to a practical number of decimal places. The underlying conversion uses standard unit factors.",
      },
    ],
    related: ["percentage", "date-difference", "salary"],
  },
];

export const calculators = definitions;
export const calculatorBySlug = Object.fromEntries(
  definitions.map((calculator) => [calculator.slug, calculator]),
) as Record<string, CalculatorDefinition>;
