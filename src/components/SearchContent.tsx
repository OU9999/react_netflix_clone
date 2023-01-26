import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ISearch } from "../api";
import { makeImagePath } from "../utils";

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  width: 220px;
  height: 350px;
  margin: 10px;
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

interface ISearchContent {
  data: ISearch;
  keyword: string;
}
function SearchContent({ data, keyword }: ISearchContent) {
  const navigation = useNavigate();
  const onBoxClicked = (media_type: string, id: number) => {
    navigation(`/search/${media_type}/${id}?keyword=${keyword}`);
  };
  return (
    <Box
      key={data.id}
      bgphoto={makeImagePath(
        (data.poster_path as any) || data.backdrop_path,
        "w400"
      )}
      variants={boxVar}
      whileHover="hover"
      initial="normal"
      transition={{ type: "tween" }}
      layoutId={data.id + ""}
      onClick={() => {
        onBoxClicked(`${data.media_type}s`, data.id);
      }}
    >
      <Info variants={infoVar}>
        {data.media_type === "movie" ? (
          <h4>{data.title}</h4>
        ) : (
          <h4>{data.name}</h4>
        )}
      </Info>
    </Box>
  );
}

export default SearchContent;
