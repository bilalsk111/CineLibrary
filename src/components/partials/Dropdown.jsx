import React from "react";

const Dropdown = ({ title, options, onChange, value, hidden = false }) => {
  if (hidden) return null;

  return (
    <div className="relative w-48 group">
      {/* Custom Styling Wrapper */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 appearance-none bg-zinc-900/80 border border-zinc-700 text-zinc-300 px-4 pr-10 rounded-lg text-sm font-medium cursor-pointer outline-none transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-500 focus:border-[#6556CD] focus:ring-1 focus:ring-[#6556CD]/30"
        >
          <option value="" disabled className="bg-zinc-900 text-zinc-500">
            {title}
          </option>

          {options.map((o, i) => (
            <option key={i} value={o} className="bg-zinc-900 text-white">
              {o.charAt(0).toUpperCase() + o.slice(1)} {/* Better looking Title Case */}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-[#6556CD] transition-colors">
          <i className="ri-arrow-down-s-line text-xl"></i>
        </div>
      </div>
      
      {/* Subtle Bottom Glow effect on hover */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#6556CD] transition-all duration-300 group-hover:w-full opacity-50 rounded-full" />
    </div>
  );
};

export default Dropdown;