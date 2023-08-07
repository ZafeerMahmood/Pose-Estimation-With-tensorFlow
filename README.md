# Pose Estimation with TensorFlow readme
accepts a stream that is sent to a proxy server in next js to avoid CORs error
does pose estimation then calculte the mid point of shoulder and hips and console.logs
the angle 

if angle is lesser then 45 or greate than 145 give a notification 
to keep the back straight



# backend python script that sends a stream .
```py
from flask import Flask, Response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/video": {"origins": "*"}}) 

@app.route('/')
def hello_world():
    return 'Hello, World!'

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

# to run 
```
npm install
npm run dev

```

connect to a server route for video fecting.


# todos / remaining 

1. `add strava auth workflow` #Done
2. `add mongodb to store angles` #Done 
3. add a background voice when angles or not correct or a tost notification ??

 
