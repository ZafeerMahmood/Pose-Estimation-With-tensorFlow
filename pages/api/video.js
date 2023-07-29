import fetch from 'node-fetch';

export default async function handler(req, res) {
    
  try {
    const remoteUrl = 'http://127.0.0.1:5000/video'; 
    const response = await fetch(remoteUrl, {
      method: 'GET',
      headers: {},
      maxBodySize: Infinity,
    });

    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }

    // Set the Content-Type header
    res.setHeader('Content-Type', 'video/mp4');

    // Stream the video response
    response.body.pipe(res);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).end();
  }
}
export const { config } = {
    api: {
      responseLimit: false,
    },
  };