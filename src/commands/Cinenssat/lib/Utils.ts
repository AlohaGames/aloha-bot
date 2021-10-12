import { DateTime } from "luxon";
import { MessageSelectOptionData } from "discord.js";
import { getShortFrenchFormatDateNow } from "../../../common/date-utils";

export function getDateSelectOptions(): MessageSelectOptionData[] {
  const format = "dd LLL yyyy";
  const day = getShortFrenchFormatDateNow();

  // adding 15 days to select a date into a list
  const optionsArray = [];

  for (let index = 7; index > -8; index--) {
    const date = DateTime.local().plus({ days: index }).toFormat(format);
    // compare the date with today to input the day in the right position
    if (date !== day) {
      optionsArray.push({ label: date, value: date });
    } else {
      optionsArray.push({ label: day, description: "Aujourd'hui", value: day });
    }
  }

  return optionsArray;
}

export function getNoteSelectOptions(): MessageSelectOptionData[] {
  // adding 20 notes from 0 to 10, step 0.5 to note the movie
  const noteArray: MessageSelectOptionData[] = [];

  for (let note = 10; note >= 0; note = note - 0.5) {
    if (note === 0) {
      noteArray.push({
        label: note.toString(),
        description: "La Kévin",
        value: note.toString(),
      });
    } else {
      noteArray.push({ label: note.toString(), value: note.toString() });
    }
  }

  return noteArray;
}
