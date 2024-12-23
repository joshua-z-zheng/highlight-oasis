import Image from "next/image";
import "./globals.css"
import Scorecard from "./components/Scorecard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function Home() {
  const response = await fetch(`${BACKEND_URL}/api/matchday_scores?competition=PL`, {
    cache: "no-store"  
  });

  if (!response.ok){
    return <p>Failed to load data</p>
  }

  const data = await response.json();

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Recent Highlights:
        </h1>
        <div className="flex items-center pb-6 overflow-x-auto whitespace-nowrap w-full">
          {data.matches.map((match, index) => (
            <div key={index} className="last:mr-4">
              <Scorecard 
                league={match.competition.name}
                team1={match.homeTeam.shortName}
                team2={match.awayTeam.shortName}
                score1="?"
                score2="?"
                logo1={match.homeTeam.crest}
                logo2={match.awayTeam.crest}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Ongoing Matches:
        </h1>
        <div className="flex justify-center items-center pb-6 space-x-4">
        </div>
      </div>
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Upcoming Matches:
        </h1>
        <div className="flex justify-center items-center pb-6 space-x-4">
        </div>
      </div>
    </div>
  );
}
