"use client";

import "../globals.css"
import Scorecard from "./Scorecard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaArrowCircleLeft} from "react-icons/fa"
import { FaArrowCircleRight } from "react-icons/fa"


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Matches( {competition, matchdays, matchday = -1} ) { 

    const currentPath = usePathname().split("/")[1];

    const [matchData, setMatchData] = useState(null);
    const [youtubeData, setYoutubeData]= useState(null);
    const [linkStates, setLinkStates] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchResponse = await fetch(`${BACKEND_URL}/api/matchday_scores?competition=${competition}&matchday=${matchday}`, {
                    cache: "no-store"  
                });
                const youtubeResponse = await fetch(`${BACKEND_URL}/api/highlights?competition=${competition}`, {
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
                setError(null);

            } catch (err){
                console.error("Error fetching data: ", err);
                setError(err.message);
            }
        };
        fetchData();
    }, []); 

    useEffect(() => {
        if (matchData && matchData.matches.length > 0){
            const savedStates = JSON.parse(localStorage.getItem("linkStates")) || {};
            let initialStates = {
                ...savedStates,
                ...matchData.matches.reduce((acc, match) => {
                    acc[match.id] = savedStates[match.id] || false;
                    return acc;
                }, {}),
            };
            
            matchData.matches.forEach(match => {
                match.url = null;
                for (var i = 0; i < youtubeData.items.length; i++){
                    let video = youtubeData.items[i];
                    const names = [...match.homeTeam.shortName.split(" "), ...match.awayTeam.shortName.split(" ")]
                    var flag = false;
                    names.forEach(word => {
                        flag |= word.length > 2 && video.snippet.title.includes(word);
                    })
                    
                    const matchDate = new Date(match.utcDate);
                    const videoDate = new Date(video.snippet.publishedAt);
                    const diff = Math.abs(matchDate - videoDate) / (1000 * 60 * 60 * 24);
                    flag &= diff <= 3;
        
                    if (flag){
                        const videoId = video.snippet.resourceId.videoId;
                        match.url = `https://youtube.com/watch?v=${videoId}`;
                        break;
                    }
                } 
            });   setLinkStates(initialStates);
        }
    }, [matchData, youtubeData])

    useEffect(() => {
        async function getFlags(){
            if (matchData && matchData.matches.length > 0){
                for (const match of matchData.matches){
                    match.homeTeam.flag = null;
                    match.awayTeam.flag = null;
                    try {
                        const homeResponse = await fetch(`${BACKEND_URL}/api/teams/${match.homeTeam.id}`, {
                            cache: "no-store"  
                        });
                        const awayResponse = await fetch(`${BACKEND_URL}/api/teams/${match.awayTeam.id}`, {
                            cache: "no-store"  
                        });

                        if (homeResponse.ok){
                            const homeData = await homeResponse.json()
                            match.homeTeam.flag = homeData.flag;
                        }
                        if (awayResponse.ok){
                            const awayData = await awayResponse.json()
                            match.awayTeam.flag = awayData.flag;
                        }
                    } catch (err){
                        console.error("Error fetching data: ", err);
                    }
                }
                setLoading(false);
            }
        }
        getFlags();
    }, [matchData])

    useEffect(() => {
        if (linkStates){
            localStorage.setItem("linkStates", JSON.stringify(linkStates));
        }
    }, [linkStates]);


    if (error){
        return <div className="p-6 text-center text-xl">Too many requests! Please try again later.</div>
    }
    if (loading || !matchData || !youtubeData || !linkStates){
        return <div className="p-6 text-center text-xl">Loading...</div>
    }

    return (
        <div className="flex flex-col space-y-6 p-6">
            <div className="relative flex p-2">
                {
                    (matchData.filters.matchday - 1 > 0 &&
                        <Link href={`../${currentPath}/matchday-${matchData.filters.matchday - 1}`.replace(/\/+/g, "/")}>
                            <div className="flex items-center space-x-2 absolute left-0 hover:text-green-400">
                                <FaArrowCircleLeft />
                                <h1>Matchday {matchData.filters.matchday - 1}</h1>
                            </div>
                        </Link>
                    )
                }
                <h1 className="text-2xl mx-auto">Matchday {matchData.filters.matchday}</h1>
                {
                    
                    (parseInt(matchData.filters.matchday) < parseInt(matchdays) &&
                        <Link href={`../${currentPath}/matchday-${parseInt(matchData.filters.matchday) + 1}`.replace(/\/+/g, "/")}>
                            <div className="flex items-center space-x-2 absolute right-0 hover:text-green-400">
                                <h1>Matchday {parseInt(matchData.filters.matchday) + 1}</h1>
                                <FaArrowCircleRight />
                            </div>
                        </Link>
                    )
                }
                
            </div>
            <div className="cards flex flex-col justify-center items-center border-green-500 border-2 p-2">
                <h1 className="text-2xl p-4">
                    Available Highlights:
                </h1>
                <div className="flex items-center px-4 pt-2 pb-6 gap-4 overflow-x-auto whitespace-nowrap w-full">
                    {matchData.matches.map((match, index) => (
                        match.status == "FINISHED" && match.url && !linkStates[match.id] && (
                            <div key={index} className="first:ml-auto last:mr-auto">
                                <a href={match.url} target="_blank" rel="noopener noreferrer" onClick={() => {
                                    setLinkStates(prev => ({
                                        ...prev,
                                        [match.id]: true,
                                    }))
                                }}>
                                    <Scorecard 
                                        league={match.competition.name}
                                        team1={match.homeTeam.shortName}
                                        team2={match.awayTeam.shortName}
                                        score1="?"
                                        score2="?"
                                        logo1={match.homeTeam.flag}
                                        logo2={match.awayTeam.flag}
                                    />
                                </a>
                            </div>
                        )
                    ))}
                </div>
            </div>
            <div className="cards flex flex-col justify-center items-center border-green-500 border-2 p-2">
                <h1 className="text-2xl p-4">
                Viewed Highlights:
                </h1>
                <div className="flex items-center px-4 pt-2 pb-6 gap-4 overflow-x-auto whitespace-nowrap w-full">
                    {matchData.matches.map((match, index) => (
                        match.status == "FINISHED" && match.url && linkStates[match.id] && (
                            <div key={index} className="first:ml-auto last:mr-auto">
                                <a href={match.url} target="_blank" rel="noopener noreferrer">
                                    <Scorecard 
                                        league={match.competition.name}
                                        team1={match.homeTeam.shortName}
                                        team2={match.awayTeam.shortName}
                                        score1={match.score.fullTime.home}
                                        score2={match.score.fullTime.away}
                                        logo1={match.homeTeam.flag}
                                        logo2={match.awayTeam.flag}
                                    />
                                </a>
                            </div>
                        )
                    ))}
                </div>
            </div>
            <div className="cards flex flex-col justify-center items-center border-green-500 border-2 p-2">
                <h1 className="text-2xl p-4">
                Ongoing and Pending Matches:
                </h1>
                <div className="flex items-center px-4 pt-2 pb-6 gap-4 overflow-x-auto whitespace-nowrap w-full">
                    {matchData.matches.map((match, index) => (
                        (match.status == "IN_PLAY" || match.status == "PAUSED" || (match.status == "FINISHED" && !match.url)) && (
                            <div key={index} className="first:ml-auto last:mr-auto">
                                <Scorecard 
                                    league={match.competition.name}
                                    team1={match.homeTeam.shortName}
                                    team2={match.awayTeam.shortName}
                                    score1="?"
                                    score2="?"
                                    logo1={match.homeTeam.flag}
                                    logo2={match.awayTeam.flag}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>
            <div className="cards flex flex-col justify-center items-center border-green-500 border-2 p-2">
                <h1 className="text-2xl p-4">
                Upcoming Matches:
                </h1>
                <div className="flex items-center px-4 pt-2 pb-6 gap-4 overflow-x-auto whitespace-nowrap w-full">
                    {matchData.matches.map((match, index) => (
                        (match.status == "SCHEDULED" || match.status == "TIMED") && (
                            <div key={index} className="first:ml-auto last:mr-auto">
                                <Scorecard 
                                    league={match.competition.name}
                                    team1={match.homeTeam.shortName}
                                    team2={match.awayTeam.shortName}
                                    score1="?"
                                    score2="?"
                                    logo1={match.homeTeam.flag}
                                    logo2={match.awayTeam.flag}
                                />
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}
