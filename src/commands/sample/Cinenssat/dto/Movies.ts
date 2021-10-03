import { DateTime } from "luxon";
import { Note } from "./Note";

export interface Movies {
  id: string;
  guildId: string;
  watchDate: DateTime;
  title: string;
  director: string;
  release: DateTime;
  note: Note[];
}