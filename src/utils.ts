const BASE_URL = "https://image.tmdb.org/t/p";

export function makeImagePath(id: string, format?: string) {
  return `${BASE_URL}/${format ? format : "original"}/${id}`;
}
