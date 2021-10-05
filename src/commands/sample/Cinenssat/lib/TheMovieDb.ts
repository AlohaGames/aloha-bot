import axios from "axios";

export enum TheMovieDbLanguage {
  FR = "fr-FR",
  EN = "en-US",
}

export interface TheMovieDbSearchMovieResult {
  id: number;
  title: string;
  adult: boolean;
  poster_path?: string;
  release_date?: string;
  overview?: string;
}

export interface TheMovieDbSearchMovieResultParsed
  extends TheMovieDbSearchMovieResult {
  year?: string;
  poster_full?: string;
  short_overview?: string;
}

export interface TheMovieDbSearchResult {
  page: number;
  total_pages: number;
  total_results: number;
  results: TheMovieDbSearchMovieResult[];
}

export interface InterfaceTheMovieDb {
  search: (query: string) => Promise<TheMovieDbSearchMovieResultParsed[]>;
}

export function TheMovieDb(
  language: TheMovieDbLanguage,
  api_key: string
): InterfaceTheMovieDb {
  const search = async (query: string) => {
    const params = new URLSearchParams({
      api_key,
      language,
      query,
    });
    const url = `https://api.themoviedb.org/3/search/movie?${params.toString()}`;
    const { data } = await axios(url);
    const searchResult = data as TheMovieDbSearchResult;
    const movies: TheMovieDbSearchMovieResultParsed[] = searchResult.results
      .map((movie) => {
        const year = movie.release_date?.split("-")[0];

        const poster_full = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined;

        const short_overview = movie.overview
          ? `${movie.overview.substring(0, 100)}...`
          : undefined;

        return {
          ...movie,
          year,
          poster_full,
          short_overview,
        };
      })
      .filter((movie) => !movie.adult);
    return movies;
  };

  return { search };
}
