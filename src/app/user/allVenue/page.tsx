"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Player = {
  name: string;
  email: string;
};

type Match = {
  game: string;
  duration: number;
  gameType: string;
  players: Player[];
  venue?: { name: string };
  court?: { name: string };
};

export default function Venue() {
  const router = useRouter();
  const [venue, setVenue] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]); 

  console.log("venue", venue);

  const fetchVenue = async () => {
    const res = await fetch(
     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/venue/getVenue?page=${page}&limit=10&search=${search}`,
    );
    const data = await res.json();
    setVenue(data.venue || []);
    setTotalPages(data.totalPages || 1);
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchVenue();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, page]);
 


const fetchMyBooking = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches/getMyBooking`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("API RESPONSE:", data); 
    console.log("TOKEN:", token);
  setMatches(data.data || []);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
useEffect(() => {
  fetchMyBooking();
}, []);

 return (
  <div className="min-h-screen bg-white py-4 px-3 md:px-6">

    {/* Main Grid */}
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">

      {/* LEFT SIDE */}
      <div className="xl:col-span-7 w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

          <h1 className="text-2xl font-semibold text-blue-900">
            All Venues
          </h1>

          <div className="w-full md:w-auto">
            <input
              placeholder="Search"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-72 px-4 py-2 rounded-full bg-gray-100 outline-none"
            />
          </div>
        </div>

        {/* Venue Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {venue?.map((venue: any) => (
            <div
              key={venue._id}
              onClick={() =>
                router.push(`/user/bookVenue/${venue._id}`)
              }
              className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              {/* Image */}
              <div className="relative w-full h-40">
                <Image
                  src={venue.image}
                  alt="venue"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm md:text-base font-semibold text-gray-800">
                  {venue.name}
                </h3>

                <p className="text-xs md:text-sm text-gray-500">
                  {venue.city}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6 flex-wrap">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="xl:col-span-5 w-full bg-gray-50 rounded-2xl p-4">

        {/* Heading */}
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">
          My Bookings
        </h3>

        {/* Date */}
        <div className="text-gray-500 text-sm mb-4 border-t border-dashed pt-3">
          Nov 10, 2024 | 08:00 A.M.
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">

          {matches && matches.length > 0 ? (
            matches.map((item: any, i: number) => (
              <div
                key={item._id || i}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
              >

                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">

                  <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                    <span>🎾</span>

                    <span>{item.game || "Game"}</span>

                    <span>•</span>

                    <span>
                      {item.duration
                        ? `${item.duration} min`
                        : "N/A"}
                    </span>
                  </div>

                  <span className="text-gray-400 text-sm">
                    {item.gameType || "Friendly"}
                  </span>
                </div>

                {/* Players */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* Team 1 */}
                  <div className="flex flex-wrap gap-2">
                    {item.players && item.players.length > 0 ? (
                      item.players
                        .slice(0, 2)
                        .map((p: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {p?.name || "Player"}
                          </span>
                        ))
                    ) : (
                      <span>No players</span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block h-12 w-[1px] bg-gray-300"></div>

                  {/* Team 2 */}
                  <div className="flex flex-wrap gap-2">
                    {item.players && item.players.length > 2 ? (
                      item.players
                        .slice(2, 4)
                        .map((p: any, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                          >
                            {p?.name || "Player"}
                          </span>
                        ))
                    ) : (
                      <span>Available</span>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-gray-500 text-sm mt-4 border-t pt-3">

                  <span>📍</span>

                  <span>
                    {item.court?.name || "Court"} (
                    {item.venue?.name || "Venue"})
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No bookings found
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);
}


