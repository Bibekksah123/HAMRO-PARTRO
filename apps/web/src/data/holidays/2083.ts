import type { BsDate, PublicHoliday } from "@merodin/types";

const date = (month: number, day: number): BsDate => ({
  year: 2083,
  month,
  day,
});

export const holidayNoticeSource = {
  label:
    "Ministry of Home Affairs, Government of Nepal — Government and Public Holidays in 2083",
  url: "https://moha.gov.np/en/post/government-and-public-holidays-in-2083",
  published: "2082-11-18",
} as const;

export const holidays2083 = [
  {
    id: "new-year",
    name: "Nepali New Year",
    date: date(1, 1),
    description: "The first day of the Nepali year 2083.",
    scope: "National public holiday",
  },
  {
    id: "buddha-jayanti-ubhauli",
    name: "International Labour Day, Buddha Jayanti & Ubhauli",
    date: date(1, 18),
    description:
      "The official notice combines these observances on one public holiday.",
    scope: "National public holiday",
  },
  {
    id: "republic-day",
    name: "Republic Day",
    date: date(2, 15),
    description: "A national day marking the establishment of the republic.",
    scope: "National public holiday",
  },
  {
    id: "raksha-bandhan",
    name: "Raksha Bandhan",
    date: date(5, 12),
    description: "A festival observed with a protective thread ceremony.",
    scope: "National public holiday",
  },
  {
    id: "gai-jatra",
    name: "Gai Jatra",
    date: date(5, 13),
    description:
      "A cultural festival honoring loved ones who have died during the year.",
    scope: "Kathmandu Valley and Newar community",
  },
  {
    id: "krishna-janmashtami-gaura",
    name: "Krishna Janmashtami & Gaura Parwa",
    date: date(5, 19),
    description:
      "Two observances listed together in the national holiday notice.",
    scope: "National public holiday",
  },
  {
    id: "teej",
    name: "Haritalika (Teej) Brata",
    date: date(5, 29),
    description: "A fasting and worship observance for women.",
    scope: "For women only",
  },
  {
    id: "constitution-day",
    name: "Constitution Day",
    date: date(6, 3),
    description: "Nepal's national Constitution Day.",
    scope: "National public holiday",
  },
  {
    id: "indra-jatra",
    name: "Indra Jatra",
    date: date(6, 9),
    description: "A major cultural festival observed in the Kathmandu Valley.",
    scope: "Kathmandu Valley",
  },
  {
    id: "jitiya",
    name: "Jitiya Parwa",
    date: date(6, 18),
    description:
      "A fasting observance listed for women celebrating Jitiya Parwa.",
    scope: "For women celebrating Jitiya Parwa",
  },
  {
    id: "ghatasthapana",
    name: "Ghatasthapana",
    date: date(6, 25),
    description:
      "The first day of Dashain observances in the 2083 holiday notice.",
    scope: "National public holiday",
  },
  {
    id: "dashain",
    name: "Dashain Holiday",
    date: date(6, 31),
    endDate: date(7, 6),
    description:
      "The Ministry notice lists a seven-day Dashain public holiday period.",
    scope: "National public holiday",
  },
  {
    id: "tihar",
    name: "Tihar Holiday",
    date: date(7, 22),
    endDate: date(7, 26),
    description:
      "The Ministry notice lists a five-day Tihar public holiday period.",
    scope: "National public holiday",
  },
  {
    id: "falgunand-jayanti",
    name: "Mahatma Falgunand Jayanti",
    date: date(7, 25),
    description: "A day of observance for the Kirat community.",
    scope: "Kirats",
  },
  {
    id: "chhath",
    name: "Chhath Parwa",
    date: date(7, 29),
    description:
      "A festival honoring the Sun, observed with offerings and ritual bathing.",
    scope: "National public holiday",
  },
  {
    id: "disability-day",
    name: "International Day of Persons with Disabilities",
    date: date(8, 17),
    description: "A holiday listed for people with disabilities.",
    scope: "People with disabilities",
  },
  {
    id: "udhouli-yomari",
    name: "Dhanya Purnima, Udhauli & Yomari Punhi",
    date: date(9, 9),
    description:
      "Three cultural observances listed on the same date in the notice.",
    scope: "National public holiday",
  },
  {
    id: "christmas",
    name: "Christmas Day",
    date: date(9, 10),
    description: "Christmas Day.",
    scope: "National public holiday",
  },
  {
    id: "tamu-lhosar",
    name: "Tamu Lhosar",
    date: date(9, 15),
    description: "The Gurung community's New Year celebration.",
    scope: "National public holiday",
  },
  {
    id: "prithvi-jayanti",
    name: "Prithvi Jayanti / National Unity Day",
    date: date(9, 27),
    description: "A national observance also known as National Unity Day.",
    scope: "National public holiday",
  },
  {
    id: "maghi",
    name: "Maghi Parwa / Maghe Sankranti",
    date: date(10, 1),
    description: "A winter festival marking the sun's northward journey.",
    scope: "National public holiday",
  },
  {
    id: "martyrs-day",
    name: "Martyrs' Day",
    date: date(10, 16),
    description: "A national day remembering Nepal's martyrs.",
    scope: "National public holiday",
  },
  {
    id: "sonam-lhosar",
    name: "Sonam Lhosar",
    date: date(10, 24),
    description: "The New Year festival celebrated by the Tamang community.",
    scope: "National public holiday",
  },
  {
    id: "basanta-panchami",
    name: "Basanta Panchami",
    date: date(10, 28),
    description: "A spring festival and day of worship for Saraswati.",
    scope: "Educational institutions",
  },
  {
    id: "democracy-day",
    name: "National Democracy Day",
    date: date(11, 7),
    description: "A national observance of Nepal's democracy movement.",
    scope: "National public holiday",
  },
  {
    id: "maha-shivaratri",
    name: "Maha Shivaratri",
    date: date(11, 22),
    description: "A Hindu festival dedicated to Shiva.",
    scope: "National public holiday",
  },
  {
    id: "womens-day",
    name: "International Women's Day",
    date: date(11, 24),
    description: "A holiday listed for women employees.",
    scope: "Women employees",
  },
  {
    id: "gyalpo-lhosar",
    name: "Gyalpo Lhosar",
    date: date(11, 25),
    description: "The Tibetan New Year celebration.",
    scope: "National public holiday",
  },
  {
    id: "fagu-purnima",
    name: "Fagu Purnima (Holi)",
    date: date(12, 7),
    description: "Holi, listed for the Himalayan and Hilly districts.",
    scope: "56 Himalayan and Hilly districts",
  },
  {
    id: "terai-holi",
    name: "Terai Holi",
    date: date(12, 8),
    description: "Holi, listed for the Terai districts on the following day.",
    scope: "21 Terai districts",
  },
  {
    id: "ghode-jatra",
    name: "Ghode Jatra",
    date: date(12, 23),
    description: "A traditional festival observed in the Kathmandu Valley.",
    scope: "Kathmandu Valley",
  },
  {
    id: "eid-al-fitr",
    name: "Eid al-Fitr",
    date: null,
    description: "The date will be announced by the authorities.",
    scope: "National public holiday — date to be announced",
  },
  {
    id: "eid-al-adha",
    name: "Eid al-Adha",
    date: null,
    description: "The date will be announced by the authorities.",
    scope: "National public holiday — date to be announced",
  },
  {
    id: "saruwa-pawani",
    name: "Saruwa Pawani",
    date: null,
    description: "The date will be announced by the authorities.",
    scope: "Jhapa, Morang, Sunsari, Siraha and Saptari — date to be announced",
  },
  {
    id: "bhoto-jatra",
    name: "Bhoto Jatra",
    date: null,
    description: "The date will be announced by the authorities.",
    scope: "Kathmandu Valley — date to be announced",
  },
  {
    id: "muhammad-jayanti",
    name: "Muhammad Jayanti",
    date: null,
    description: "The date will be announced by the authorities.",
    scope: "Muslim community — date to be announced",
  },
  {
    id: "guru-nanak-jayanti",
    name: "Guru Nanak Jayanti",
    date: null,
    description: "The date will be announced by the authorities.",
    scope: "Sikh community — date to be announced",
  },
] satisfies readonly PublicHoliday[];

export const datedHolidays2083 = holidays2083.filter(
  (holiday): holiday is PublicHoliday & { date: BsDate } =>
    holiday.date !== null,
);

export const holidayYears = [2083] as const;
