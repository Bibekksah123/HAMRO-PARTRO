export type CalculatorInput = Record<string, string>;
export type CalculatorResult = { label: string; value: string }[];

function numberInput(input: CalculatorInput, key: string): number {
  const value = Number(input[key]);
  if (!Number.isFinite(value)) throw new RangeError(`Enter a valid ${key}.`);
  return value;
}

function positive(value: number, label: string, allowZero = false): void {
  if (allowZero ? value < 0 : value <= 0) {
    throw new RangeError(
      `${label} must be ${allowZero ? "zero or more" : "greater than zero"}.`,
    );
  }
}

function dateValue(value: string, label: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RangeError(`Enter a valid ${label}.`);
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month! - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`Enter a valid ${label}.`);
  }
  return date;
}

function money(value: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 2,
  }).format(value);
}

function parseList(input: string, label: string): number[] {
  const values = input.split(",").map((part) => Number(part.trim()));
  if (!input.trim() || values.some((value) => !Number.isFinite(value))) {
    throw new RangeError(`Enter comma-separated numbers for ${label}.`);
  }
  return values;
}

export function calculateAge(birthDate: string, asOfDate: string) {
  const birth = dateValue(birthDate, "date of birth");
  const asOf = dateValue(asOfDate, "calculation date");
  if (asOf < birth)
    throw new RangeError(
      "The calculation date must be on or after the date of birth.",
    );

  let years = asOf.getUTCFullYear() - birth.getUTCFullYear();
  let months = asOf.getUTCMonth() - birth.getUTCMonth();
  let days = asOf.getUTCDate() - birth.getUTCDate();
  if (days < 0) {
    months -= 1;
    const priorMonthLength = new Date(
      Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), 0),
    ).getUTCDate();
    days += priorMonthLength;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((asOf.getTime() - birth.getTime()) / 86_400_000);
  return { years, months, days, totalDays };
}

export function calculateEmi(
  principal: number,
  annualRate: number,
  months: number,
) {
  positive(principal, "Principal");
  positive(annualRate, "Annual interest rate", true);
  positive(months, "Duration");
  if (!Number.isInteger(months))
    throw new RangeError("Duration must be a whole number of months.");
  const monthlyRate = annualRate / 1200;
  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) /
        ((1 + monthlyRate) ** months - 1);
  return {
    monthlyPayment: payment,
    totalPayment: payment * months,
    totalInterest: payment * months - principal,
  };
}

export function calculateSimpleInterest(
  principal: number,
  annualRate: number,
  years: number,
) {
  positive(principal, "Principal", true);
  positive(annualRate, "Annual interest rate", true);
  positive(years, "Time", true);
  const interest = (principal * annualRate * years) / 100;
  return { interest, total: principal + interest };
}

export function calculateCompoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  periodsPerYear: number,
) {
  positive(principal, "Principal", true);
  positive(annualRate, "Annual interest rate", true);
  positive(years, "Time", true);
  positive(periodsPerYear, "Compounding frequency");
  const total =
    principal *
    (1 + annualRate / (100 * periodsPerYear)) ** (periodsPerYear * years);
  return { interest: total - principal, total };
}

export function calculatePercentage(part: number, total: number) {
  positive(part, "Part", true);
  positive(total, "Total");
  return (part / total) * 100;
}

export function calculateWeightedGpa(points: number[], credits: number[]) {
  if (!points.length || points.length !== credits.length) {
    throw new RangeError(
      "Enter the same number of grade points and credit hours.",
    );
  }
  if (points.some((point) => point < 0 || point > 4)) {
    throw new RangeError("Grade points must be between 0 and 4.");
  }
  if (credits.some((credit) => credit <= 0)) {
    throw new RangeError("Every credit value must be greater than zero.");
  }
  const totalCredits = credits.reduce((sum, credit) => sum + credit, 0);
  return (
    points.reduce((sum, point, index) => sum + point * credits[index]!, 0) /
    totalCredits
  );
}

export function calculateSavings(
  initial: number,
  monthlyDeposit: number,
  annualRate: number,
  years: number,
) {
  positive(initial, "Starting balance", true);
  positive(monthlyDeposit, "Monthly deposit", true);
  positive(annualRate, "Annual return", true);
  positive(years, "Saving period");
  const months = Math.round(years * 12);
  if (months < 1)
    throw new RangeError("Saving period must be at least one month.");
  const monthlyRate = annualRate / 1200;
  const growth = (1 + monthlyRate) ** months;
  const total =
    monthlyRate === 0
      ? initial + monthlyDeposit * months
      : initial * growth + monthlyDeposit * ((growth - 1) / monthlyRate);
  return {
    total,
    contributions: initial + monthlyDeposit * months,
    interest: total - initial - monthlyDeposit * months,
    months,
  };
}

export function calculateSalary(
  gross: number,
  deductions: number,
  withholdingPercent: number,
) {
  positive(gross, "Gross salary", true);
  positive(deductions, "Deductions", true);
  if (withholdingPercent < 0 || withholdingPercent > 100)
    throw new RangeError("Withholding must be between 0 and 100%.");
  if (deductions > gross)
    throw new RangeError("Other deductions cannot exceed gross salary.");
  const withholding = (gross * withholdingPercent) / 100;
  return {
    net: gross - deductions - withholding,
    withholding,
    annualNet: (gross - deductions - withholding) * 12,
  };
}

