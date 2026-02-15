import axios from "../../utils/axios"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Dropdown from "./Dropdown"

const Topnav = ({
  showFilters = false,
  category,
  duration,
  onCategoryChange,
  onDurationChange,
}) => {
  const [query, setQuery] = useState("")
  const [searches, setSearches] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setSearches([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`/search/multi?query=${query}`)
        setSearches(data.results || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

 return (
  <div className="flex items-center gap-4 w-full py-4">

    {/* SEARCH — MAIN */}
    <div className="relative flex-1 max-w-[60%]">
      <div className="flex items-center bg-zinc-900 px-5 py-3 rounded-full border border-zinc-700">
        <i className="ri-search-line text-zinc-400 text-lg" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-zinc-100 mx-4 outline-none"
          placeholder="Search anything..."
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <i className="ri-close-line text-zinc-400 hover:text-white" />
          </button>
        )}
      </div>

      {(loading || searches.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 z-[999] rounded-xl border border-zinc-700 max-h-[45vh] overflow-y-auto">
          {loading && (
            <p className="p-4 text-center text-zinc-400">Searching...</p>
          )}

          {!loading &&
            searches.map((s) => (
              <Link
                key={s.id}
                to={`/${s.media_type}/details/${s.id}`}
                className="block p-3 hover:bg-zinc-800 text-zinc-100"
              >
                {s.name || s.title || s.original_name || s.original_title}
              </Link>
            ))}
        </div>
      )}
    </div>

    {/* FILTERS — SECONDARY */}
    {showFilters && (
      <div className="flex gap-3 shrink-0">
        <Dropdown
          title="All"
          options={["all", "movie", "tv"]}
          value={category}
          onChange={onCategoryChange}
        />
        <Dropdown
          title="Day"
          options={["day", "week"]}
          value={duration}
          onChange={onDurationChange}
        />
      </div>
    )}
  </div>
)

}

export default Topnav
