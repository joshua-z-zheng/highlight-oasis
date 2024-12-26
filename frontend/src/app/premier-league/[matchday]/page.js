import "../../globals.css"
import Matches from "../../components/Matches";

export default async function Page( {params} ) {
    const { matchday } = await params;
    const pre = "matchday-";
    return <Matches competition="PL" matchdays="38" matchday={matchday.slice(pre.length)} />
}
