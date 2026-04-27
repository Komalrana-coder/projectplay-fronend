"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
 phoneNumber: string;
};

export default function ProfilePage() {
  const transactions = [
    {
      id: 1,
      venue: "Grand Oak",
      court: "Court No. 1",
      date: "March 15, 2023",
      time: "07:00 to 15:00",
    },
    {
      id: 2,
      venue: "Sunset Hall",
      court: "Court No. 2",
      date: "April 22, 2023",
      time: "07:00 to 15:00",
    },
    {
      id: 3,
      venue: "Silver Star",
      court: "Court No. 3",
      date: "May 30, 2023",
      time: "07:00 to 15:00",
    },
    {
      id: 4,
      venue: "Emerald Arena",
      court: "Court No. 4",
      date: "June 10, 2023",
      time: "07:00 to 15:00",
    },
  ];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
  const fetchProfile = async () => {
 const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

     if (!token) return; 
    const res = await fetch("http://localhost:8000/api/user/profile", {
      headers: {
       Authorization:  `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("PROFILE DATA:", data);
    setUser(data);
  };

  fetchProfile();
}, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT SIDE - PROFILE */}
        <div className="col-span-4 bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>

          {/* Image */}
          <div className="relative">
            <img
              src="/profile.jpg"
              alt="profile"
              className="w-full h-52 object-cover rounded-xl"
            />
            <button className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full text-sm shadow flex items-center gap-1">
              ✏️ Change Image
            </button>
          </div>

          {/* Form */}
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                className="w-full mt-1 p-2 border rounded-full bg-gray-50"
                value={user?.name||""}
                
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <input
                className="w-full mt-1 p-2 border rounded-full bg-gray-50"
               value={user?.phoneNumber}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email Address</label>
              <input
                className="w-full mt-1 p-2 border rounded-full bg-gray-50"
              value={user?.email}
              />
            </div>

            <button className="w-full bg-blue-900 text-white py-2 rounded-full mt-3">
              Save
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - TRANSACTIONS */}
        <div className="col-span-8 bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Transactions</h2>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Sr No</th>
                  <th className="p-3 text-left">Venue</th>
                  <th className="p-3 text-left">Court</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`cursor-pointer ${
                      selectedId === item.id
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.venue}</td>
                    <td className="p-3">{item.court}</td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3">{item.time}</td>
                    <td className="p-3 text-center">
                      <button className="text-red-500 hover:text-red-700"></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
