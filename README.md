# Highlight Oasis
![preview](https://github.com/user-attachments/assets/0aa2ad9d-2563-4ba9-b54c-e59dc6ec63ff)
## Setup
1. Clone this repository
2. Navigate to ```/frontend``` and run ```npm install```
3. Run ```npm run dev```
4. Navigate to ```/backend``` and run ```pip install -r requirements.txt```
5. Obtain a football-data.org API key from [here](https://www.football-data.org/) and a Youtube API key from [here](https://console.developers.google.com/)
6. Create a ```.env``` file and add your API keys as follows:
~~~
FOOTBALL_DATA_API_KEY=YOUR_FOOTBALL_API_KEY_HERE
YOUTUBE_DATA_APIKEY=YOUR_YOUTUBE_API_KEY_HERE
~~~
8. Run ```python app.py```
9. Visit [http://localhost:3000/](http://localhost:3000/) on a web browser.

## Planned Features
- Add support for more sports (NBA, NFL)
- Host website on cloud
 
