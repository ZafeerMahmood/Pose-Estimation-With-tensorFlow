import React from "react";
import { STRAVA_AUTHORIZE_URI } from "../contants";


const StravaAuthorize = () => {
  return (
    <div className="flex m-auto">
      <a href={STRAVA_AUTHORIZE_URI}>
        <img
          className="cursor-pointer"
          alt="Connect with Strava"
          src={"./btn_strava_connectwith_orange.svg"}
        />
      </a>
    </div>
  );
};

export default StravaAuthorize;
