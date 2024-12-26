"use client";

import "./globals.css"
import Scorecard from "./components/Scorecard";
import { useState, useEffect } from "react";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Page() { 

  const [matchData, setMatchData] = useState(null);
  const [youtubeData, setYoutubeData]= useState(null);
  const [linkStates, setLinkStates] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchResponse = await fetch(`${BACKEND_URL}/api/matchday_scores?competition=PL`, {
          cache: "no-store"  
        });
        const youtubeResponse = await fetch(`${BACKEND_URL}/api/highlights`, {
          cache: "no-store"
        });

        if (!matchResponse.ok){
          throw new Error("HTTP error!");
        }
        if (!youtubeResponse.ok){
          throw new Error("HTTP error!");
        }

        const mData = await matchResponse.json();
        const yData = await youtubeResponse.json();

        setMatchData(mData);
        setYoutubeData(yData);

      } catch (error){
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);  

  useEffect(() => {
    if (matchData && matchData.matches.length > 0){
      const savedStates = JSON.parse(localStorage.getItem("linkStates")) || {};
      const initialStates = matchData.matches.reduce((acc, _, index) => {
        acc[index] = savedStates[index] || false;
        return acc;
      }, {})
      setLinkStates(initialStates);
    }
  }, [matchData, youtubeData])

  useEffect(() => {
    if (linkStates){
      localStorage.setItem("linkStates", JSON.stringify(linkStates));
    }
  }, [linkStates]);

  if (!matchData || !youtubeData || !linkStates){
    return <div className="p-6 text-center text-xl">Loading...</div>
  }

  matchData.matches.forEach(match => {
    youtubeData.items.forEach(video =>{
      const names = match.homeTeam.shortName.split(" ");
      let flag = true;
      names.forEach(word => {
        flag &= video.snippet.title.includes(word);
      })
      if (flag){
        const videoId = video.snippet.resourceId.videoId;
        match.url = `https://youtube.com/watch?v=${videoId}`;
      }
    })
  });

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Recent Highlights:
        </h1>
        <div className="flex items-center pb-6 overflow-x-auto whitespace-nowrap w-full">
          {matchData.matches.map((match, index) => (
            !linkStates[index] && (
              <div key={index} className="last:mr-4">
                <a href={match.url} target="_blank" rel="noopener noreferrer" onClick={() => {
                  setLinkStates(prev => ({
                    ...prev,
                    [index]: true,
                  }))
                }}>
                  <Scorecard 
                    league={match.competition.name}
                    team1={match.homeTeam.shortName}
                    team2={match.awayTeam.shortName}
                    score1="?"
                    score2="?"
                    logo1={match.homeTeam.crest}
                    logo2={match.awayTeam.crest}
                  />
                  <span>{linkStates[index] ? "(Clicked)" : "(not clicked)"}</span>
                </a>
              </div>
            )
          ))}
        </div>
      </div>
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Viewed Highlights:
        </h1>
        <div className="flex justify-center items-center pb-6 space-x-4">
          {matchData.matches.map((match, index) => (
            linkStates[index] && (
              <div key={index} className="last:mr-4">
                <a href={match.url} target="_blank" rel="noopener noreferrer" onClick={() => {
                  setLinkStates(prev => ({
                    ...prev,
                    [index]: true,
                  }))
                }}>
                  <Scorecard 
                    league={match.competition.name}
                    team1={match.homeTeam.shortName}
                    team2={match.awayTeam.shortName}
                    score1={match.score.fullTime.home}
                    score2={match.score.fullTime.away}
                    logo1={match.homeTeam.crest}
                    logo2={match.awayTeam.crest}
                  />
                  <span>{linkStates[index] ? "(Clicked)" : "(not clicked)"}</span>
                </a>
              </div>
            )
          ))}
        </div>
      </div>
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Upcoming Matches:
        </h1>
        <div className="flex justify-center items-center pb-6 space-x-4">
          Coming soon!
        </div>
      </div>
    </div>
  );
}
