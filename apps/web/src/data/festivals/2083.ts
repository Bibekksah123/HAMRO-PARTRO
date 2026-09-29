import type { Festival } from "@merodin/types";
import { holidays2083 } from "../holidays/2083";

const official = (id: string) =>
  holidays2083.find((holiday) => holiday.id === id);

export const festivals2083 = [
  {
    id: "nepali-new-year-2083",
    slug: "nepali-new-year",
    name: "Nepali New Year",
    nameNepali: "नेपाली नयाँ वर्ष",
    date: official("new-year")!.date!,
    year: 2083,
    description:
      "The Nepali calendar year 2083 begins on Baisakh 1. The Ministry of Home Affairs lists this as a national public holiday.",
    category: "National",
    isHoliday: true,
  },
  {
    id: "buddha-jayanti-2083",
    slug: "buddha-jayanti",
    name: "Buddha Jayanti",
    nameNepali: "बुद्ध जयन्ती",
    date: official("buddha-jayanti-ubhauli")!.date!,
    year: 2083,
    description:
      "Buddha Jayanti is observed on the same date as International Labour Day and Ubhauli in the 2083 holiday notice.",
    category: "Buddhist",
    isHoliday: true,
    scope: "National public holiday",
  },
  {
    id: "teej-2083",
    slug: "teej",
    name: "Haritalika Teej",
    nameNepali: "हरितालिका तीज",
    date: official("teej")!.date!,
    year: 2083,
    description:
      "A Hindu fasting and worship observance for women. The 2083 Ministry notice lists the day for women celebrating Teej.",
    category: "Hindu",
    isHoliday: true,
    scope: "For women only",
  },
  {
    id: "indra-jatra-2083",
    slug: "indra-jatra",
    name: "Indra Jatra",
    nameNepali: "इन्द्र जात्रा",
    date: official("indra-jatra")!.date!,
    year: 2083,
    description:
      "A major Newar festival in the Kathmandu Valley. The 2083 notice lists a valley-only holiday.",
    category: "Cultural",
    isHoliday: true,
    scope: "Kathmandu Valley",
  },
  {
    id: "jitiya-2083",
    slug: "jitiya",
    name: "Jitiya Parwa",
    nameNepali: "जितिया पर्व",
    date: official("jitiya")!.date!,
    year: 2083,
    description:
      "A fasting observance listed in the 2083 Ministry notice for women celebrating Jitiya.",
    category: "Cultural",
    isHoliday: true,
    scope: "For women celebrating Jitiya Parwa",
  },
  {
    id: "ghatasthapana-2083",
    slug: "ghatasthapana",
    name: "Ghatasthapana",
    nameNepali: "घटस्थापना",
    date: official("ghatasthapana")!.date!,
    year: 2083,
    description:
      "The first day of Dashain observances, listed as a national public holiday in 2083.",
    category: "Hindu",
    isHoliday: true,
    scope: "National public holiday",
  },
  {
    id: "dashain-2083",
    slug: "dashain",
    name: "Dashain",
    nameNepali: "दशैं",
    date: official("dashain")!.date!,
    endDate: official("dashain")!.endDate,
    year: 2083,
    duration: 7,
    description:
      "One of Nepal's major Hindu festivals, celebrated with family gatherings, tika, jamara and blessings. The 2083 Ministry notice lists a seven-day public holiday period.",
    category: "Hindu",
    isHoliday: true,
    scope: "National public holiday",
  },
  {
    id: "tihar-2083",
    slug: "tihar",
    name: "Tihar",
    nameNepali: "तिहार",
    date: official("tihar")!.date!,
    endDate: official("tihar")!.endDate,
    year: 2083,
    duration: 5,
    description:
      "A five-day festival of lights with traditions honoring crows, dogs, cows, Lakshmi and siblings. The 2083 Ministry notice lists five public holiday days.",
    category: "Hindu",
    isHoliday: true,
    scope: "National public holiday",
  },
  {
    id: "chhath-2083",
    slug: "chhath",
    name: "Chhath Parwa",
    nameNepali: "छठ पर्व",
    date: official("chhath")!.date!,
    year: 2083,
    description:
      "A festival honoring the Sun, observed with offerings and ritual bathing. The Ministry lists this as a national public holiday.",
    category: "Cultural",
    isHoliday: true,
  },
  {
    id: "maghi-2083",
    slug: "maghe-sankranti",
    name: "Maghi Parwa / Maghe Sankranti",
    nameNepali: "माघी / माघे सङ्क्रान्ति",
    date: official("maghi")!.date!,
    year: 2083,
    description:
      "A winter festival observed across communities in Nepal. The Ministry lists the date as a national public holiday.",
    category: "Cultural",
    isHoliday: true,
  },
  {
    id: "tamu-lhosar-2083",
    slug: "tamu-lhosar",
    name: "Tamu Lhosar",
    nameNepali: "तमु ल्होसार",
    date: official("tamu-lhosar")!.date!,
    year: 2083,
    description:
      "The Gurung community's New Year celebration, listed as a national public holiday in the 2083 notice.",
    category: "Cultural",
    isHoliday: true,
  },
  {
    id: "sonam-lhosar-2083",
    slug: "sonam-lhosar",
    name: "Sonam Lhosar",
    nameNepali: "सोनाम ल्होसार",
    date: official("sonam-lhosar")!.date!,
    year: 2083,
    description:
      "The Tamang community's New Year celebration, listed as a national public holiday in the 2083 notice.",
    category: "Cultural",
    isHoliday: true,
  },
  {
    id: "gyalpo-lhosar-2083",
    slug: "gyalpo-lhosar",
    name: "Gyalpo Lhosar",
    nameNepali: "ग्याल्पो ल्होसार",
    date: official("gyalpo-lhosar")!.date!,
    year: 2083,
    description:
      "The Tibetan New Year celebration, listed as a national public holiday in the 2083 notice.",
    category: "Buddhist",
    isHoliday: true,
  },
  {
    id: "holi-2083",
    slug: "holi",
    name: "Holi",
    nameNepali: "होली / फागु पूर्णिमा",
    date: official("fagu-purnima")!.date!,
    endDate: official("terai-holi")!.date!,
    year: 2083,
    duration: 2,
    description:
      "Holi is observed on different dates by region in Nepal. The 2083 notice lists Fagu Purnima for 56 Himalayan and Hilly districts, followed by Terai Holi for 21 Terai districts.",
    category: "Cultural",
    isHoliday: true,
    scope: "Dates vary by region",
  },
] satisfies readonly Festival[];

export const festivalYears = [2083] as const;
