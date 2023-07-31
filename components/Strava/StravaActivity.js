import React from 'react';

const StravaActivity = (props) => {
  const { id, name, selectActivity, isSelected, start_date } = props;

  const activityDate = new Date(start_date).toDateString();

  return (
    <div
      className={`hover:bg-[#ff8c5b] cursor-pointer `}
      onClick={() => selectActivity(id)}
    >
      <div className="text-base m-3">
        {activityDate}
      </div>
      <div className="text-lg leading-9 m-10">
        {name}
      </div>
    </div>
  );
};

export default StravaActivity;
