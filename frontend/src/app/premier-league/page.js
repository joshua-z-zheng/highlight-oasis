import "../globals.css"
import Scorecard from "../components/Scorecard";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function Page() { 
  const matchResponse = await fetch(`${BACKEND_URL}/api/matchday_scores?competition=PL`, {
    cache: "no-store"  
  });

  const youtubeResponse = await fetch(`${BACKEND_URL}/api/highlights`, {
    cache: "no-store"
  });

  if (!matchResponse.ok){
    return <p>Failed to load data</p>
  }

  const matchData = await matchResponse.json();
  const youtubeData = await youtubeResponse.json()

  if (youtubeResponse.ok){
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
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Recent Highlights:
        </h1>
        <div className="flex items-center pb-6 overflow-x-auto whitespace-nowrap w-full">
          {matchData.matches.map((match, index) => (
            <div key={index} className="last:mr-4">
              <a href={match.url} target="_blank" rel="noopener noreferrer">
                <Scorecard 
                  league={match.competition.name}
                  team1={match.homeTeam.shortName}
                  team2={match.awayTeam.shortName}
                  score1="?"
                  score2="?"
                  logo1={match.homeTeam.crest}
                  logo2={match.awayTeam.crest}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className="cards flex flex-col justify-center items-center">
        <h1 className="text-2xl p-4">
          Viewed Highlights:
        </h1>
        <div className="flex justify-center items-center pb-6 space-x-4">
          Coming soon!
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
