from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import requests
import os
import math
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///teams.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Teams(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flag = db.Column(db.String, nullable=False)

with app.app_context():
    db.create_all()

FOOTBALL_API_KEY = os.getenv("FOOTBALL_DATA_API_KEY")
FOOTBALL_URL = "https://api.football-data.org/v4"

YOUTUBE_API_KEY = os.getenv("YOUTUBE_DATA_API_KEY")
YOUTUBE_URL = "https://www.googleapis.com/youtube/v3"

def fetch_playlist_videos(playlist_id, num_videos):
    next_page_token = None
    videos = []

    for i in range(math.ceil(num_videos / 50)):
        params = {
            "part" : "snippet",
            "playlistId" : playlist_id,
            "maxResults" : 50,
            "pageToken": next_page_token,
            "key" : YOUTUBE_API_KEY
        }

        videos_response = requests.get(f"{YOUTUBE_URL}/playlistItems", params=params)
        videos_response.raise_for_status()
        videos_data = videos_response.json()

        videos.extend(videos_data.get("items", []))
        next_page_token = videos_data.get("nextPageToken")

        if not next_page_token:
            break
    
    return videos

def fetch_club_flag(id):
    headers = {"X-Auth-Token" : FOOTBALL_API_KEY}
    club_url = f"{FOOTBALL_URL}/teams/{id}"

    try:
        response = requests.get(club_url, headers=headers)
        response.raise_for_status()
        club_data = response.json()
        flag = club_data.get("area", {}).get("flag")
        return flag
    except requests.exceptions.RequestException as e:
        return None

@app.route("/api/teams/<int:id>", methods=["GET"])
def get_club_flag(id):
    entry = db.session.get(Teams, id)
    if entry:
        return jsonify({"id": id, "flag": entry.flag}), 200
    
    team_flag = fetch_club_flag(id)
    if not team_flag:
        return jsonify({"error": "Failed to fetch data"}), 500
    
    db.session.execute(
        text("INSERT OR IGNORE INTO teams (id, flag) VALUES (:id, :flag)"),
        {"id": id, "flag" : team_flag}
    )
    db.session.commit()

    return jsonify({"id": id, "flag": team_flag}), 200

@app.route("/api/matchday_scores", methods=["GET"])
def matchday_scores():
    competition = request.args.get("competition", "PL")
    matchday = int(request.args.get("matchday", "-1"))
    headers = {"X-Auth-Token": FOOTBALL_API_KEY}
    competition_url = f"{FOOTBALL_URL}/competitions/{competition}"

    if matchday == -1:
        try:
            competition_response = requests.get(competition_url, headers=headers)
            competition_response.raise_for_status()
            competition_data = competition_response.json()
            matchday = competition_data.get("currentSeason" ,{}).get("currentMatchday")
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    try:        
        matches_url = f"{FOOTBALL_URL}/competitions/{competition}/matches"
        params = {"matchday" : matchday}

        response = requests.get(matches_url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/highlights", methods=["GET"])
def youtube_uploads():
    competition = request.args.get("competition", "PL")
    playlist_id = ""

    if competition == "PL":
        channel_id = "UCD2lJITnvzflNhOqQckMpQg" #fubo
        playlist_url = f"{YOUTUBE_URL}/channels?part=contentDetails&id={channel_id}&key={YOUTUBE_API_KEY}"
        
        try:
            playlist_response = requests.get(playlist_url)
            playlist_response.raise_for_status()
            playlist_data = playlist_response.json()

            if "items" not in playlist_data or len(playlist_data["items"]) == 0:
                return jsonify({"error: no uploads"}), 404
            
            playlist_id = playlist_data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500
        
    elif competition == "CL":
        playlist_id = "PLOX4zcQmhi4Xf_-ySFKA7IFFvYibZTFvr" #dazn

    try:
        playlist_items = fetch_playlist_videos(playlist_id, 500)
        return jsonify({"items" : playlist_items})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
