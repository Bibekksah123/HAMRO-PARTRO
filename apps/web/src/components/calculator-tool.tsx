"use client";

import { useEffect, useState } from "react";
import { addDaysToAdDate, todayInNepal } from "@merodin/date";
import type { CalculatorDefinition } from "@/data/calculators";
import { calculateForSlug, type CalculatorResult } from "@/lib/calculators";

const unitOptions: Record<string, { value: string; label: string }[]> = {
  length: [
    { value: "mm", label: "Millimetre (mm)" },
    { value: "cm", label: "Centimetre (cm)" },
    { value: "m", label: "Metre (m)" },
    { value: "km", label: "Kilometre (km)" },
    { value: "inch", label: "Inch (in)" },
    { value: "foot", label: "Foot (ft)" },
    { value: "mile", label: "Mile (mi)" },
  ],
  weight: [
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "pound", label: "Pound (lb)" },
  ],
  temperature: [
    { value: "celsius", label: "Celsius (°C)" },
    { value: "fahrenheit", label: "Fahrenheit (°F)" },
    { value: "kelvin", label: "Kelvin (K)" },
  ],
};

export function CalculatorTool({
  calculator,
}: {
  calculator: CalculatorDefinition;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      calculator.fields.map((field) => [field.name, field.defaultValue]),
    ),
  );
  const [result, setResult] = useState<CalculatorResult>();
  const [error, setError] = useState("");

  useEffect(() => {
    const asIsoDate = (date: { year: number; month: number; day: number }) =>
      `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    const today = todayInNepal();
    if (calculator.slug === "age") {
      setValues((current) => ({ ...current, asOfDate: asIsoDate(today) }));
    } else if (calculator.slug === "date-difference") {
      setValues((current) => ({
        ...current,
        startDate: asIsoDate(today),
        endDate: asIsoDate(addDaysToAdDate(today, 7)),
      }));
    }
  }, [calculator.slug]);

  function updateValue(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setResult(undefined);
    setError("");
  }

  function updateCategory(category: string) {
    const options = unitOptions[category] ?? [];
    setValues((current) => ({
      ...current,
      category,
      fromUnit: options[0]?.value ?? "",
      toUnit: options[1]?.value ?? options[0]?.value ?? "",
    }));
    setResult(undefined);
    setError("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setResult(calculateForSlug(calculator.slug, values));
      setError("");
    } catch (cause) {
      setResult(undefined);
      setError(
        cause instanceof Error
          ? cause.message
          : "Check your inputs and try again.",
      );
    }
  }

  const units = unitOptions[values.category ?? "length"] ?? [];

  return (
    <section
      aria-labelledby="calculator-form-title"
      className="calculator-tool"
    >
      <div className="calculator-tool-intro">
        <p className="section-kicker">Free calculator</p>
        <h2 id="calculator-form-title">
          Try the {calculator.name.toLowerCase()}
        </h2>
        <p>{calculator.description}</p>
      </div>
      <form className="calculator-form" onSubmit={submit}>
        <div className="calculator-fields">
          {calculator.fields.map((field) => {
            const options =
              field.name === "fromUnit" || field.name === "toUnit"
                ? units
                : field.options;
            return (
              <label className="calculator-field" key={field.name}>
                <span>{field.label}</span>
                {field.type === "select" ? (
                  <select
                    onChange={(event) =>
                      field.name === "category"
                        ? updateCategory(event.target.value)
                        : updateValue(field.name, event.target.value)
                    }
                    value={values[field.name]}
                  >
                    {options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    max={field.max}
                    min={field.min}
                    onChange={(event) =>
                      updateValue(field.name, event.target.value)
                    }
                    placeholder={
                      field.type === "text" ? "e.g. 3.5, 3.0" : undefined
                    }
                    step={field.step}
                    type={field.type}
                    value={values[field.name]}
                  />
                )}
                {field.help && <small>{field.help}</small>}
              </label>
            );
          })}
        </div>
        <button className="convert-button calculator-submit" type="submit">
          Calculate <span aria-hidden="true">→</span>
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div aria-live="polite" className="calculator-result">
          {result.map((line, index) => (
            <div
              className={index === 0 ? "calculator-result-primary" : ""}
              key={line.label}
            >
              <span>{line.label}</span>
              <strong>{line.value}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
