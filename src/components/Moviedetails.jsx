import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadmovie } from "../store/actions/movieActions";
import { removemovie } from "../store/reducers/movieSlice";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import HorizontalCards from "./partials/HorizontalCards";
import Loader from "./partials/Loader";

/* GENRE MAP */
const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
};

const Moviedetails = () => {
  document.title = "SCSDB | Movie Details";

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { info } = useSelector((state) => state.movie);
  const [activeGenre, setActiveGenre] = useState("all");

  /* FETCH MOVIE */
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(asyncloadmovie(id));
    return () => dispatch(removemovie());
  }, [id, dispatch]);

  /* SAFE DATA SOURCE */
  const sourceData = useMemo(() => {
    if (!info) return [];
    return info.recommendations?.length
      ? info.recommendations
      : info.similar || [];
  }, [info]);

  /* AVAILABLE GENRES */
  const availableGenres = useMemo(() => {
    const set = new Set();
    sourceData.forEach((m) =>
      m.genre_ids?.forEach((g) => GENRES[g] && set.add(g))
    );
    return Array.from(set);
  }, [sourceData]);

  /* FILTERED MOVIES */
  const filteredMovies = useMemo(() => {
    if (activeGenre === "all") return sourceData;
    return sourceData.filter((m) =>
      m.genre_ids?.includes(activeGenre)
    );
  }, [activeGenre, sourceData]);

  /* LOADING */
  if (!info) return <Loader />;

  const { detail, externalid, watchproviders, translations } = info;

  return (
    <div
      className="w-screen min-h-screen px-[8%] pb-20 text-white overflow-y-auto"
      style={{
        background: `linear-gradient(
          rgba(0,0,0,.25),
          rgba(0,0,0,.6),
          rgba(0,0,0,.9)
        ), url(https://image.tmdb.org/t/p/original/${detail.backdrop_path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* NAV */}
      <nav className="h-[10vh] flex items-center gap-6 text-lg">
        <i
          onClick={() => navigate(-1)}
          className="ri-arrow-left-line cursor-pointer hover:text-[#6556CD]"
        />

        {detail.homepage && (
          <a href={detail.homepage} target="_blank" rel="noreferrer">
            <i className="ri-external-link-fill" />
          </a>
        )}

        {externalid?.imdb_id && (
          <a
            href={`https://www.imdb.com/title/${externalid.imdb_id}`}
            target="_blank"
            rel="noreferrer"
          >
            IMDb
          </a>
        )}
      </nav>

      {/* HERO */}
      <section className="flex gap-12 mt-8">
        <img
          className="w-[300px] rounded-xl shadow-2xl object-cover"
          src={`https://image.tmdb.org/t/p/original/${
            detail.poster_path || detail.backdrop_path
          }`}
          alt={detail.title}
        />

        <div className="flex-1">
          <h1 className="text-5xl font-extrabold">
            {detail.title}
            {detail.release_date && (
              <span className="text-zinc-300 text-2xl ml-3">
                ({detail.release_date.split("-")[0]})
              </span>
            )}
          </h1>

          <div className="flex gap-4 items-center mt-4 text-zinc-300">
            <span className="px-4 py-2 rounded-full bg-[#6556CD] text-white font-bold">
              ⭐ {(detail.vote_average * 10).toFixed()}%
            </span>
            {detail.runtime && <span>{detail.runtime} min</span>}
            <span>{detail.genres.map((g) => g.name).join(", ")}</span>
          </div>

          {detail.tagline && (
            <p className="italic text-zinc-300 mt-4">
              {detail.tagline}
            </p>
          )}

          <p className="mt-6 max-w-3xl text-zinc-200">
            {detail.overview}
          </p>

          {translations?.length > 0 && (
            <p className="mt-4 text-sm text-zinc-400">
              Available in: {translations.join(", ")}
            </p>
          )}

          <Link
            to={`${pathname}/trailer`}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#6556CD] rounded-lg font-semibold"
          >
            <i className="ri-play-fill text-xl" />
            Watch Trailer
          </Link>
        </div>
      </section>

      {/* WATCH PROVIDERS */}
      {watchproviders && (
        <section className="mt-14 space-y-5">
          {["flatrate", "rent", "buy"].map((type) =>
            watchproviders[type] ? (
              <div key={type} className="flex items-center gap-4">
                <h3 className="w-[180px] capitalize">
                  {type === "flatrate" ? "Streaming" : type}
                </h3>
                <div className="flex gap-3">
                  {watchproviders[type].map((w, i) => (
                    <img
                      key={i}
                      className="w-12 h-12 rounded-md"
                      src={`https://image.tmdb.org/t/p/original/${w.logo_path}`}
                      alt={w.provider_name}
                    />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </section>
      )}

      {/* GENRE FILTERED RECOMMENDATIONS */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-6">
          Recommended for You
        </h2>

        <div className="flex gap-3 flex-wrap mb-6">
          <button
            onClick={() => setActiveGenre("all")}
            className={`px-4 py-2 rounded-full ${
              activeGenre === "all"
                ? "bg-[#6556CD]"
                : "bg-zinc-800"
            }`}
          >
            All
          </button>

          {availableGenres.map((id) => (
            <button
              key={id}
              onClick={() => setActiveGenre(id)}
              className={`px-4 py-2 rounded-full ${
                activeGenre === id
                  ? "bg-[#6556CD]"
                  : "bg-zinc-800"
              }`}
            >
              {GENRES[id]}
            </button>
          ))}
        </div>

        <HorizontalCards title="movie" data={filteredMovies} />
      </section>

      <Outlet />
    </div>
  );
};

export default Moviedetails;
