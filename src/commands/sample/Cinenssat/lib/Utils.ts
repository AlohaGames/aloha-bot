import {DateTime} from "luxon";
import {
    MessageSelectOptionData
} from "discord.js";

export function getDateSelectOptions(): MessageSelectOptionData[] {
  const format = 'dd LLL yyyy';

  const day = DateTime.now().toFormat(format);
  const jm1 = DateTime.local().plus({days: -1}).toFormat(format)
  const jm2 = DateTime.local().plus({days: -2}).toFormat(format)
  const jm3 = DateTime.local().plus({days: -3}).toFormat(format)
  const jm4 = DateTime.local().plus({days: -4}).toFormat(format)
  const jm5 = DateTime.local().plus({days: -5}).toFormat(format)
  const jm6 = DateTime.local().plus({days: -6}).toFormat(format)
  const jm7 = DateTime.local().plus({days: -7}).toFormat(format)
  return [
    {label: "Aujourd'hui", description: day, value: day},
    {label: 'Hier', description: jm1, value: jm1},
    {label: 'Avant-hier', description: jm2, value: jm2},
    {label: 'Il y a 3 jours', description: jm3, value: jm3},
    {label: 'Il y a 4 jours', description: jm4, value: jm4},
    {label: 'Il y a 5 jours', description: jm5, value: jm5},
    {label: 'Il y a 6 jours', description: jm6, value: jm6},
    {label: 'Il y a 1 semaine', description: jm7, value: jm7}
  ];
}

export function getNoteSelectOptions(): MessageSelectOptionData[] {
  const noteArray: MessageSelectOptionData[] = []

  for(let note = 0; note <= 10; note = note + 0.5) {
    noteArray.push({label: note.toString(), value: note.toString()})
  }

  return noteArray;
}
