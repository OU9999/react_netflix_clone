import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import { getTvs_TopRated, IGetTvsResult } from "../api";
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

function Tv() {
  const bigTvMatch = useMatch("/tvs/:tvId");
  const categoryTitles = [
    "방영 중인 시리즈",
    "인기 시리즈",
    "평론가 추천 시리즈",
  ];
  const { data: data_TopRated, isLoading: isLoading_TopRated } =
    useQuery<IGetTvsResult>(["tvs", "topRated"], getTvs_TopRated);

  return (
    <Wrapper>
      {isLoading_TopRated ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner data={data_TopRated as IGetTvsResult} plat="tvs" />
          <Sliders>
            <Slider
              data={data_TopRated as IGetTvsResult}
              categoryTitle={categoryTitles[2]}
              plat="tvs"
            />
          </Sliders>
          <AnimatePresence>
            {bigTvMatch ? (
              <Modal
                plat="tvs"
                media_type="tv"
                dataId={Number(bigTvMatch.params.tvId)}
                layoutId={bigTvMatch.params.tvId as string}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
