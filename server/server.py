
"""
    Flask server
"""
import os
import urllib.parse
import dotenv
from flask import Flask, request, Response, jsonify, redirect
from flask_cors import CORS
import requests
import json 
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import json_util, ObjectId

dotenv.load_dotenv('.env')

app = Flask(__name__)
CORS(app)

MONODB_URL = os.environ['mongodbURl']
STRAVA_CLIENT_ID = os.environ['STRAVA_CLIENT_ID']
STRAVA_CLIENT_SECRET = os.environ['STRAVA_CLIENT_SECRET']
REDIRECT_URI = os.environ['REDIRECT_URI']


client = MongoClient(MONODB_URL)
db = client['strava']
collection = db['activities']

#series_types = ['time', 'distance', 'velocity_smooth', 'heartrate', 'cadence', 'watts', 'temp', 'moving', 'grade_smooth','HeartRateZoneRanges']
series_types = ['distance']

#----------------functions------------------#
def exchange_token(code):
    strava_request = requests.post(
        'https://www.strava.com/oauth/token',
        data={
            'client_id': STRAVA_CLIENT_ID,
            'client_secret': STRAVA_CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code'
        }
    )
    return jsonify(strava_request.json())

def get_activities(type,token):
    strava_activities_url = f'https://www.strava.com/api/v3/athlete/activities?access_token={token}'
    data = requests.get(strava_activities_url).json()
    print(data)
    if type == None:
        return data
    return [x for x in data if x['type'] == f'{type}']


def get_activity_streams(activity_id, types, token):
    headers = {'Authorization': 'Bearer ' + token}
    url = f"https://www.strava.com/api/v3/activities/{activity_id}/streams?keys={','.join(types)}"
    response = requests.get(url, headers=headers).json()
    return response

#-----------------Routes----------------------#

@app.route('/')
def hello_world():
    return 'flask server running!'

@app.route('/video')
def stream_video():
    video_path = 'bikeRiding.mp4'
    def generate():
        with open(video_path, 'rb') as video_file:
            while True:
                data = video_file.read(1024)
                if not data:
                    break
                yield data

    return Response(generate(), mimetype='video/mp4')

@app.route('/strava_authorize', methods=['GET'])
def strava_authorize():
    params = {
        'client_id': STRAVA_CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'response_type': 'code',
        'scope': 'activity:read_all'
    }
    return redirect('{}?{}'.format(
        'https://www.strava.com/oauth/authorize',
        urllib.parse.urlencode(params)
    ))

@app.route('/strava_token', methods=['GET'])
def strava_token():
    code = request.args.get('code')
    if not code:
        return Response('Error: Missing code param', status=400)
    return exchange_token(code)

@app.route('/combine_data', methods=['POST'])
def combine_data():
    try:
        data = request.get_json()  # Get the JSON data from the request body
        start_time_str = data.get('start_time')
        token = data.get('token')
        email = data.get('email')
        Object = data.get('Object')

        # Convert start_time string to datetime object
        start_time = datetime.strptime(start_time_str, '%Y-%m-%d %H:%M:%S')

        closest_activity_id = None
        name = None
        start_date = None
        average_speed = None

        smallest_time_difference = timedelta.max
        strava_data = get_activities('VirtualRide', token)

        for activity in strava_data:
            activity_start_time_str = activity.get('start_date', '')
            activity_start_time = datetime.strptime(activity_start_time_str, '%Y-%m-%dT%H:%M:%SZ')
            time_difference = abs(start_time - activity_start_time)

            if time_difference < smallest_time_difference:
                smallest_time_difference = time_difference
                closest_activity_id = activity.get('id')
                name = activity.get('name')
                start_date = activity.get('start_date')
                average_speed = activity.get('average_speed')

        if closest_activity_id is None:
            return Response('Error: No matching activity found', status=400)

        # Get the activity streams from Strava
        streams = get_activity_streams(closest_activity_id, series_types, token)


        # Combine the data and push it to MongoDB
        combined_data = {
            'name': name,
            'email':email,
            'start_date': start_date,
            'average_speed': average_speed,
            'start_time': start_time_str,
            'streams': streams,
            'angles':Object,
            # Add other data from the request as needed
        }

        # Insert the combined data into MongoDB
        result = collection.insert_one(combined_data)

        if result.acknowledged:
            return jsonify({'message': 'Data successfully combined and pushed to MongoDB'})
        else:
            return Response('Error: Failed to push data to MongoDB', status=500)

    except Exception as e:
        return Response(f'Error: {e}', status=400)
    



@app.route('/get_user_activites', methods=['POST'])
def get_activities_by_username():
    try:
        data = request.get_json()
        username = data.get('username')

        if not username:
            return Response('Error: Missing username in the request', status=400)

        activities = collection.find({'email': username})
        if  activities is None:
            return Response('Error: No activities found for the given username', status=404)

        activities_list = list(activities)


        return json.loads(json_util.dumps(activities_list))

    except Exception as e:
        return Response(f'Error: {e}', status=500)


@app.route('/activity/<string:activity_id>', methods=['GET'])
def get_activity_by_id(activity_id):
    try:
        activity = collection.find_one({'_id': ObjectId(activity_id)})
        
        if not activity:
            return Response('Error: No activity found for the given ID', status=404)

        activity['_id'] = str(activity['_id'])
        return json.dumps(activity, default=json_util.default)

    except Exception as e:
        return Response(f'Error: {e}', status=500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

