from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

FOOTBALL_API_KEY = os.getenv("FOOTBALL_DATA_API_KEY")
FOOTBALL_URL = "https://api.football-data.org/v4"

YOUTUBE_API_KEY = os.getenv("YOUTUBE_DATA_API_KEY")
YOUTUBE_URL = "https://www.googleapis.com/youtube/v3"

@app.route("/api/matchday_scores", methods=["GET"])
def matchday_scores():
    competition = request.args.get("competition", "PL")
    headers = {"X-Auth-Token": FOOTBALL_API_KEY}
    competition_url = f"{FOOTBALL_URL}/competitions/{competition}"

    try:
        competition_response = requests.get(competition_url, headers=headers)
        competition_response.raise_for_status()
        competition_data = competition_response.json()

        matchday = competition_data.get("currentSeason" ,{}).get("currentMatchday")
        matches_url = f"{FOOTBALL_URL}/competitions/{competition}/matches"
        params = {"matchday" : matchday}

        response = requests.get(matches_url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/highlights")
def youtube_uploads():
    channel_id = "UCD2lJITnvzflNhOqQckMpQg" #fubo
    playlist_url = f"{YOUTUBE_URL}/channels?part=contentDetails&id={channel_id}&key={YOUTUBE_API_KEY}"
    
    try:
        playlist_response = requests.get(playlist_url)
        playlist_response.raise_for_status()
        playlist_data = playlist_response.json()

        if "items" not in playlist_data or len(playlist_data["items"]) == 0:
            return jsonify({"error: no uploads"}), 404
        
        playlist_id = playlist_data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        videos_url = f"{YOUTUBE_URL}/playlistItems?part=snippet&playlistId={playlist_id}&max_results=10&key={YOUTUBE_API_KEY}"
        videos_response = requests.get(videos_url)
        videos_response.raise_for_status()
        videos = videos_response.json()

        return jsonify(videos)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
