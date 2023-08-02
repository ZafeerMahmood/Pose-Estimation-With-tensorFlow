import React from 'react';
import { StravaStateContext } from "../context/StravaContext";

const StravaUser = () => {
  const stravaState = React.useContext(StravaStateContext);
  const user = stravaState?.user;
  const fullname = `${user?.firstname} ${user?.lastname}`;
  
  return (
    <div className=" grid grid-rows-2 items-center justify-center text-center mt-10">
      <div className="h-full w-full">
        <img src={user?.profile} alt={fullname} className="h-28  w-28 rounded-full" />
      </div>
      <div className="mt-10 text-xl">
        <div className="name text-sm mt-2">
          {fullname}
          
        </div>
      </div>
    </div>
  );
};

export default StravaUser;
