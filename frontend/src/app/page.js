import "./globals.css"
import Matches from "./components/Matches";
import Link from "next/link";
import Scorecard from "./components/Scorecard";
import { FaLongArrowAltRight } from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";

export default function Page() { 
  return (
    <div className="flex flex-col justify-center bg-green-800">
      <div className="flex flex-col space-y-3 p-6 text-center bg-green-700">
        <div className="flex text-center justify-center items-center space-x-4">
          <GiSoccerBall size={40}/>
          <h1 className="text-5xl">Spoiler-free sports.</h1>
        </div>
        <h2 className="text-3xl">Presenting the ultimate highlights tracker for sports fans on a tight schedule.</h2>
        <div className="flex mx-auto p-6 text-left justify-center items-center">
          <Scorecard 
              league="CL"
              team1="Dortmund"
              team2="Real Madrid"
              logo1="https://crests.football-data.org/759.svg"
              logo2="https://crests.football-data.org/760.svg"
              score1="?"
              score2="?"
              marginLeft="0"
          />
          <div className="flex flex-col items-center text-center p-4 w-1/4">
            <h3 className="px-4">We track ongoing and upcoming matches, adding the highlights as soon as they're out!</h3>
            <FaLongArrowAltRight size={50} />
          </div>
          <Scorecard 
              league="CL"
              team1="Dortmund"
              team2="Real Madrid"
              logo1="https://crests.football-data.org/759.svg"
              logo2="https://crests.football-data.org/760.svg"
              score1="?"
              score2="?"
              marginLeft="0"
              simulateHover={true}
          />
          <div className="flex flex-col items-center text-center p-6 w-1/4">
            <h3 className="px-4">Scores are only revealed after you've viewed the highlights, and we'll move the match into the "viewed" section.</h3>
            <FaLongArrowAltRight size={50} />
          </div>
          <Scorecard 
              league="CL"
              team1="Dortmund"
              team2="Real Madrid"
              logo1="https://crests.football-data.org/759.svg"
              logo2="https://crests.football-data.org/760.svg"
              score1="0"
              score2="2"
              marginLeft="0"
          />
        </div>
        <h2 className="text-3xl">Enjoy your entertainment on their own schedule, on demand and spoiler-free.</h2>
        <h2 className="text-3xl">Click on a competition below to get started!</h2>
      </div>
      <div className="flex flex-col space-y-2 p-6 text-center text-xl">
        <Link href="../premier-league">
          <div className="cards p-6 hover:bg-green-500 border-green-500 border-2">
            Premier League
          </div>
        </Link>
        <Link href="../UCL">
          <div className="cards p-6 hover:bg-green-500 border-green-500 border-2">
            UEFA Champions League
          </div>
        </Link>
      </div>
      <div className="text-center p-6">
        <h2 className="text-xl">Disclaimer:</h2>
        <p>
          This website is a personal, non-commercial project created to compile football highlights for informational purposes. 
          It is not affiliated with or endorsed by the Premier League, UEFA Champions League, or any other competition, club, or governing body. 
          All trademarks, logos, and third-party content belong to their respective owners.
        </p>
      </div>
    </div>
  );
}
