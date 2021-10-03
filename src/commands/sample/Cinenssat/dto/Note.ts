import {Movies} from "./Movies";

export interface Note {
  id: string;
  authorId: string;
  note: number;
  comment?: string;
  film?: Movies
  FilmId?: string;
}