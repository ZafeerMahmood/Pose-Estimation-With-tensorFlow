import React from "react";
// import { StaticMap } from "./StaticMap";

const metersToMiles = (meters) => {
  return (meters * 0.00062137).toFixed(2);
};

const secondsToHms = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 3600 % 60);
  return (
    ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2)
  );
};

const minutesPerMile = (seconds, meters) => {
  const minutes = Math.floor(seconds / 60);
  const miles = (meters * 0.00062137).toFixed(2);
  const pace = minutes / parseFloat(miles);
  const paceMinutes = Math.floor(pace);
  let paceSeconds = Math.round((pace - paceMinutes) * 60);
  if (paceSeconds < 10) {
    paceSeconds = "0" + paceSeconds;
  }
  return paceMinutes + ":" + paceSeconds;
};

const ActivityStat = (props) => {
  const { statLabel, statValue } = props;
  return (
    <div className="flex">
      <span className="font-base">{statLabel}</span>
      <span className="font-base">{statValue}</span>
    </div>
  );
};

const StravaActivityDetail = (props) => {
  const {
    name,
    start_date,
    distance,
    elapsed_time,
    // map
  } = props;

  const distanceInMiles = metersToMiles(distance) + " mi";
  const elapsedTime = secondsToHms(elapsed_time);
  const pace = minutesPerMile(elapsed_time, distance) + "/mi";
  const activityDate = new Date(start_date).toDateString();

  return (
    <div className="grid grid-cols-1">
      <div className="text-base m-3">{activityDate}</div>
      <div className="text-lg leading-9 m-10">{name}</div>
      <div className="flex justify-between m-3 ">
        <ActivityStat statLabel="Distance" statValue={distanceInMiles} />
        <ActivityStat statLabel="Elapsed Time" statValue={elapsedTime} />
        <ActivityStat statLabel="Pace" statValue={pace} />
      </div>
      {/* <StaticMap mapType="mapbox" name={name} polyline={map.summary_polyline} /> */}
    </div>
  );
};

export default StravaActivityDetail;
