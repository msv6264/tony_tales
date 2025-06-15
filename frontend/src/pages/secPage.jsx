import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import play from "../assets/play.png";
import pause from "../assets/pause.png";

export default function SecPage() {
  const location = useLocation();
  const { mood, path } = location.state || {};
  const navigate = useNavigate();
  const [story, setStory] = useState("");
  const [generated, setGenerated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const utteranceRef = useRef(null);

  // Fetching story from backend
  useEffect(() => {
    const apiUrl = "http://localhost:5000/data";

    fetch(apiUrl, {
      method: "POST", //we are not only requesting data but also sending some
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emojiName: mood }), //sending in JSON format
    })
      .then((res) => res.json()) //if story is fetched convert it into json format
      .then((data) => {
        setStory(data.Story); //in setStory we are storing story
        setGenerated(true); //setting generated as true
      })
      .catch((err) => {
        console.error("Error fetching story:", err);
        setStory("Oops! Couldn't load the story. Try again later.");
      })
      .finally(() => setLoading(false));
  }, [mood]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNarration = () => {
    if(!story || !generated){
      alert("Story not yet generated, please wait !!");
      return;
    }

    setIsDisabled(true);
    setIsPaused(false);

    if(!isPlaying){
      const utterance = new SpeechSynthesisUtterance(story);
      utterance.rate = 1;
      utterance.pitch = 1;
      utteranceRef.current = utterance;

      utterance.onend = (e) => {
        setIsPlaying(false);
        console.log("Speech finished");
      }

      utterance.onerror = (e) => {
        setIsPlaying(false);
        console.log("Error " + e.error + " occured");
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      console.log("Speaking..");
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      console.log("Stopped speaking..");
    }
  };
  

  const handlePause = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
    console.log("Speech resumed.");
  }

  const handlePlay = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    console.log("Speech paused.");
  }

  const handleClick = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStory("");
    setIsPlaying(false);
    setIsPaused(false);
    setGenerated(false);
    setIsDisabled(false);
  
    setTimeout(() => {
      navigate("/");
    }, 100);
  };  

  return (
    <div className="bg-[#e8dbec] w-full min-h-screen p-5">
      <div className="flex flex-col m-auto w-52">
        <div className="text-[#130542] font-KottaOne sm:text-[20px] ms:text-[25px]">
          Mood chosen
        </div>
        <div className="bg-[#d4c7e6] w-[100px] h-[100px] ms:w-[120px] ms:h-[120px] mt-[2%] rounded-[15px] drop-shadow-lg cursor-pointer 
          transition duration-200 flex justify-center items-center">
          <img className="h-[60px] ms:h-[80px]" src={path} alt={mood} />
        </div>
      </div>

      <div className="bg-[#d4c7e6] m-auto rounded-[15px] mt-10 w-[80%] h-[40%] p-5 text-[#130542] font-KottaOne sm:text-[20px] ms:text-[25px] overflow-y-auto">
        {loading ? "Loading story..." : story}
      </div>

      <div className="flex flex-col small:flex-row justify-center items-center gap-2 small:gap-32 w-full mt-4">
        <div
          className="text-white font-KottaOne bg-[#563c79] h-10 small:h-16 w-[140px] sm:h-[14] sm:w-[20%] ms:w-[15%] flex gap-5 justify-center cursor-pointer items-center mt-[2%] rounded-[15px] hover:border-[3px] ms:text-[1.5rem] hover:border-black transition duration-200 filter active:brightness-75"
          onClick={handleClick}
        >
          Change mood
        </div>

        <div
          className="w-[40px] ms:w-[100px] mt-4 sm:w-[80px] small:w-[70px] cursor-pointer"
          onClick={() => {
            if (isPlaying) {
              isPaused ? handlePause() : handlePlay();
            }
          }}          
        >
          <img src={isPlaying && !isPaused ? pause : play} alt="play/pause" />
        </div>

        <div
          className={`text-white font-KottaOne p-2 bg-[#563c79] h-10 small:h-16 w-[190px] sm:w-[24%] ms:w-[23%] flex gap-5 justify-center cursor-pointer items-center mt-[2%] rounded-[15px] hover:border-[3px] ms:text-[1.5rem] hover:border-black transition duration-200 filter active:brightness-75
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}          
          onClick={() => {
            if (story && !isDisabled) {
              handleNarration();
              setIsDisabled(true);
            }
          }}          
        >
          Want Tony to narrate?
        </div>
      </div>
    </div>
  );
}