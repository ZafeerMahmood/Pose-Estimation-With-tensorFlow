import { STRAVA_TOKEN_URI,PORT } from "../contants";

export const fetchAuthorizedStravaUser = async (code) => {
  try {
    const response = await fetch(`${STRAVA_TOKEN_URI}?code=${code}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Unable to fetch authorized Strava user. ${error}`);
  }
};

export const fetchUserStravaActivities = async (token) => {
  try {
    const response = await fetch("https://www.strava.com/api/v3/activities?per_page=10", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Unable to fetch Strava activities. ${error}`);
  }
};

export const combineData = async (token, start_time, end_time, Object, email) => {
  try {
    const response = await fetch(`${PORT}/combine_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        start_time: start_time,
        end_time: end_time,
        Object: Object,
        email: email,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Unable to combine data. ${error}`);
  }
}

export const getUserActivities = async (username) => {
  try {
    const response = await fetch(`${PORT}/get_user_activites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Unable to fetch user activities. ${error}`);
  }
};


export const getActivityById = async (activityId) => {
  try {
    const response = await fetch(`${PORT}/activity/${activityId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }); 
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Unable to fetch activity. ${error}`);
  }
};
