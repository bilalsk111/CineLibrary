import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";

const HorizontalCards = ({ data = [], title, category, onCategoryChange }) => {
  const sliderRef = useRef(null);

  if (!data.length) return null;

  const handleWheel = (e) => {
    sliderRef.current.scrollLeft += e.deltaY;
  };

  const scroll = (direction) => {
    sliderRef.current.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full px-8 relative mt-10 group">
      {/* HEADER */}
      {title && (
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-semibold tracking-wide">
            {title}
          </h2>

          {category && onCategoryChange && (
            <Dropdown
              value={category}
              options={["all", "movie", "tv"]}
              onChange={onCategoryChange}
              hidden={false}
            />
          )}
        </div>
      )}

      {/* LEFT BUTTON */}
      <button
        onClick={() => scroll("left")}
        className="
          absolute left-2 top-1/2 -translate-y-1/2 z-20
          w-11 h-11 rounded-full
          bg-black/70 text-white
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          hover:scale-110
        "
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={() => scroll("right")}
        className="
          absolute right-2 top-1/2 -translate-y-1/2 z-20
          w-11 h-11 rounded-full
          bg-black/70 text-white
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          hover:scale-110
        "
      >
        ›
      </button>

      {/* CARDS */}
      <div
        ref={sliderRef}
        onWheel={handleWheel}
        className="
         flex gap-6 overflow-x-auto pb-8
    scroll-smooth scrollbar-hide
        "
      >
        {data.map((d) => {
          const image =
            d.backdrop_path || d.poster_path
              ? `https://image.tmdb.org/t/p/w500${
                  d.backdrop_path || d.poster_path
                }`
              : "/no-image.png";

          return (
            <Link
              key={d.id}
              to={`/${d.media_type || "movie"}/details/${d.id}`}
              className="
                relative min-w-[230px] h-[340px]
                rounded-xl overflow-hidden
                bg-zinc-900 shadow-lg"
            >
              {/* IMAGE */}
              <img
                src={image}
                alt={d.title || d.name}
                loading="lazy"
                className="
                  w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <span className="
                absolute top-3 left-3
                px-2 py-0.5 text-xs font-semibold
                bg-[#6556cd] text-white rounded
              ">
                {d.media_type?.toUpperCase() || "MOVIE"}
              </span>

              {/* CONTENT */}
              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="text-sm font-semibold line-clamp-2">
                  {d.title || d.name}
                </h3>

                <p className="text-xs text-zinc-300 mt-1">
                  {d.release_date ||
                    d.first_air_date ||
                    "No Date"}
                </p>

                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                  {d.overview}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalCards;
