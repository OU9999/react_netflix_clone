import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getDetailData,
  getMovies_nowPlaying,
  getMovies_popular,
  getMovies_topRated,
  getMovies_upComing,
  IDetailInfo,
  IGenre,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faCircleInfo,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
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

//banner
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 40px;
  margin-bottom: 30px;
  font-weight: bold;
  /* text-shadow: -1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black; */
`;

const Overview = styled.p`
  font-size: 25px;
  width: 40%;
  font-weight: 500;
  /* text-shadow: -1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black; */
  margin-bottom: 30px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
`;

const Button = styled.button`
  background: none;
  border: none;
  width: 12vw;
  height: 10vh;
  font-size: 28px;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;
  cursor: pointer;
  span {
    margin-left: 10px;
  }

  //play
  &:first-child {
    background-color: rgba(255, 255, 255, 1);
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }

  //info
  &:last-child {
    width: 17vw;
    color: ${(props) => props.theme.white.lighter};
    background-color: rgba(0, 0, 0, 0.6);
    &:hover {
      background-color: rgba(0, 0, 0, 1);
    }
  }
`;
//slider

const IndexButtons = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
`;

const IndexButton = styled(motion.span)`
  cursor: pointer;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 50px;
  padding: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Sliders = styled.div`
  display: flex;
  flex-direction: column;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin-bottom: 300px;
`;

const SliderTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
  margin-left: 20px;
  margin-bottom: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  opacity: 0;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 60vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(to top, black, transparent),
    url(${(props) => props.bgphoto});
`;

const BigDiv = styled.div`
  display: flex;
`;

const BigMovieColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -100px;
  &:first-child {
    top: -200px;
    width: 35%;
  }
  &:last-child {
    justify-content: flex-start;
    align-items: flex-start;
    width: 65%;
  }
`;

const BigPoster = styled.div`
  img {
    border-radius: 15px;
    width: 15vw;
  }
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  margin-bottom: 5px;
`;

const BigSubTitle = styled.h4`
  color: ${(props) => props.theme.white.lighter};
  font-size: 23px;
  margin-bottom: 30px;
`;

const BigInfos = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BigInfo = styled.span`
  background-color: ${(props) => props.theme.black.veryDark};
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
`;

const BigVoteAverage = styled.div<{ critic: number }>`
  width: 3vw;
  height: 5vh;
  border-radius: 7px;
  text-shadow: -1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black;
  background-color: ${(props) =>
    props.critic > 6 ? "#66cc33" : props.critic > 4 ? "#ffc20d" : "#ff0000"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

const BigTagLine = styled.span`
  color: ${(props) => props.theme.white.lighter};
  font-size: 20px;
  font-weight: bold;
  text-shadow: -1px 0px black, 0px 1px black, 1px 0px black, 0px -1px black;
  margin-bottom: 10px;
`;

const BigOverView = styled.p`
  width: 90%;
  color: ${(props) => props.theme.white.lighter};
`;

/*  Variants */

const rowVar: Variants = {
  hidden: (right: number) => {
    return {
      x: right === 1 ? window.outerWidth + 5 : -window.outerWidth - 5,
    };
  },
  visible: {
    x: 0,
  },
  exit: (right: number) => {
    return {
      x: right === 1 ? -window.outerWidth - 5 : window.outerWidth + 5,
    };
  },
};

const boxVar: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: "tween",
    },
  },
};

const buttonVar: Variants = {
  normal: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
  },
};

const infoVar: Variants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: "tween",
    },
  },
};

/*  other var */
const offset = 6;

