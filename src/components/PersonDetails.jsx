import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncloadperson, removeperson } from "../store/actions/personActions";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import HorizontalCards from "./partials/HorizontalCards";
import Dropdown from "./partials/Dropdown";
import Loader from "./partials/Loader";

const PersonDetails = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { info } = useSelector((state) => state.person);
  const dispatch = useDispatch();
  const [category, setcategory] = useState("movie");

  useEffect(() => {
    dispatch(asyncloadperson(id));
    return () => {
      dispatch(removeperson());
    };
  }, [id]);

  return info ? (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-[10%] bg-[#1F1E24]">
      {/* Part1 - Navigation */}
      <nav className="w-full h-[8vh] sm:h-[10vh] items-center text-zinc-100 flex gap-4 sm:gap-6 lg:gap-10 text-lg sm:text-xl py-4">
        <Link
          onClick={() => navigate(-1)}
          className="hover:text-[#6556CD] ri-arrow-left-line text-2xl sm:text-xl"
        />
      </nav>

      {/* Main Content */}
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-0 mb-8">
        {/* Part 2 - Left: Profile Image and Personal Details */}
        <div className="w-full lg:w-[25%] flex flex-col items-center lg:items-start">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start mb-6">
            <img
              className="shadow-[8px_17px_38px_2px_rgba(0,0,0,.5)] h-[35vh] sm:h-[40vh] lg:h-[42vh] w-[250px] sm:w-[280px] lg:w-full object-cover rounded-lg lg:rounded-none"
              src={`https://image.tmdb.org/t/p/original/${info.detail.profile_path}`}
              alt={info.detail.name}
            />
          </div>

          <hr className="bg-zinc-500 border-none w-full lg:w-[79%] h-[1px] mb-6" />

          {/* Social Media Links */}
          <div className="text-2xl flex gap-x-5 text-white justify-center lg:justify-start mb-6 w-full">
            <a
              target="_blank"
              href={`https://www.wikidata.org/wiki/${info.externalid.wikidata_id}`}
            >
              <i className="ri-earth-fill hover:text-[#6556CD] transition-colors"></i>
            </a>

            <a
              target="_blank"
              href={`https://www.facebook.com/${info.externalid.facebook_id}`}
            >
              <i className="ri-facebook-circle-fill hover:text-[#6556CD] transition-colors"></i>
            </a>

            <a
              target="_blank"
              href={`https://www.instagram.com/${info.externalid.instagram_id}`}
            >
              <i className="ri-instagram-fill hover:text-[#6556CD] transition-colors"></i>
            </a>

            <a
              target="_blank"
              href={`https://www.twitter.com/${info.externalid.twitter}`}
            >
              <i className="ri-twitter-x-fill hover:text-[#6556CD] transition-colors"></i>
            </a>
          </div>

          {/* Personal Information */}
          <div className="w-full text-center lg:text-left px-4 lg:px-0">
            <h1 className="text-xl sm:text-2xl text-zinc-400 mb-4 font-semibold">
              Person Info
            </h1>

            <div className="space-y-3">
              <div>
                <h2 className="text-base sm:text-lg text-zinc-400 font-semibold">
                  Known For
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                  {info.detail.known_for_department}
                </p>
              </div>

              <div>
                <h2 className="text-base sm:text-lg text-zinc-400 font-semibold">
                  Gender
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                  {info.detail.gender == 2 ? "Male" : "Female"}
                </p>
              </div>

              <div>
                <h2 className="text-base sm:text-lg text-zinc-400 font-semibold">
                  Birthday
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                  {info.detail.birthday}
                </p>
              </div>

              <div>
                <h2 className="text-base sm:text-lg text-zinc-400 font-semibold">
                  Deathday
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                  {info.detail.deathday ? info.detail.deathday : "Still Alive"}
                </p>
              </div>

              <div>
                <h2 className="text-base sm:text-lg text-zinc-400 font-semibold">
                  Place Of Birth
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base">
                  {info.detail.place_of_birth}
                </p>
              </div>

              <div>
                <h2 className="text-base sm:text-lg text-zinc-400 font-semibold">
                  Also known as
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base break-words">
                  {info.detail.also_known_as.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 3 - Right: Main Details and Information */}
        <div className="w-full lg:w-[75%] lg:ml-[5%]">
          {/* Name */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-zinc-400 mb-4 text-center lg:text-left leading-tight">
            {info.detail.name}
          </h1>

          {/* Biography */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-zinc-400 font-semibold mb-2 text-center lg:text-left">
              Biography
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed px-4 lg:px-0 text-justify lg:text-left">
              {info.detail.biography}
            </p>
          </div>

          {/* Known For Section */}
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl text-zinc-400 font-semibold mb-4 text-center lg:text-left">
              Known For
            </h2>
            <HorizontalCards data={info.combinedCredits.cast} />
          </div>

          {/* Acting Credits Section */}
          <div className="w-full mt-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
                Acting Credits
                <span className="block h-[2px] w-10 bg-indigo-500 mt-2 rounded-full" />
              </h2>

              <Dropdown
                title="Category"
                options={["tv", "movie"]}
                func={(e) => setcategory(e.target.value)}
              />
            </div>

            {/* Credits Box */}
            <div
              className="relative w-full max-h-[50vh] overflow-y-auto rounded-xl bg-gradient-to-br from-zinc-900/60 to-black/40 border border-white/10 backdrop-blur-md p-4 sm:p-6 space-y-3
  "
            >
              {info[category + "Credits"].cast.map((c, i) => (
                <Link
                  key={i}
                  to={`/${category}/details/${c.id}`}
                  className="
          group
          block
          rounded-lg
          p-4
          bg-zinc-900/40
          border border-white/5
          hover:border-indigo-500/40
          hover:bg-zinc-700/80
          transition-all duration-300
        "
                >
                  <p className="text-sm sm:text-base font-medium text-white group-hover:text-indigo-400">
                    {c.name || c.title || c.original_name || c.original_title}
                  </p>

                  {c.character && (
                    <p className="mt-1 text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-300">
                      as <span className="text-zinc-300">{c.character}</span>
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  ) : (
    <Loader />
  );
};

export default PersonDetails;
