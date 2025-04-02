import { useState } from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const { data, isLoading } = useQuery(
    ['analytics', dateRange],
    async () => {
      const response = await fetch('/api/analytics/detailed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange),
      });
      return response.json();
    }
  );

  if (isLoading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="date-picker">
        <input
          type="date"
          value={dateRange.start.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
        />
        <input
          type="date"
          value={dateRange.end.toISOString().split('T')[0]}
          onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
        />
      </div>

      <div className="charts-grid">
        <div className="chart">
          <h3>Activity Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.activities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="_count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Engagement Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.engagements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="_count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="metrics-summary">
        <div className="metric-card">
          <h4>Total Messages</h4>
          <p>{data.messageStats._count}</p>
        </div>
        <div className="metric-card">
          <h4>Average Message Size</h4>
          <p>{Math.round(data.messageStats._avg.size)} characters</p>
        </div>
      </div>
    </div>
  );
}