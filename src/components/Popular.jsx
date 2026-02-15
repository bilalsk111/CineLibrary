import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../utils/axios";
import Topnav from "./partials/Topnav";
import Dropdown from "./partials/Dropdown";
import Cards from "./partials/Cards";
import Loader from "./partials/loader";
import React,{ useEffect, useState } from "react";
const Popular = () => {
  document.title = "CineLibrary | Popular";

  const navigate = useNavigate();

  const [category, setCategory] = useState("movie");
  const [popular, setPopular] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch popular items
  const GetPopular = async () => {
    try {
      const { data } = await axios.get(`/${category}/popular?page=${page}`);
      if (data.results?.length > 0) {
        setPopular((prev) => [...prev, ...data.results]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Popular fetch error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Refresh when category changes
  const refreshHandler = () => {
    setPopular([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
  };

  useEffect(() => {
    refreshHandler();
  }, [category]);

  useEffect(() => {
   GetPopular();
  }, [category, page === 1]);

  return (
    <div className="min-w-screen  h-screen bg-[#0f1115] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0f1115]/95 backdrop-blur border-b border-zinc-800 px-[5%] py-4 flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-2xl font-semibold text-zinc-400">
          <i
            onClick={() => navigate(-1)}
            className="ri-arrow-left-line hover:text-[#6556CD] cursor-pointer"
          />
          Popular - <small className="text-md text-zinc-400">{category}</small>
        </h1>

        <div className="flex items-center gap-4 w-[80%]">
          <Topnav />
          <Dropdown
            title="Category"
            options={["movie", "tv"]}
            value={category}
             onChange={setCategory}
          />
        </div>
      </div>

      <div id="popular-scroll" className="flex-1 overflow-y-auto">
        {popular.length > 0 ? (
          <InfiniteScroll
            scrollableTarget="popular-scroll"
            dataLength={popular.length}
            next={GetPopular}
            hasMore={hasMore}
            loader={<Loader />}
            scrollThreshold={0.8}
          >
            <Cards data={popular} title={category} />
          </InfiniteScroll>
        ) : (
          <Loader />
        )}
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#6556cd] hover:bg-[#7b6df0] flex items-center justify-center text-white shadow-lg"
      >
        <i className="ri-arrow-up-line text-lg" />
      </button>
    </div>
  );
};

export default Popular;
