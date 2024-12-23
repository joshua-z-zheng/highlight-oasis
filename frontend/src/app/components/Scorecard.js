import { CiYoutube } from "react-icons/ci"

export default function Scorecard ( {league, team1, team2, logo1, logo2, score1, score2}){
    return (
        <div className="relative group w-64 h-32 ml-4 flex-shrink-0 bg-white hover:bg-gray-200 rounded-lg text-black border-green-400 border-2">
            <div className="flex flex-col space-y-3 p-2">
                <h2 className="text-gray-500 text-sm px-2">{league}</h2>
                <div className="flex">
                    <div className="flex flex-col space-y-2 p-2 pt-1">
                        <div className="flex space-x-2 items-center">
                            <img src={logo1} className="h-5 w-5"/>
                            <h3>{team1}</h3>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <img src={logo2} className="h-5 w-5"/>
                            <h3>{team2}</h3>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 p-2 pt-1 ml-auto">
                        <div>
                            {score1}
                        </div>
                        <div>
                            {score2}
                        </div>
                    </div>
                </div>
            </div>
            <CiYoutube 
                size={50}
                className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100" 
            />
        </div>
    );
}