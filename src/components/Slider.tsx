import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, Variants } from "framer-motion";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvsResult } from "../api";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { useNavigate } from "react-router-dom";

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

const Slide = styled.div`
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

/*  Variants */

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

interface ISlider {
  data: IGetMoviesResult | IGetTvsResult;
  categoryTitle: string;
  plat: string;
}

/*  other var */
const offset = 6;

function Slider({ data, categoryTitle, plat }: ISlider) {
  const navigation = useNavigate();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isRight, setIsRight] = useState(1); // -1 left : 1 right
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const changeIndex = (
    data: IGetMoviesResult | IGetTvsResult,
    right: number
  ) => {
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

  const onBoxClicked = (movieId: number, plat: string) => {
    navigation(`/${plat}/${movieId}`);
  };

  return (
    <>
      <Slide>
        <SliderTitle>{categoryTitle}</SliderTitle>
        <IndexButtons>
          {/* prev */}
          <IndexButton
            onClick={
              () => changeIndex(data as IGetMoviesResult | IGetTvsResult, -1) //left
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
              () => changeIndex(data as IGetMoviesResult | IGetTvsResult, 1) //right
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
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((modal) => (
                <Box
                  key={modal.id}
                  bgphoto={makeImagePath(
                    modal.backdrop_path || modal.poster_path,
                    "w400"
                  )}
                  variants={boxVar}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(modal.id, plat)}
                  layoutId={modal.id + ""}
                >
                  <Info variants={infoVar}>
                    {plat === "movies" ? (
                      <h4>{modal.title}</h4>
                    ) : (
                      <h4>{modal.name}</h4>
                    )}
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slide>
    </>
  );
}

export default Slider;
