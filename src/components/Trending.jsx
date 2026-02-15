import React,{ useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "../utils/axios";
import Cards from "./partials/Cards";
import Loader from "../components/partials/Loader";
import Topnav from "./partials/Topnav";
import { useNavigate } from "react-router-dom";

const Trending = () => {
  document.title = "CineLibrary | Trending"
  const navigate = useNavigate();

  const [mediaType, setMediaType] = useState("all");
  const [timeWindow, setTimeWindow] = useState("day");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTrending = async () => {
    const res = await axios.get(
      `/trending/${mediaType}/${timeWindow}?page=${page}`
    );

    if (res.data.results.length === 0) {
      setHasMore(false);
      return;
    }

    setData((prev) => [...prev, ...res.data.results]);
    setPage((p) => p + 1);
  };

  // RESET ON FILTER CHANGE
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [mediaType, timeWindow]);

  return (
    <div className="w-full h-screen bg-[#0f1115] flex flex-col">
      {/* HEADER */}
    <div className="sticky top-0 z-50 bg-[#0f1115]/95 backdrop-blur px-6 py-4 flex justify-around  gap-25 overflow-visible">
  <h1 className="flex items-center gap-3 text-xl">
    <i
      onClick={() => navigate(-1)}
      className="ri-arrow-left-line cursor-pointer"
    />
    Trending - {mediaType} / {timeWindow}
  </h1>

  <div className="flex items-center ml-25 gap-5 flex-1 w-[60%]">
    <Topnav
      showFilters
      onCategoryChange={setMediaType}
      onDurationChange={setTimeWindow}
      category={mediaType}
      duration={timeWindow}
    />
    
  </div>
</div>


      {/* SCROLL */}
      <div id="page-scroll" className="flex-1 overflow-y-auto">
        <InfiniteScroll
          dataLength={data.length}
          next={fetchTrending}
          hasMore={hasMore}
          loader={<Loader />}
          scrollableTarget="page-scroll"
        >
          <Cards data={data} title="trending" />
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Trending;
