import React from 'react'
import { PropagateLoader } from "react-spinners";
const Loader = () => {
  return (
     <div className="w-full h-screen flex items-center justify-center bg-[#25252500] text-white">
       <PropagateLoader color="#ededed" />
      </div>
  )
}

export default Loader
