import * as posenet from '@tensorflow-models/posenet';

export function drawKeypoints(keypoints, canvas) {
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
  
      // Draw the keypoints
      if (keypoint.score > 0.5) {
        const { y, x } = keypoint.position;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'aqua';
        ctx.fill();
      }
    }
  }
  
  export function drawSkeleton(keypoints, canvas) {
    const ctx = canvas.getContext('2d');
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, 0.5);
  
    // Draw the skeleton lines
    for (let i = 0; i < adjacentKeyPoints.length; i++) {
      const keypointA = adjacentKeyPoints[i][0];
      const keypointB = adjacentKeyPoints[i][1];
  
      ctx.beginPath();
      ctx.moveTo(keypointA.position.x, keypointA.position.y);
      ctx.lineTo(keypointB.position.x, keypointB.position.y);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }