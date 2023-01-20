const API_KEY = "c36842f25b8dc15eeb5a94ddec25b2d4";
const BASE_PATH = "https://api.themoviedb.org/3/";
const TAIL_PATH = `api_key=${API_KEY}&language=ko-KR&page=1&region=kr`;

interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  vote_average: number;
  release_date: string;
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

export interface IGenre {
  id: number;
  name: string;
}

export interface IDetailInfo {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  vote_average: number;
  release_date: string;
  runtime: string;
  genres: IGenre[];
  tagline: string;
}

const categorys = ["now_playing", "upcoming", "popular", "top_rated"];

export function getMovies_nowPlaying() {
  return fetch(`${BASE_PATH}/movie/${categorys[0]}?${TAIL_PATH}`).then((res) =>
    res.json()
  );
}
export function getMovies_upComing() {
  return fetch(`${BASE_PATH}/movie/${categorys[1]}?${TAIL_PATH}`).then((res) =>
    res.json()
  );
}
export function getMovies_popular() {
  return fetch(`${BASE_PATH}/movie/${categorys[2]}?${TAIL_PATH}`).then((res) =>
    res.json()
  );
}
export function getMovies_topRated() {
  return fetch(`${BASE_PATH}/movie/${categorys[3]}?${TAIL_PATH}`).then((res) =>
    res.json()
  );
}

export function getDetailData(requestUrl: string, movieId: number) {
  return fetch(`${BASE_PATH}/${requestUrl}/${movieId}?${TAIL_PATH}`).then(
    (response) => response.json()
  );
}
