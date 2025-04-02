import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const ActivityChart = ({ data }: { data: any }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const formattedData = Object.entries(data).map(([date, stats]: [string, any]) => ({
      date,
      total: stats.total,
      ...stats.byType,
    }));
    setChartData(formattedData);
  }, [data]);

  return (
    <LineChart width={800} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#8884d8" />
      <Line type="monotone" dataKey="LOGIN" stroke="#82ca9d" />
      <Line type="monotone" dataKey="MESSAGE" stroke="#ffc658" />
    </LineChart>
  );
};