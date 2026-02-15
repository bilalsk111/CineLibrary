import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/partials/Loader";
import Cards from "./partials/Cards";
import Topnav from "./partials/Topnav";
import { useNavigate } from "react-router-dom";
import Dropdown from "./partials/Dropdown";
import InfiniteScroll from "react-infinite-scroll-component";

const Movies = () => {
  document.title = "CineLibrary | Movies";

  const navigate = useNavigate();

  const [category, setCategory] = useState("now_playing");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const GetMovies = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `/movie/${category}?page=${page}`
      );

      if (data.results.length > 0) {
        setMovies(prev => [...prev, ...data.results]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Movie fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    GetMovies();
  }, [category, page === 1]);

  return (
    <div className="min-w-screen h-screen bg-[#0f1115] flex flex-col">
      <div className="sticky top-0 z-50 bg-[#0f1115]/95 backdrop-blur border-b border-zinc-800 px-[5%] flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-2xl font-semibold text-zinc-400">
          <i
            onClick={() => navigate(-1)}
            className="ri-arrow-left-line hover:text-[#6556CD] cursor-pointer"
          />
          Movies -<small className="text-md text-zinc-400">{category}</small>
        </h1>

        <div className="flex items-center gap-4 w-[60%]">
          <Topnav />
          <Dropdown
            title="Category"
            options={[
              "now_playing",
              "popular",
              "top_rated",
              "upcoming",
            ]}
            value={category}
            onChange={setCategory}
          />
        </div>
      </div>

      <div id="movies-scroll" className="flex-1 overflow-y-auto">
        {movies.length > 0 ? (
          <InfiniteScroll
            scrollableTarget="movies-scroll"
            dataLength={movies.length}
            next={GetMovies}
            hasMore={hasMore}
            loader={<Loader />}
            scrollThreshold={0.8}
          >
            <Cards data={movies} title='movie' />
          </InfiniteScroll>
        ) : (
          <Loader />
        )}
      </div>

      <button
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#6556cd] hover:bg-[#7b6df0] flex items-center justify-center text-white shadow-lg"
      >
        <i className="ri-arrow-up-line text-lg" />
      </button>
    </div>
  );
};

export default Movies;
