"use client";

import StatsChart from "@/app/_component/graph/page";
import { useEffect, useState } from "react";



type Match = {
  _id: string;
  game: string;
  date: string;
  user?: {
    name: string;
    email:string;
    phoneNumber:number;
    image:string
  };
  venue?: {
    name: string;
    address: string;
  };
};
type StatCardProps = {
  title: string;
  value: string | number;
};



const dates = [22, 23, 24, 25, 26, 27, 28];
export default function Dashboard() {
const [matches, setMatches] = useState<Match[]>([]);
const [totalPadelMatches, setTotalPadelMatches] = useState(0);
const [totalpickleballMatches, setTotalpickleballMatches] = useState(0);
const [totalMonthlyPadelMatches, setTotalMonthlyPadelMatches] = useState(0);

const [totalMonthlypickleballMatches, setTotalMonthlypickleballMatches] = useState(0);
const [totalMonthlyMatches, setTotalMonthlyMatches] = useState(0);
const [todayBookings, setTodayBookings] = useState<any[]>([]);


 const fetchMatches = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches/getAllMatches`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    const allMatches = data.matches || data.data || [];

    // Booking date filter
    const today = new Date().toDateString();

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const tomorrow = tomorrowDate.toDateString();

    const filteredMatches = allMatches.filter((match:any) => {
      if (!match.createdAt) return false;

      const bookingDate = new Date(match.createdAt).toDateString();

      return bookingDate === today || bookingDate === tomorrow;
    });

    // Match date filter
    const todayDate = new Date().toISOString().split("T")[0];

    const todayMatches = filteredMatches.filter(
      (match:Match) => match.date === todayDate
    );

    const totalPadelMatches = todayMatches.filter(
      (match:Match) => match.game?.toLowerCase() === "padel"
    ).length;

    const totalpickleballMatches = todayMatches.filter(
      (match:Match) => match.game?.toLowerCase() === "pickleball"
    ).length;

//monthly
   const currentDate = new Date();

const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const monthlyMatches = allMatches.filter((match: any) => {
  const matchDate = new Date(match.date);

  return (
    matchDate.getMonth() === currentMonth &&
    matchDate.getFullYear() === currentYear
  );
});

// Total matches in current month
const totalMonthlyMatches = monthlyMatches.length;

// Total padel matches
const totalMonthlyPadelMatches = monthlyMatches.filter(
  (match: any) => match.game?.toLowerCase() === "padel"
).length;

// Total pickleball matches
const totalMonthlypickleballMatches = monthlyMatches.filter(
  (match: any) => match.game?.toLowerCase() === "pickleball"
).length;


//total schedule
const todayDateValue = new Date().toLocaleDateString("en-CA");

const todayBookingsData = allMatches.filter(
  (match: any) => match.date === todayDateValue
);

setTodayBookings(todayBookingsData);

console.log(todayDateValue);
console.log(todayBookingsData);
console.log("Monthly Matches:", totalMonthlyMatches);
console.log("Monthly Padel:", totalMonthlyPadelMatches);
console.log("Monthly pickleball:", totalMonthlypickleballMatches);


    console.log("Padel:", totalPadelMatches);
    console.log("pickleball:", totalpickleballMatches);

    
console.log("TOTAL MATCHES:", matches.length);

matches.slice(0, 5).forEach((m: any) => {
  console.log("FULL OBJECT:", m);
  console.log("DATE FIELD:", m.date);
  console.log("GAME FIELD:", m.game);
});
    setMatches(filteredMatches);
    setTotalPadelMatches(totalPadelMatches);
setTotalpickleballMatches(totalpickleballMatches);
setTotalMonthlyMatches(totalMonthlyMatches);
setTotalMonthlypickleballMatches(totalMonthlypickleballMatches);
setTotalMonthlyPadelMatches(totalMonthlyPadelMatches);


  } catch (err) {
    console.error("Error fetching matches:", err);
  }
};

useEffect(() => {
  fetchMatches();
}, []);

  
  
  return (
    <div className="w-full min-h-screen bg-white p-6">
      
      
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6 ">
        <h1 className="text-2xl font-semibold text-blue-900 mb-6">
        Welcome to Barnton Park 
      </h1>

        <StatCard title="Total matches this month" value={totalMonthlyMatches} />
        <StatCard title="Pickleball matches this month" value={totalMonthlypickleballMatches} />
        <StatCard title="Padel matches this month" value={totalMonthlyPadelMatches} />
        
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Schedule */}
     <div className="col-span-3 bg-gray-100 rounded-2xl p-4">
  <h2 className="font-semibold text-blue-900 mb-4">
    Today’s Schedule
  </h2>

  {/* Today's Date */}
  <div className="flex gap-2 mb-4 overflow-x-auto">
    <div className="px-4 py-2 rounded-md text-center bg-blue-900 text-white">
      <div className="text-xs">
        {new Date().toLocaleDateString("en-US", {
          weekday: "short",
        })}
      </div>

      <div className="font-semibold">
        {new Date().getDate()}
      </div>
    </div>
  </div>

  {/* Today Schedule */}
  <div>
    {todayBookings.length > 0 ? (
      todayBookings.map((match: any, i: number) => (
        <div
          key={match._id}
          className={`p-4 rounded-xl mb-3 ${
            i === 0
              ? "bg-gray-900 text-white font-raleway"
              : "bg-gray-100 text-black font-raleway"
          }`}
        >
          {/* Name */}
          <p className="font-semibold text-lg">
            {match.user?.name}
          </p>

          {/* Game */}
          <div className=" flex display-flex">
            <p className="text-sm opacity-80">
            {match.game} Match
          </p>
          <span className="p-2"></span>
            <p className="text-xs opacity-70">
             {match.duration} mins
          </p>
          </div>
          
          {/* Time */}
          <p className="text-xs opacity-70 mt-1">
            Time: {match.timeSlot?.join(", ")}
          </p>

         
          

          
        </div>
      ))
    ) : (
      <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-500">
        No bookings scheduled for today
      </div>
    )}
  </div>
</div>

        {/* Middle Section */}
        <div className="col-span-6 space-y-6">
          
          {/* Recent Bookings */}
          <div className="bg-gray-100 rounded-2xl p-4">
            <h2 className="font-semibold text-blue-900 mb-4">
              Recent Bookings
            </h2>

            <table className="w-full text-sm ">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left">Name</th>
                  <th>Game</th>
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>
            <tbody>
  {matches.length > 0 ? (
    matches.map((match) => (
      <tr key={match._id} className="border-t">
        <td className="py-2 ">{match.user?.name}</td>

        <td className="px-4 py-2">{match.game}</td>

        <td className="px-4 py-2">
          {match.venue?.name}
        </td>

        <td className="px-4 py-2">{match.date}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center py-4">
        No matches found
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>

          {/* Stats Graph Placeholder */}



  <div className="w-full h-[100px]">
    <StatsChart />
  </div>

        </div>

        {/* Right Section */}
        <div className="col-span-3 space-y-6">
          
          {/* Ongoing Matches */}
          <div className="bg-gray-900 text-white rounded-2xl p-4">
            <h2 className="mb-4">Ongoing Matches</h2>
           <div>Padel Matches: {totalPadelMatches}</div>
          <div> Pickleball Matches: {totalpickleballMatches}</div>
          </div>

          {/* Loyalty Points
          <div className="bg-gray-900 text-white rounded-2xl p-4 text-center">
            <h3 className="mb-2">Manage Loyalty Points</h3>
            <button className="bg-white text-black px-4 py-2 rounded-full mt-2">
              Manage Points
            </button>
          </div> */}

          {/* Booking Composition */}
          <div className="bg-gray-100 rounded-2xl p-4">
            <h3 className="mb-2">Game Booking Composition</h3>
            <p className="text-blue-600">66% Padel</p>
            <p className="text-gray-500">34% Pickleball</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value }:StatCardProps) {
  return (
    <div className="bg-gray-100 rounded-2xl p-4">
      <p className="text-blue-900 text-sm">{title}</p>
      <h2 className="text-xl text-gray-700 font-bold">{value}</h2>
    </div>
  );
}