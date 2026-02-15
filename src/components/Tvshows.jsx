import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import Cards from "./partials/Cards";
import Dropdown from "./partials/Dropdown";
import Topnav from "./partials/Topnav";
import Loader from "./partials/Loader";

const Tvshows = () => {
  document.title = "CineLibrary | TV Shows";
  
  const navigate = useNavigate();
  const [category, setcategory] = useState("airing_today");
  const [tv, settv] = useState([]);
  const [page, setpage] = useState(1);
  const [hasMore, sethasMore] = useState(true);

  const GetTv = async () => {
    try {
      const { data } = await axios.get(`/tv/${category}?page=${page}`);
      
      if (data.results.length > 0) {
        settv((prevState) => [...prevState, ...data.results]);
        setpage(page + 1);
      } else {
        sethasMore(false);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const refreshHandler = () => {
    setpage(1);
    settv([]);
    sethasMore(true);
    GetTv();
  };

  useEffect(() => {
    refreshHandler();
    // eslint-disable-next-line
  }, [category]);

  return tv.length > 0 ? (
    <div className="w-full min-h-screen bg-[#161616]">
      
      {/* Header Section */}
      <div className="w-full bg-zinc-900 fixed z-20 px-5">
        
        {/* Mobile: TV Shows centered, dropdowns below; Desktop: all in one row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          
          <div className="flex items-center justify-between lg:justify-start lg:flex-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <i 
                onClick={() => navigate(-1)} 
                className="text-2xl text-zinc-400 hover:text-[#6556CD] focus:outline-none ri-arrow-left-line cursor-pointer"
              ></i>
              <h1 className="text-xl sm:text-2xl font-semibold text-zinc-400">
                TV Shows ({category.replace('_', ' ')})
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-4 lg:flex-1 lg:justify-center">
            {/* Search bar with proper width on desktop - centered */}
            <div className="flex-1 w-[60%]">
              <div className="w-full">
                <Topnav />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:justify-end">
            <Dropdown 
              title="Category" 
              options={["on_the_air", "popular", "top_rated", "airing_today"]} 
              func={(e) => setcategory(e.target.value)} 
            />
          </div>
          
        </div>

        {/* Mobile: show search bar below header and dropdowns */}
        <div className="mt-4 lg:hidden">
          <Topnav />
        </div>
        
      </div>

      {/* Cards Section */}
      <InfiniteScroll
        dataLength={tv.length}
        next={GetTv}
        hasMore={hasMore}
        loader={<Loader />}
        className="w-full mt-25"
      >
        <Cards data={tv} title="tv" />
      </InfiniteScroll>
      
    </div>
  ) : (
    <Loader />
  );
};

export default Tvshows;