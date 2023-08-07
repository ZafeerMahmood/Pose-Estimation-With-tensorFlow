import React, { useEffect, useState } from 'react';
import { getActivityById } from '../../api/strava';
import Sidebar from '../../components/sidebar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ActivitybyID = ({ token }) => {
    const [activity, setActivity] = useState({});
    const [activityName, setActivityName] = useState('');
    const [chartdata, setChartData] = useState([]);
    useEffect(() => {
      const fetchActivityData = async () => {
        try {
          const activityData = await getActivityById(token.activity_id);
          console.log(activityData);
          setActivity(activityData);
          setActivityName(activityData.name);
          const angles = activityData.angles;
          const streams = activityData.streams;
          const data = [angles, ...streams];
          console.log(data);
          const optimizedData = data.map((d) => {
            if (d.data.length > 2000) {
              return {
                type: d.type,
                data: d.data.filter((value, index) => index % 2 === 0),
              };
            }
            return d;
          });
          setChartData(optimizedData);
        } catch (error) {
          console.error('Error fetching activity:', error);
        }
      };
  
      fetchActivityData();
    }, [token.activity_id]);
  

    return (
      <div className='h-screen w-screen'>
        <Sidebar />
        <div className='flex justify-center p-2'>
          <h1 className='text-2xl font-bold'>Details of Activity {activityName}</h1>
          <br />
        </div>
  
        <div className='w-full flex flex-col justify-center p-2'>
          <h4>Charts of the Activity</h4>
          {chartdata.map((data, index) => (
            <div key={`chart-${index}`} className='mb-4 flex justify-center'>
              <h2>{`${data.type}`}</h2>
              <ResponsiveContainer width='90%' height={100}>
                <LineChart
                  width={500}
                  height={200}
                  data={data.data.map((value, dataIndex) => ({ name: dataIndex, value: value }))}
                  syncId={`anyId`}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='value' // Use 'value' instead of `${data.type}`
                    stroke={`#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`}
                    fill={`#${(0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default ActivitybyID



export async function getServerSideProps({ params: token }) {

  console.log(token)
  return {
    props: { token },
  }
}