function Home() {
  const navigation = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");

  const { data: data_nowPlaying, isLoading: isLoading_nowPlaying } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies_nowPlaying);
  const { data: data_upComing, isLoading: isLoading_upComing } =
    useQuery<IGetMoviesResult>(["movies", "upComing"], getMovies_upComing);
  const { data: data_popular, isLoading: isLoading_popular } =
    useQuery<IGetMoviesResult>(["movies", "popular"], getMovies_popular);
  const { data: data_topRated, isLoading: isLoading_topRated } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getMovies_topRated);
  const { data: data_detail } = useQuery<IDetailInfo>(
    [
      "nowPlaying" + bigMovieMatch?.params.movieId,
      "detail" + bigMovieMatch?.params.movieId,
    ],
    () =>
      getDetailData("movie", bigMovieMatch?.params.movieId as unknown as number)
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isRight, setIsRight] = useState(1); // -1 left : 1 right
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const changeIndex = (data: IGetMoviesResult, right: number) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIsRight(right);

      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      right === 1
        ? setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
        : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    navigation(`/movies/${movieId}`);
  };
  const onOverlayClicked = () => navigation(-1);

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data_nowPlaying?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  const getGenreToString = (arr: IGenre[]): string => {
    if (arr && arr.length > 0) {
      return (
        arr.map((g, idx) => {
          return idx + 1 === arr.length ? `${g.name}` : `${g.name}`;
        }) + ""
      );
    }
    return "";
  };

  console.log(data_detail?.genres);

  return (
    <Wrapper>
      {isLoading_nowPlaying &&
      isLoading_popular &&
      isLoading_topRated &&
      isLoading_upComing ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              data_nowPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{data_nowPlaying?.results[0].title}</Title>
            <Overview>
              {(data_nowPlaying?.results[0].overview.length as number) > 150
                ? `${data_nowPlaying?.results[0].overview.slice(0, 150)}...`
                : data_nowPlaying?.results[0].overview}
            </Overview>
            <Buttons>
              <Button>
                <FontAwesomeIcon icon={faPlay} />
                <span>재생</span>
              </Button>
              <Button>
                <FontAwesomeIcon icon={faCircleInfo} />
                <span
                  onClick={() =>
                    onBoxClicked(data_nowPlaying?.results[0].id as number)
                  }
                >
                  상세 정보
                </span>
              </Button>
            </Buttons>
          </Banner>

          <Sliders>
            {/* nowplaying */}
            <Slider>
              <SliderTitle>상영 중인 영화</SliderTitle>
              <IndexButtons>
                {/* prev */}
                <IndexButton
                  onClick={
                    () => changeIndex(data_nowPlaying as IGetMoviesResult, -1) //left
                  }
                  variants={buttonVar}
                  initial="normal"
                  whileHover="hover"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </IndexButton>
                {/* next */}
                <IndexButton
                  onClick={
                    () => changeIndex(data_nowPlaying as IGetMoviesResult, 1) //right
                  }
                  variants={buttonVar}
                  initial="normal"
                  whileHover="hover"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </IndexButton>
              </IndexButtons>

              <AnimatePresence
                onExitComplete={toggleLeaving}
                initial={false}
                custom={isRight}
              >
                <Row
                  variants={rowVar}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                  custom={isRight}
                >
                  {data_nowPlaying?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <Box
                        key={movie.id}
                        bgphoto={makeImagePath(
                          movie.backdrop_path || movie.poster_path,
                          "w500"
                        )}
                        variants={boxVar}
                        whileHover="hover"
                        initial="normal"
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(movie.id)}
                        layoutId={movie.id + ""}
                      >
                        <Info variants={infoVar}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </Sliders>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgphoto={makeImagePath(
                          clickedMovie.backdrop_path || clickedMovie.poster_path
                        )}
                      />
                      <BigDiv>
                        <BigMovieColumn>
                          <BigPoster>
                            <img
                              src={makeImagePath(clickedMovie.poster_path)}
                            />
                          </BigPoster>
                        </BigMovieColumn>
                        <BigMovieColumn>
                          <BigTitle>{clickedMovie.title}</BigTitle>
                          <BigSubTitle>
                            {clickedMovie.original_title}
                          </BigSubTitle>
                          <BigInfos>
                            <BigInfo>
                              {clickedMovie.release_date.slice(0, 4)}
                            </BigInfo>
                            <BigInfo>{`${data_detail?.runtime}분`}</BigInfo>
                            <BigInfo>
                              {getGenreToString(data_detail?.genres || [])}
                            </BigInfo>
                            <BigVoteAverage critic={clickedMovie.vote_average}>
                              {clickedMovie.vote_average * 10}
                            </BigVoteAverage>
                          </BigInfos>
                          <BigTagLine>{data_detail?.tagline}</BigTagLine>
                          <BigOverView>{clickedMovie.overview}</BigOverView>
                        </BigMovieColumn>
                      </BigDiv>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
