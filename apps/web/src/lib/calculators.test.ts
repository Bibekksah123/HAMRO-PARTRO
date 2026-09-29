import { describe, expect, it } from "bun:test";
import {
  calculateAge,
  calculateCompoundInterest,
  calculateDateDifference,
  calculateEmi,
  calculatePercentage,
  calculateSalary,
  calculateSimpleInterest,
  calculateWeightedGpa,
  convertUnit,
} from "./calculators";

describe("calculator functions", () => {
  it("calculates age in calendar years, months, and days", () => {
    expect(calculateAge("2000-01-15", "2026-09-27")).toEqual({
      years: 26,
      months: 8,
      days: 12,
      totalDays: 9752,
    });
  });

  it("handles a zero-rate EMI and calculates fixed-rate interest", () => {
    expect(calculateEmi(1200, 0, 12)).toEqual({
      monthlyPayment: 100,
      totalPayment: 1200,
      totalInterest: 0,
    });
    expect(calculateEmi(1000000, 10, 60).monthlyPayment).toBeCloseTo(
      21247.04,
      2,
    );
    expect(() => calculateEmi(1000, 5, 0)).toThrow();
  });

  it("calculates simple and compound interest", () => {
    expect(calculateSimpleInterest(50000, 8, 2)).toEqual({
      interest: 8000,
      total: 58000,
    });
    expect(calculateCompoundInterest(100000, 8, 5, 12).total).toBeCloseTo(
      148985,
      0,
    );
  });

  it("calculates a percentage and rejects a zero denominator", () => {
    expect(calculatePercentage(45, 60)).toBe(75);
    expect(() => calculatePercentage(1, 0)).toThrow();
  });

  it("calculates credit-weighted GPA and validates paired courses", () => {
    expect(calculateWeightedGpa([3.5, 3], [4, 3])).toBeCloseTo(3.2857, 4);
    expect(() => calculateWeightedGpa([3.5], [3, 4])).toThrow();
    expect(() => calculateWeightedGpa([4.5], [3])).toThrow();
  });

  it("estimates take-home pay and rejects deductions over gross salary", () => {
    expect(calculateSalary(80000, 5000, 10)).toEqual({
      net: 67000,
      withholding: 8000,
      annualNet: 804000,
    });
    expect(() => calculateSalary(1000, 1001, 0)).toThrow();
  });

  it("counts Gregorian days across a leap day", () => {
    expect(calculateDateDifference("2024-02-28", "2024-03-01")).toBe(2);
    expect(() => calculateDateDifference("2024-02-30", "2024-03-01")).toThrow();
  });

  it("converts common units and temperature", () => {
    expect(convertUnit(1, "length", "km", "m")).toBe(1000);
    expect(convertUnit(0, "temperature", "celsius", "fahrenheit")).toBe(32);
    expect(convertUnit(0, "temperature", "celsius", "kelvin")).toBeCloseTo(
      273.15,
    );
    expect(() => convertUnit(1, "length", "kg", "m")).toThrow();
  });
});