export function calculateDateDifference(startDate: string, endDate: string) {
  const start = dateValue(startDate, "start date");
  const end = dateValue(endDate, "end date");
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

const unitFactors: Record<string, { category: string; factor: number }> = {
  mm: { category: "length", factor: 0.001 },
  cm: { category: "length", factor: 0.01 },
  m: { category: "length", factor: 1 },
  km: { category: "length", factor: 1000 },
  inch: { category: "length", factor: 0.0254 },
  foot: { category: "length", factor: 0.3048 },
  mile: { category: "length", factor: 1609.344 },
  g: { category: "weight", factor: 0.001 },
  kg: { category: "weight", factor: 1 },
  pound: { category: "weight", factor: 0.45359237 },
};

export function convertUnit(
  value: number,
  category: string,
  from: string,
  to: string,
) {
  if (!Number.isFinite(value)) throw new RangeError("Enter a valid value.");
  if (category === "temperature") {
    const toCelsius = (amount: number, unit: string) =>
      unit === "fahrenheit"
        ? ((amount - 32) * 5) / 9
        : unit === "kelvin"
          ? amount - 273.15
          : amount;
    const fromCelsius = (amount: number, unit: string) =>
      unit === "fahrenheit"
        ? (amount * 9) / 5 + 32
        : unit === "kelvin"
          ? amount + 273.15
          : amount;
    const units = ["celsius", "fahrenheit", "kelvin"];
    if (!units.includes(from) || !units.includes(to))
      throw new RangeError("Choose valid temperature units.");
    const converted = fromCelsius(toCelsius(value, from), to);
    if (to === "kelvin" && converted < 0)
      throw new RangeError("Temperature cannot be below absolute zero.");
    return converted;
  }
  const source = unitFactors[from];
  const target = unitFactors[to];
  if (
    !source ||
    !target ||
    source.category !== category ||
    target.category !== category
  ) {
    throw new RangeError("Choose units from the selected category.");
  }
  return (value * source.factor) / target.factor;
}

export function calculateForSlug(
  slug: string,
  input: CalculatorInput,
): CalculatorResult {
  switch (slug) {
    case "age": {
      const age = calculateAge(input.birthDate ?? "", input.asOfDate ?? "");
      return [
        {
          label: "Age",
          value: `${age.years} years, ${age.months} months, ${age.days} days`,
        },
        {
          label: "Total days lived",
          value: age.totalDays.toLocaleString("en-NP"),
        },
      ];
    }
    case "emi":
    case "loan": {
      const selectedMonths =
        slug === "loan"
          ? numberInput(input, "years") * 12
          : numberInput(input, "months");
      const months = Math.round(selectedMonths);
      if (Math.abs(selectedMonths - months) > 1e-8) {
        throw new RangeError(
          "Choose a loan duration that adds to a whole number of months.",
        );
      }
      const result = calculateEmi(
        numberInput(input, "principal"),
        numberInput(input, "annualRate"),
        months,
      );
      return [
        { label: "Monthly payment", value: money(result.monthlyPayment) },
        { label: "Total interest", value: money(result.totalInterest) },
        { label: "Total payment", value: money(result.totalPayment) },
      ];
    }
    case "simple-interest": {
      const result = calculateSimpleInterest(
        numberInput(input, "principal"),
        numberInput(input, "annualRate"),
        numberInput(input, "years"),
      );
      return [
        { label: "Interest earned", value: money(result.interest) },
        { label: "Final amount", value: money(result.total) },
      ];
    }
    case "compound-interest": {
      const result = calculateCompoundInterest(
        numberInput(input, "principal"),
        numberInput(input, "annualRate"),
        numberInput(input, "years"),
        numberInput(input, "frequency"),
      );
      return [
        { label: "Interest earned", value: money(result.interest) },
        { label: "Final amount", value: money(result.total) },
      ];
    }
    case "percentage":
      return [
        {
          label: "Percentage",
          value: `${calculatePercentage(numberInput(input, "part"), numberInput(input, "total")).toFixed(2)}%`,
        },
      ];
    case "gpa":
    case "cgpa": {
      const gpa = calculateWeightedGpa(
        parseList(input.points ?? "", "grade points"),
        parseList(input.credits ?? "", "credit hours"),
      );
      return [
        {
          label: slug === "gpa" ? "Weighted GPA" : "Cumulative GPA",
          value: gpa.toFixed(2),
        },
      ];
    }
    case "savings": {
      const result = calculateSavings(
        numberInput(input, "initial"),
        numberInput(input, "monthly"),
        numberInput(input, "annualRate"),
        numberInput(input, "years"),
      );
      return [
        { label: "Projected balance", value: money(result.total) },
        { label: "Your contributions", value: money(result.contributions) },
        { label: "Estimated growth", value: money(result.interest) },
      ];
    }
    case "salary": {
      const result = calculateSalary(
        numberInput(input, "gross"),
        numberInput(input, "deductions"),
        numberInput(input, "withholding"),
      );
      return [
        { label: "Estimated monthly take-home", value: money(result.net) },
        { label: "Estimated annual take-home", value: money(result.annualNet) },
      ];
    }
    case "date-difference": {
      const days = calculateDateDifference(
        input.startDate ?? "",
        input.endDate ?? "",
      );
      return [
        {
          label: "Elapsed time",
          value: `${Math.abs(days).toLocaleString("en-NP")} day${Math.abs(days) === 1 ? "" : "s"}${days < 0 ? " earlier" : ""}`,
        },
      ];
    }
    case "unit-converter": {
      const converted = convertUnit(
        numberInput(input, "value"),
        input.category ?? "",
        input.fromUnit ?? "",
        input.toUnit ?? "",
      );
      return [
        {
          label: "Converted value",
          value: `${converted.toLocaleString("en-NP", { maximumFractionDigits: 6 })} ${input.toUnit ?? ""}`,
        },
      ];
    }
    default:
      throw new RangeError("This calculator is not available.");
  }
}
