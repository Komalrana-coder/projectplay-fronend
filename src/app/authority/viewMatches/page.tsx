"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Match = {
  _id: string;
  game: string;
  date: string;
  timeSlot: string[];
  court?: {
    name: string;
    status: string;
    image?: string;
  };

  duration: number;
  gameType: string;
  user?: {
    name: string;
    email: string;
    phoneNumber: number;
    image: string;
  };
  venue?: {
    name: string;
    address: string;
  };
  status: string;
  players: {
    name: string;
  }[];
};

export default function matches() {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("upcoming");

  const [openModal, setOpenModal] = useState(false);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches/getAllMatches?page=${page}&limit=5&search=${search}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      console.log("MATCHES:", data);

      setMatches(data.matches || data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchMatches();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, page]);
  const today = new Date();

  const filteredMatches = matches.filter((match) => {
    const matchDate = new Date(match.date);

    if (filterType === "upcoming") {
      return matchDate > today;
    }

    if (filterType === "previous") {
      return matchDate < today;
    }
     if (filterType === "all") {
    return true;
  }


    return true;
  });

  return (
  <div className="min-h-screen w-full bg-[#fbfaff] p-2 md:p-4">
    
    {/* Heading */}
    <h4 className="w-full text-xl md:text-2xl text-blue-900 font-semibold mb-4">
      Matches
    </h4>

    {/* Filters */}
    <div className="flex flex-col gap-3 mb-4">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("upcoming")}
            className={`text-sm rounded-full px-4 py-2 transition ${
              filterType === "upcoming"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setFilterType("previous")}
            className={`text-sm rounded-full px-4 py-2 transition ${
              filterType === "previous"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            Previous
          </button>

          <button
            onClick={() => setFilterType("all")}
            className={`text-sm rounded-full px-4 py-2 transition ${
              filterType === "all"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            All Matches
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-72 border rounded-lg px-3 py-2 text-sm bg-white"
        />
      </div>
    </div>

    {/* Main Layout */}
    <div className="flex flex-col xl:flex-row gap-6 w-full">

      {/* Left Table */}
      <div
        className={`bg-gray-100 rounded-xl p-4 overflow-hidden shadow transition-all duration-300 ${
          selectedMatch ? "xl:w-2/3 w-full" : "w-full"
        }`}
      >

        <div className="mb-4 flex justify-between items-center">
          <h4 className="text-lg md:text-xl font-Raleway text-blue-900">
            Upcoming Matches
          </h4>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto w-full">

          <table className="min-w-[900px] xl:min-w-full bg-white rounded-xl overflow-hidden shadow">

            <thead className="bg-gray-200 text-gray-700 text-sm">
              <tr>
                <th className="text-left px-4 py-3">Name of Creator</th>
                <th className="text-left px-4 py-3">Names of Team</th>
                <th className="text-left px-4 py-3">Game</th>
                <th className="text-left px-4 py-3">Venue</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <tr
                    key={match._id}
                    onClick={() => setSelectedMatch(match)}
                    className="border-b hover:bg-blue-50 cursor-pointer transition"
                  >
                    {/* Creator */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[180px]">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                          {match.user?.image ? (
                            <img
                              src={match.user?.image}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                              {match.user?.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>

                        <span className="truncate">
                          {match.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="px-4 py-3 min-w-[220px]">
                      {match.players?.map((p: any) => (
                        <span key={p.email}>{p.name}, </span>
                      ))}
                    </td>

                    {/* Game */}
                    <td className="px-4 py-3">{match.game}</td>

                    {/* Venue */}
                    <td className="px-4 py-3 min-w-[180px]">
                      {match.court?.name} ({match.venue?.name})
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {match.date}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                          match.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {match.status === "completed"
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No matches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
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

      {/* Right Side Card */}
      {selectedMatch && (
        <div className="w-full xl:w-[380px] flex-shrink-0">

          <div className="bg-gray-100 rounded-2xl p-3 shadow-md">

            {/* Image */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden">
              <Image
                src="/image12.svg"
                alt="Padel Game"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-3 space-y-4">

              {/* Title */}
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg font-semibold break-words">
                  {selectedMatch.game}
                </h2>

                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {selectedMatch.duration} mins
                </span>
              </div>

              {/* Address */}
              <p className="text-sm text-gray-600 break-words">
                {selectedMatch.venue?.address}
              </p>

              {/* Date */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm text-gray-500">
                <span>{selectedMatch.date}</span>

                <span className="break-words">
                  {selectedMatch.timeSlot?.join(", ")}
                </span>
              </div>

              {/* Created By */}
              <div className="flex justify-between gap-2">
                <span className="text-sm text-gray-600">
                  Created By
                </span>

                <span className="text-sm text-right break-words">
                  {selectedMatch.user?.name || "Unknown"}
                </span>
              </div>

              {/* Players */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Players</span>
                <span>{selectedMatch.players.length}</span>
              </div>

              {/* Players Section */}
              <div className="bg-white rounded-xl p-4 shadow-sm">

                <p className="text-sm mb-4 text-center text-gray-600">
                  Players in the game
                </p>

                <div className="grid grid-cols-2 gap-6">

                  {selectedMatch?.players?.map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        {p.name?.charAt(0).toUpperCase()}
                      </div>

                      <p className="text-xs mt-2 break-words">
                        {p.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button */}
              <button className="w-full bg-blue-900 text-white py-3 rounded-full font-medium hover:bg-blue-800 transition">
                Cancel Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
  
}
