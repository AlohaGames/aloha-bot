import { DateTime } from "luxon";

export function getShortFrenchFormatDateNow(): string {
  return DateTime.local().toFormat("dd LLL yyyy");
}

export function getShortFrenchFormatDate(date: string): string {
  return DateTime.fromFormat(date, "D").toFormat("dd LLL yyyy");
}
