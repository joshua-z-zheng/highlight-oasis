import "../../globals.css"
import Matches from "../../components/Matches";

export default async function Page( {params} ) {
    const { matchday } = await params;
    const pre = "matchday-";
    return <Matches competition="CL" matchdays="13" matchday={matchday.slice(pre.length)} />
}
