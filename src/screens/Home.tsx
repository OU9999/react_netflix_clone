import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies_nowPlaying,
  getMovies_topRated,
  getMovies_upComing,
  IGetMoviesResult,
} from "../api";

import Banner from "../components/Banner";
import Slider from "../components/Slider";
import Modal from "../components/Modal";
/*  styled */

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Sliders = styled.div`
  display: flex;
  flex-direction: column;
`;

function Home() {
  const bigMovieMatch = useMatch("/movies/:movieId");
  const categoryTitles = [
    "상영 중인 영화",
    "개봉 예정 영화",
    "평론가 추천 영화",
  ];
  const { data: data_nowPlaying, isLoading: isLoading_nowPlaying } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies_nowPlaying);
  const { data: data_upComing, isLoading: isLoading_upComing } =
    useQuery<IGetMoviesResult>(["movies", "upComing"], getMovies_upComing);
  const { data: data_topRated, isLoading: isLoading_topRated } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getMovies_topRated);

  return (
    <Wrapper>
      {isLoading_nowPlaying && isLoading_topRated && isLoading_upComing ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner data={data_nowPlaying as IGetMoviesResult} plat="movies" />
          <Sliders>
            <Slider
              data={data_nowPlaying as IGetMoviesResult}
              categoryTitle={categoryTitles[0]}
              plat="movies"
            />
            <Slider
              data={data_upComing as IGetMoviesResult}
              categoryTitle={categoryTitles[1]}
              plat="movies"
            />
            <Slider
              data={data_topRated as IGetMoviesResult}
              categoryTitle={categoryTitles[2]}
              plat="movies"
            />
          </Sliders>
          <AnimatePresence>
            {bigMovieMatch ? (
              <Modal
                plat="movies"
                media_type="movie"
                dataId={Number(bigMovieMatch.params.movieId)}
                layoutId={bigMovieMatch.params.movieId as string}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
