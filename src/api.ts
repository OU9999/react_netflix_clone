const API_KEY = "c36842f25b8dc15eeb5a94ddec25b2d4";
const BASE_PATH = "https://api.themoviedb.org/3/";

interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovies[];
  total_pages: number;
  total_results: number;
}

const categorys = ["now_playing", "upcoming", "popular", "top_rated"];

export function getMovies_nowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/${categorys[0]}?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((res) => res.json());
}
export function getMovies_upComing() {
  return fetch(
    `${BASE_PATH}/movie/${categorys[1]}?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((res) => res.json());
}
export function getMovies_popular() {
  return fetch(
    `${BASE_PATH}/movie/${categorys[2]}?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((res) => res.json());
}
export function getMovies_topRated() {
  return fetch(
    `${BASE_PATH}/movie/${categorys[3]}?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((res) => res.json());
}
