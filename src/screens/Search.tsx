import { AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import { PathMatch, useLocation, useMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearchData, ISearchResult } from "../api";
import Modal from "../components/Modal";
import SearchContent from "../components/SearchContent";

const Wrapper = styled.div`
  margin-top: 100px;
  background-color: black;
  display: flex;
  flex-direction: column;
`;

const H1 = styled.h1`
  font-size: 50px;
  margin-bottom: 20px;
  padding-left: 7vw;
`;

const Boxs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0px 20px;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const bigSearchMatch: PathMatch<string> | null = useMatch(
    `/search/:menuName/:searchId`
  );

  const { data: data_search, isLoading: isLoading_search } =
    useQuery<ISearchResult>(["search" + keyword], () =>
      getSearchData(keyword as string)
    );
  return (
    <>
      <Wrapper>
        <H1>Search Result for {keyword}</H1>
        <Boxs>
          {data_search?.results.map((modal) => (
            <SearchContent
              data={modal}
              keyword={keyword || ""}
              key={modal.id}
            />
          ))}
        </Boxs>
      </Wrapper>
      <AnimatePresence>
        {bigSearchMatch ? (
          <>
            <Modal
              plat={`${bigSearchMatch.params.menuName}`}
              media_type={
                bigSearchMatch.params.menuName?.slice(0, -1) as string
              }
              dataId={Number(bigSearchMatch.params.searchId)}
              layoutId={bigSearchMatch.params.searchId as string}
            />
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default Search;
