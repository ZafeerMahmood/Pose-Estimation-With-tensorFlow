import Sidebar from '../components/sidebar';
import { useRef, useState ,useContext ,useEffect} from 'react';
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
import { combineData } from '../api/strava';
import { StravaStateContext } from "../context/StravaContext";


tf.setBackend('webgl'); 

export default function Home() {

  const stravaState = useContext(StravaStateContext);
  const user = stravaState?.user;
  const fullname = `${user?.firstname} ${user?.lastname}`;
  const token = stravaState?.token;

  const videoRef = useRef(null);
  const [angles, setAngles] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const isStreaming=useRef(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [sound,setSound]=useState(false);

  let animationFrameId = null;

  const runPosenet = async (net) => {
    if (isStreaming.current){
      animationFrameId = requestAnimationFrame(() => detect(net))
    }
  };

  const playBackgroundSound = () => {
    const sound = new Audio('position.wav');
    sound.play();
    setIsSoundPlaying(true);
    sound.addEventListener('ended', () => {
      setIsSoundPlaying(false);
    });
  };

  const detect = async (net) => {
    if (
      typeof videoRef.current !== 'undefined' &&
      videoRef.current !== null &&
      videoRef.current.readyState === 4
    ) {
      // Get Video Properties
      const video = videoRef.current;
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      // Set video width
      videoRef.current.width = videoWidth;
      videoRef.current.height = videoHeight;

      // Capture and process individual frames
      const frame = await captureFrame(video);
      await processFrame(net, frame);
    }

    animationFrameId = requestAnimationFrame(() => detect(net));
  };
  const processFrame = async (net, frame) => {
    const pose = await net.estimateSinglePose(frame);
    const leftShoulder = pose.keypoints.find((kp) => kp.part === 'leftShoulder');
    const rightShoulder = pose.keypoints.find((kp) => kp.part === 'rightShoulder');
  

    const leftHip = pose.keypoints.find((kp) => kp.part === 'leftHip');
    const rightHip = pose.keypoints.find((kp) => kp.part === 'rightHip');
  
    const shoulderMidpoint = {
      y: (leftShoulder.position.y + rightShoulder.position.y) / 2,
      x: (leftShoulder.position.x + rightShoulder.position.x) / 2,
    };
  
    const hipMidpoint = {
      y: (leftHip.position.y + rightHip.position.y) / 2,
      x: (leftHip.position.x + rightHip.position.x) / 2,
    };
  
    const angleRadians = Math.atan2(hipMidpoint.y - shoulderMidpoint.y, hipMidpoint.x - shoulderMidpoint.x);
    let angleDegrees = (angleRadians * 180) / Math.PI;
    console.log(angleDegrees);
    setAngles(prevAngles => [...prevAngles, angleDegrees]);

    if (angleDegrees < 45 && !sound) {
      setSound(true);
    }

  };
  const captureFrame = async (video) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const startStreaming = async () => {
    isStreaming.current=true;
    setStartTime(Date.now());
    const videoUrl = '/api/video'
    videoRef.current.src = videoUrl;
    await videoRef.current.play();
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5,
    });
    runPosenet(net);
  };

  const stopStreaming = async () => {
    isStreaming.current=false;
    if (!videoRef.current.paused && !videoRef.current.ended) {
      videoRef.current.pause();
      videoRef.current.src = '';
    }
    cancelAnimationFrame(animationFrameId);

    const start = formatTimestampToString(startTime);
    const end = formatTimestampToString(endTime);
    const anglesData={
      data:angles,
      original_size:angles.length,
      type:"angles",
    }
    console.log(anglesData);
    await combineData(token,start,end,anglesData,fullname);
    setAngles([]);
  };

  const formatTimestampToString = (timestamp) => {
    const dateObj = new Date(timestamp);
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
  };

  useEffect(() => {
    let timeoutId;

    const playBackgroundSound = () => {
      const sound = new Audio('position.wav');
      sound.play();
      setSound(true);

      // When the sound finishes playing, reset the state after a delay
      sound.addEventListener('ended', () => {
        timeoutId = setTimeout(() => {
          setSound(false);
        }, 2000);
      });
    };

    if (sound) {
      playBackgroundSound();
    }

    // Clear the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [sound]);


  return (
    <div>
      <Sidebar />
      <div className='h-screen w-srceen flex flex-col justify-center items-center space-y-2'>
        <h4 className='text-3xl md:text-5xl font-extrabold dark:text-black mb-6 '>
          {' '}
          Welcome to Your Fitness
        </h4>
        <div className='h-4/6 w-4/6 border rounded-sm border-blue-500 '>
          <video ref={videoRef} className='w-full h-full mx-auto'/>
        </div>
        <div className='flex-row'>
          <button
            onClick={startStreaming}
            type='button'
            className='py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
          >
            start
          </button>
          <button
            onClick={stopStreaming}
            type='button'
            className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
          >
            stop
          </button>
        </div>
      </div>
    </div>
  );
}
