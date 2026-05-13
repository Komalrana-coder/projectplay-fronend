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
    <div className="min-h-screen w-full  bg:fbfaff md:p-2">
      <h4 className="w-full flex text-xl md:text-2xl text-blue-900 font-semibold ">
        Matches
      </h4>
      <div className=" flex flex-col  gap-3 mb-4">
        <div className="w-full flex item-center md:flex-row md:items-center gap-2">
          <div className="flex-1 gap-2 mt-2">
            <button
              onClick={() => setFilterType("upcoming")}
              className={`text-sm rounded-full px-4 py-2 ${
                filterType === "upcoming"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterType("previous")}
              className={`text-sm rounded-full px-4 py-2 ${
                filterType === "previous"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              Previous
            </button>
           <button
  onClick={() => setFilterType("all")}
  className={`text-sm rounded-full px-4 py-2 ${
    filterType === "all"
      ? "bg-blue-900 text-white"
      : "bg-white text-gray-900"
  }`}
>
  All Matches
</button>
          </div>
          <div className="flex gap-2">
            {/* <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
                Game          
            </button>
              
           <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
             Select a date
             </button> */}
          </div>
        </div>
      </div>
      <div className=" flex w-full  gap-6 transition-all duration-300">
        <div
          className={`bg-gray-100 rounded-xl p-4 overflow-x-auto shadow transition-all duration-300 ${
            selectedMatch ? "w-2/3" : "w-full"
          }`}
        >
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-xl font-Raleway text-blue-900">
              Upcoming Matches
            </h4>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="md:w-1/3  border rounded-lg px-3 bg-white py-2 text-sm"
            />
          </div>

          <div className=" flex justify-between w-full text-sm font-Raleway text-gray-600 ">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="text-left px-4 py-2">Name of Creater</th>
                  <th className="text-left px-4 py-2">Names of team </th>
                  <th className="text-left px-4 py-2">Game</th>
                  <th className="text-left px-4 py-2">Venue</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map((match) => (
                    <tr
                      key={match._id}
                      onClick={() => setSelectedMatch(match)}
                      className="border-b hover:bg-blue-500 cursor-pointer"
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-300">
                            {match.user?.image ? (
                              <img
                                src={`http://localhost:8000${match.user?.image}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                                {match.user?.name?.charAt(0) || "U"}
                              </div>
                            )}
                          </div>

                          <span>{match.user?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {match.players?.map((p: any) => (
                          <span key={p.email}>{p.name}, </span>
                        )) || "Unknown"}
                      </td>

                      <td className="px-4 py-2">{match.game}</td>

                      <td className="px-4 py-2">
                        {match.court?.name}({match.venue?.name})
                      </td>

                      <td className="px-4 py-2">{match.date}</td>

                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
          {/* pagination */}
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
                  page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
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

        {/* right */}
        {selectedMatch && (
          <div className="w-full max-w-md mx-auto bg-gray-100 rounded-2xl p-3 shadow-md">
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
            <div className="p-3 space-y-3">
              {/* Title + Duration */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold"> {selectedMatch.game}</h2>
                <span className="text-sm text-gray-600">
                  {" "}
                  {selectedMatch.duration} mins
                </span>
              </div>

              {/* Location */}
              <p className="text-sm text-gray-600">
                {selectedMatch.venue?.address}
              </p>

              {/* Date + Time */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{selectedMatch.date}</span>
                <span> {selectedMatch.timeSlot?.join(", ")}</span>
              </div>

              {/* Created By */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created By</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {selectedMatch.user?.name || "Unknown"}
                  </span>
                </div>
              </div>

              {/* Players */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Players</span>
                <span>{selectedMatch.players.length}</span>
              </div>

              {/* Players Section */}
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <p className="text-sm mb-3 text-gray-600">
                  Players in the game
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className="flex justify-between items-center p-3">
                      {/* Team 1 */}
                      <div className="flex  gap-9">
                        {selectedMatch?.players?.slice(0, 2).map((p, i) => (
                          <div key={i} className="flex flex-col items-center">
                            {/* Circle Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                              {p.name?.charAt(0).toUpperCase()}
                            </div>

                            {/* Full Name */}
                            <p className="text-xs mt-1 text-center">{p.name}</p>
                          </div>
                        ))}
                      </div>

                      {/* Team 2 */}
                      <div className="flex m-9 gap-9">
                        {selectedMatch?.players?.slice(2, 4).map((p, i) => (
                          <div key={i} className="flex flex-col items-center">
                            {/* Circle Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                              {p.name?.charAt(0).toUpperCase()}
                            </div>

                            {/* Full Name */}
                            <p className="text-xs mt-1 text-center">{p.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button className="w-full bg-blue-900 text-white py-3 rounded-full font-medium hover:bg-blue-800 transition">
                Cancel Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
