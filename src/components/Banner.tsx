import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvsResult } from "../api";
import { makeImagePath } from "../utils";
import { faPlay, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cover = styled.div<{ bgphoto: string }>`
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

const Button = styled(motion.button)`
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

  &:hover {
    scale: 1.1;
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

const Info = styled(motion.span)``;

interface IBanner {
  data?: IGetMoviesResult | IGetTvsResult;
  plat: string;
}

function Banner({ data, plat }: IBanner) {
  const navigation = useNavigate();
  const onBoxClicked = (movieId: number, plat: string) => {
    navigation(`/${plat}/${movieId}`);
  };
  return (
    <>
      <Cover
        bgphoto={makeImagePath(
          data?.results[0].backdrop_path || data?.results[0].poster_path || ""
        )}
      >
        {plat === "movies" ? (
          <Title>{data?.results[0].title}</Title>
        ) : (
          <Title>{data?.results[0].name}</Title>
        )}
        <Overview>
          {(data?.results[0].overview.length as number) > 150
            ? `${data?.results[0].overview.slice(0, 150)}...`
            : data?.results[0].overview}
        </Overview>
        <Buttons>
          <Button>
            <FontAwesomeIcon icon={faPlay} />
            <span>재생</span>
          </Button>
          <AnimatePresence>
            <Button
              onClick={() => onBoxClicked(data?.results[0].id as number, plat)}
              layoutId={data?.results[0].id as any}
            >
              <FontAwesomeIcon icon={faCircleInfo} />
              <Info>상세 정보</Info>
            </Button>
          </AnimatePresence>
        </Buttons>
      </Cover>
    </>
  );
}

export default Banner;
