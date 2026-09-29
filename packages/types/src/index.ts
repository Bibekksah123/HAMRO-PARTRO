import type { BsDate } from "@merodin/date";

export type { AdDate, BsDate } from "@merodin/date";
export type UserId = string & { readonly __brand: "UserId" };

export type FestivalCategory =
  "Hindu" | "Buddhist" | "National" | "Cultural" | "Other";

export interface Festival {
  id: string;
  slug: string;
  name: string;
  nameNepali: string;
  date: BsDate;
  year: number;
  description: string;
  category: FestivalCategory;
  isHoliday: boolean;
  duration?: number;
  endDate?: BsDate;
  scope?: string;
}

export interface PublicHoliday {
  id: string;
  name: string;
  date: BsDate | null;
  endDate?: BsDate;
  description: string;
  scope: string;
}
