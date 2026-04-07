import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    meetingsThisMonth: 0,
    avgSentiment: 0,
    employeesAtRisk: 0,
  });

  const [trendData, setTrendData] = useState([]);
  const [deptData, setDeptData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5004/api/dashboard");
      setStats(res.data);

      setTrendData([
        { month: "Jan", value: 6 },
        { month: "Feb", value: 6.2 },
        { month: "Mar", value: 7.5 },
        { month: "Apr", value: 8.4 },
        { month: "May", value: 7.8 },
        { month: "Jun", value: 8.2 },
      ]);

      setDeptData([
        { name: "Engineering", value: 42 },
        { name: "Product", value: 28 },
        { name: "Marketing", value: 18 },
        { name: "Others", value: 12 },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const COLORS = ["#4F46E5", "#6366F1", "#94A3B8", "#CBD5F5"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* CENTER FIX */}
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Intelligence Overview</h1>
            <p className="text-gray-500">
              Monitor organizational health and real-time AI insights
            </p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-200 rounded-lg">
              Download Report
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Generate AI Insights
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card title="Total Employees" value={stats.totalEmployees} />
          <Card title="Meetings This Month" value={stats.meetingsThisMonth} />
          <Card title="Average Sentiment" value={stats.avgSentiment} />
          <Card title="Employees At Risk" value={stats.employeesAtRisk} />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-3 gap-6">

          {/* AREA CHART */}
          <div className="bg-white p-6 rounded-xl shadow col-span-2">
            <h2 className="font-semibold">Sentiment Trend</h2>
            <p className="text-gray-400 text-sm mb-3">
              Monthly engagement fluctuations
            </p>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#C7D2FE"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PIE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-4">By Department</h2>

            <div className="flex justify-center">
              <PieChart width={200} height={200}>
                <Pie data={deptData} dataKey="value" outerRadius={80}>
                  {deptData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            <div className="mt-4 text-sm">
              {deptData.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span>{d.name}</span>
                  <span>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}