// "use client";

// import { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function StatsChart() {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/matches/monthlyDailyStats")
//       .then((res) => res.json())
//       .then((res) => {
//         const formatted = res?.days?.map((day: string, i: number) => ({
//           day,
//           padel: res.padel[i],
//           pickleball: res.pickleball[i],
//         }));
//         setData(formatted);
//          console.log("API DATA:", data); 
//       });
//   }, []);

//   return (
//     <div className="bg-gray-900 p-6 rounded-2xl text-white">
//       <h2 className="mb-4">Statistics</h2>

//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={data}>
//           <XAxis dataKey="day" stroke="#ccc" />
//           <YAxis stroke="#ccc" />
//           <Tooltip />

//           <Line dataKey="padel" stroke="#3b82f6" strokeWidth={3} />
//           <Line dataKey="pickleball" stroke="#f97316" strokeWidth={3} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StatsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`NEXT_PUBLIC_BACKEND_URL/api/matches/monthlyDailyStats`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl text-white">
      <h2 className="mb-4 text-lg font-semibold">Statistics</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          {/* Optional grid (light like image) */}
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />

          <XAxis dataKey="day" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "8px",
            }}
          />

          {/* ✅ CURVY LINES */}
          <Line
            type="monotone"
            dataKey="padel"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="pickleball"
            stroke="#f97316"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}