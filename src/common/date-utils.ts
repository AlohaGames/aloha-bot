import { DateTime } from "luxon";

export function getShortFrenchFormatDateNow(): string {
  const date = DateTime.local().toFormat("dd LLL yyyy");
  return date;
}
