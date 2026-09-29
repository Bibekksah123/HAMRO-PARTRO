declare module "@remotemerge/nepali-date-converter" {
  export default class DateConverter {
    constructor(dateInput: string);
    toAd(): { year: number; month: number; date: number; day: string };
    toBs(): { year: number; month: number; date: number; day: string };
  }
}
