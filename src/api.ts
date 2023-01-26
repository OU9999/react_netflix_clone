const API_KEY = "c36842f25b8dc15eeb5a94ddec25b2d4";
const BASE_PATH = "https://api.themoviedb.org/3/";
const TAIL_PATH = `api_key=${API_KEY}&language=ko-KR&page=1&region=kr`;
const TAIL_PATH_TV = `api_key=${API_KEY}&language=ko-KR&page=1`;

interface IMovies {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  vote_average: number;
  release_date: string;
  name?: string;
}

interface ITvs {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  original_name: string;
  vote_average: number;
  first_air_date: string;
  title?: string;
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

export interface IGetTvsResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ITvs[];
  total_pages: number;
  total_results: number;
}

export interface ISearch {
  id: number;
  media_type: string;
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  release_date?: string;
  runtime?: string;
  overview: string;
  backdrop_path?: string;
  poster_path: string;
}

export interface ISearchResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: ISearch[];
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
  name?: string;
  original_name?: string;
  first_air_date?: string;
}

export interface IDetailInfo_Tvs {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  original_name: string;
  vote_average: number;
  first_air_date: string;
  genres: IGenre[];
  tagline: string;
  title?: string;
  original_title?: string;
  release_date?: string;
  runtime?: string;
}

export interface IDetailInfo_Search {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  original_name: string;
  vote_average: number;
  first_air_date: string;
  genres: IGenre[];
  tagline: string;
  title?: string;
  original_title?: string;
  release_date?: string;
  runtime?: string;
}

const categorys_movie = ["now_playing", "upcoming", "top_rated"];

export function getMovies_nowPlaying() {
  return fetch(`${BASE_PATH}/movie/${categorys_movie[0]}?${TAIL_PATH}`).then(
    (res) => res.json()
  );
}
export function getMovies_upComing() {
  return fetch(`${BASE_PATH}/movie/${categorys_movie[1]}?${TAIL_PATH}`).then(
    (res) => res.json()
  );
}
export function getMovies_topRated() {
  return fetch(`${BASE_PATH}/movie/${categorys_movie[2]}?${TAIL_PATH}`).then(
    (res) => res.json()
  );
}

const categorys_tv = ["on_the_air", "popular", "top_rated"];

export function getTvs_TopRated() {
  return fetch(`${BASE_PATH}/tv/${categorys_tv[2]}?${TAIL_PATH_TV}`).then(
    (res) => res.json()
  );
}

export function getDetailData(requestUrl: string, movieId: number) {
  return fetch(`${BASE_PATH}/${requestUrl}/${movieId}?${TAIL_PATH}`).then(
    (response) => response.json()
  );
}

export function getSearchData(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}&page=1&include_adult=false`
  ).then((res) => res.json());
}
