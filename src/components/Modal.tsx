import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDetailData, IDetailInfo, IGenre } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigModal = styled(motion.div)`
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
  overflow-y: scroll;
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

const BigModalColumn = styled.div`
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
  margin-bottom: 35px;
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

interface IModal {
  plat: string;
  layoutId: string;
  media_type: string;
  dataId: number;
}

function Modal({ plat, layoutId, media_type, dataId }: IModal) {
  const navigation = useNavigate();
  const onOverlayClicked = () => navigation(-1);
  const { data } = useQuery<IDetailInfo>(["detail" + dataId], () =>
    getDetailData(media_type, dataId)
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
  return (
    <>
      <>
        <Overlay
          onClick={onOverlayClicked}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <BigModal layoutId={layoutId}>
          {data && (
            <>
              <BigCover
                bgphoto={makeImagePath(data.backdrop_path || data.poster_path)}
              />
              <BigDiv>
                <BigModalColumn>
                  <BigPoster>
                    <img src={makeImagePath(data.poster_path, "w300")} />
                  </BigPoster>
                </BigModalColumn>
                <BigModalColumn>
                  <BigTitle>
                    {plat === "movies" ? data.title : data.name}
                  </BigTitle>
                  <BigSubTitle>
                    {plat === "movies"
                      ? data.original_title
                      : data.original_name}
                  </BigSubTitle>
                  <BigInfos>
                    <BigInfo>
                      {plat === "movies"
                        ? data.release_date?.slice(0, 4)
                        : data.first_air_date?.slice(0, 4)}
                    </BigInfo>
                    {plat === "movies" ? (
                      <BigInfo>{`${data?.runtime}분`}</BigInfo>
                    ) : null}
                    <BigInfo>{getGenreToString(data?.genres || [])}</BigInfo>
                    <BigVoteAverage critic={data.vote_average}>
                      {Math.floor(data.vote_average * 10)}
                    </BigVoteAverage>
                  </BigInfos>
                  <BigTagLine>{data?.tagline}</BigTagLine>
                  <BigOverView>{data.overview}</BigOverView>
                </BigModalColumn>
              </BigDiv>
            </>
          )}
        </BigModal>
      </>
    </>
  );
}

export default Modal;
