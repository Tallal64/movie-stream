import ActorDetail from "@/components/custom/ActorDetail";
import DetailComp from "@/components/custom/DetailComp";
import Row from "@/components/custom/Row";
import DetailSkeleton from "@/components/custom/Skeletons/DetailSkeleton";
import RowSkeleton from "@/components/custom/Skeletons/RowSkeleton";
import {
  useGetMovieByIdQuery,
  useGetRecommendedMoviesQuery,
} from "@/redux/services/movies";
import {
  useGetRecommendedTvShowsQuery,
  useGetTvSeriesByIdQuery,
} from "@/redux/services/tvSeriesApis";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Detail = () => {
  let { Id, media_type } = useParams();

  const {
    data: MovieData,
    error: MovieError,
    isLoading: MovieLoading,
  } = useGetMovieByIdQuery(media_type === "movie" ? Id : skipToken);
  const {
    data: seriesData,
    error: seriesError,
    isLoading: seriesLoading,
  } = useGetTvSeriesByIdQuery(media_type === "tv" ? Id : skipToken);

  const { data: recommendedMovieData, isLoading: recommendedLoading } =
    useGetRecommendedMoviesQuery(media_type === "movie" ? Id : skipToken);

  const { data: recommendedTvData, isLoading: recommendedTvLoading } =
    useGetRecommendedTvShowsQuery(media_type === "tv" ? Id : skipToken);

  useEffect(() => {
    console.log("recommendedData: ", recommendedMovieData?.results);
    console.log("recommendedTvData: ", recommendedTvData?.results);
  });

  if (media_type === "actorDetail") {
    return <ActorDetail />;
  }

  return (
    <div className="px-5 lg:px-12">
      {MovieError || seriesError ? (
        <div>error while fetching in detail.jsx</div>
      ) : MovieLoading || seriesLoading ? (
        <DetailSkeleton />
      ) : MovieData || seriesData ? (
        <>
          <div className="flex gap-x-10 pt-5">
            <DetailComp
              poster={MovieData?.poster_path || seriesData?.poster_path}
              title={MovieData?.title || seriesData?.name}
              tagline={MovieData?.tagline || seriesData?.tagline}
              overview={MovieData?.overview || seriesData?.overview}
              runtime={MovieData?.runtime}
              numberOfSeasons={seriesData?.number_of_seasons}
              rating={MovieData?.vote_average || seriesData?.vote_average}
              status={MovieData?.status}
              releasedDate={MovieData?.release_date}
              backDrop={MovieData?.backdrop_path || seriesData?.backdrop_path}
              genre={MovieData?.genres || seriesData?.genres}
            />
          </div>

          <div>
            {recommendedLoading || recommendedTvLoading ? (
              <RowSkeleton />
            ) : recommendedMovieData?.results || recommendedTvData?.results ? (
              <>
                <h2 className="text-2xl font-body capitalize mb-7">
                  recommended after watching
                  <span className="text-secondary font-bold">
                    {" "}
                    {MovieData?.title || seriesData?.name}
                  </span>
                </h2>
                <Row
                  data={
                    recommendedMovieData?.results || recommendedTvData?.results
                  }
                />
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Detail;
