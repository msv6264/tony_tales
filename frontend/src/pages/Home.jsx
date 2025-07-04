import React, { useState } from "react";
import happy from "../assets/happy.svg";
import neutral from "../assets/neutral.svg";
import lovely from "../assets/lovely.svg";
import angry from "../assets/angry.svg";
import crying from "../assets/crying.svg";
import generate from "../assets/generate.svg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [clickImg, setClickImg] = useState(null);
  const navigate = useNavigate();

  const emojis = [
    { name: "smile", path: happy },
    { name: "neutral", path: neutral },
    { name: "lovely", path: lovely },
    { name: "angry", path: angry },
    { name: "crying", path: crying },
  ];

  const handleGenerate = () => {
    if (!clickImg) {
      alert("Please select a mood first!!");
      return;
    }
  
    const selectedEmoji = emojis.find((emoji) => emoji.name === clickImg);
  
    navigate("./secPage", {
      state: {
        mood: selectedEmoji.name,
        path: selectedEmoji.path,
      },
    });
  };  

  return (
    <div className="bg-[#e8dbec] w-full min-h-screen">
      <div className="flex flex-col align-middle gap-5 ">
        <div className="bg-[#d4c7e6] h-21 p-5 w-[85%] m-auto flex justify-center text-center mt-[4%] rounded-[15px] text-[#3A3158] font-KottaOne sm:text-[20px] ms:text-[25px]">
          Hello, Welcome to Tony Tales where you can read any story <br />
          generated by Tony according to your mood
        </div>
        <div className="text-[#020203] ml-[40%] ms:ml-[43%] font-KottaOne sm:text-[20px] ms:text-[30px]">
          Choose a mood
        </div>
      </div>

      <div className="w-[80%] flex flex-wrap gap-[55px] p-[2%] ml-[20%] sm:ml-[15%] ms:ml-[10%] ">
        {emojis.map((emoji, idx) => {
          const isSelected = clickImg === emoji.name;

          return (
            <div
              key={emoji.name}
              onClick={() => setClickImg(emoji.name)}
              className={`bg-[#d4c7e6] ms:w-[180px] ms:h-[180px] p-4 flex justify-center text-center mt-[2%] rounded-[15px] drop-shadow-lg cursor-pointer 
              transition duration-200 active:brightness-95
              ${isSelected ? "border-4 border-[#3e2a80]" : ""}`}
            >
              <img
                className="h-[90px] ms:h-[120px] rounded-full m-auto"
                src={emoji.path}
                alt={emoji.name}
              />
            </div>
          );
        })}
      </div>

      <div className="bg-[#563c79] h-16 w-[35%] sm:w-[25%] ms:w-[15%] p-1 m-auto flex gap-[2%] justify-center cursor-pointer items-center mt-[2%] rounded-[15px] hover:border-[3px] hover:border-black transition duration-200 filter active:brightness-75"
        onClick={handleGenerate}
      >
        <div className="text-white font-KottaOne  ms:text-[1.3rem]">
          Generate story
        </div>
        <img className=" w-7 ms:w-9" src={generate} alt="generate" />
      </div>
    </div>
  );
}
