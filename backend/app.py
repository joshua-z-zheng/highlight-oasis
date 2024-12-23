from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("FOOTBALL_DATA_API_KEY")
URL = "https://api.football-data.org/v4"

@app.route("/api/matchday_scores", methods=["GET"])
def matchday_scores():
    competition = request.args.get("competition", "PL")
    headers = {"X-Auth-Token": API_KEY}
    competition_url = f"{URL}/competitions/{competition}"

    try:
        competition_response = requests.get(competition_url, headers=headers)
        competition_response.raise_for_status()
        competition_data = competition_response.json()

        matchday = competition_data.get("currentSeason" ,{}).get("currentMatchday")
        matches_url = f"{URL}/competitions/{competition}/matches"
        params = {"matchday" : matchday}

        response = requests.get(matches_url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
