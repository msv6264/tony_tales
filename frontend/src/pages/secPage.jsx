import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SecPage() {
  const location = useLocation();
  const { mood, path } = location.state || {};
  const navigate = useNavigate();

  const handleClick = (() => {
    navigate("/")
  })
  
  // Initializing state to store story data received from the backend
  const [data, setdata] = useState({
    story: ""
  });

  useEffect(() => {
    // Fetching story data from backend and updating state
    fetch("http://localhost:5000/data", {
      method: "POST", // Telling backend that we're sending data (not just requesting)
      headers: {
        "Content-Type": "application/json" // Informing backend that the request body is JSON
      },
      body: JSON.stringify({ emojiName: mood }) // Converting JavaScript object to JSON string before sending
    })
      .then((res) => res.json()) // Waiting for backend response and parsing it as JSON
      .then((data) => {
        setdata({ story: data.Story }); // Updating state with the story from the response
      });
  }, [mood]); // Runs once when the component mounts, or whenever 'mood' changes

  return (
    <div className="bg-[#e8dbec] w-full h-screen p-5 ">
      <div className="text-[#130542] ml-[44%] font-KottaOne sm:text-[20px] ms:text-[25px]">
        Mood chosen
      </div>

      <div
        key={mood}
        className={`bg-[#d4c7e6] w-[100px] h-[100px] ms:w-[120px] ms:h-[120px] m-auto mt-[2%] rounded-[15px] drop-shadow-lg cursor-pointer 
  transition duration-200 flex justify-center items-center`}
      >
        <img className="h-[60px] ms:h-[80px] " src={path} alt={mood} />
      </div>

      <div className="bg-[#d4c7e6] m-auto rounded-[15px] mt-10 w-[80%] h-[40%] p-5 text-[#130542] font-KottaOne sm:text-[20px] ms:text-[25px] overflow-y-auto ">
        {data.story}
      </div>

      <div>
        <div
          className="text-white font-KottaOne bg-[#563c79] h-16 w-[35%]  sm:w-[25%] ms:w-[15%] m-auto flex gap-5 justify-center cursor-pointer items-center mt-[2%] rounded-[15px] hover:border-[3px] ms:text-[1.5rem] hover:border-black transition duration-200 filter active:brightness-75"
          onClick={handleClick}
        >
          Change mood
        </div>
      </div>
    </div>
  );
}
