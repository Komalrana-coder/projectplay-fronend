"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import PadelBookingModal from "@/app/_component/padelBookingModal/page";

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
  };
  venue?: {
    name: string;
    address: string;
  };
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

  const [openModal, setOpenModal] = useState(false);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/matches/getAllMatches?page=${page}&limit=5&search=${search}`,


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

  return (
    <div className="min-h-screen w-full  bg-gray-100 p-4 md:p-6">
      <h4 className="w-full flex text-xl md:text-2xl font-semibold">
        Open Matches
      </h4>
      <div className=" flex flex-col  gap-3 mb-4">
        <div className="w-full flex item-center md:flex-row md:items-center gap-2">
          <div className="flex-1 gap-2 mt-2"></div>
          <div className="flex gap-2">
            <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
              Game
            </button>

            <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
              Select a date
            </button>
          </div>
        </div>
      </div>
      <div className=" flex w-full  gap-6 transition-all duration-300">
        <div
          className={`bg-gray-200 rounded-xl p-4 overflow-x-auto shadow transition-all duration-300 ${
            selectedMatch ? "w-2/3" : "w-full"
          }`}
        >
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-xl font-semibold">Upcoming Matches</h4>
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

          <div className=" flex justify-between w-full text-sm font-semibold text-gray-600 ">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="text-left px-4 py-2">Name Creater</th>
                  <th className="text-left px-4 py-2">People Joined</th>
                  <th className="text-left px-4 py-2">Game</th>
                  <th className="text-left px-4 py-2">Venue</th>
                  <th className="text-left px-4 py-2">Date&Time</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <tr
                      key={match._id}
                      onClick={() => setSelectedMatch(match)}
                      className="border-b hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-4 py-2">
                        {match.user?.name || "Unknown"}
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
                        <button className="bg-blue-600 text-white px-3 py-1 rounded">
                          completed
                        </button>
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
          <div className="max-w-md mx-auto bg-gray-100 rounded-2xl p-3 shadow-md">
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
                <h2 className="text-lg font-semibold">Padel Game</h2>
                <span className="text-sm text-gray-600">120 Mins</span>
              </div>

              {/* Location */}
              <p className="text-sm text-gray-600">Sector 24, Chandigarh</p>

              {/* Date + Time */}
              <div className="flex justify-between text-sm text-gray-500">
                <span> 17 Sept 2024</span>
                <span> 09:00 AM</span>
              </div>

              {/* Created By */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created By</span>
                <div className="flex items-center gap-2">
                  <Image
                    src="/match1.jpg"
                    alt="match"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="text-sm">Alex Parker</span>
                </div>
              </div>

              {/* Players */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Players</span>
                <span>3</span>
              </div>

              {/* Equipment */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Equipment Rented</span>
                <span>None</span>
              </div>

              {/* Players Section */}
              <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                <p className="text-sm mb-3 text-gray-600">
                  Players in the game
                </p>

                <div className="flex justify-between items-center">
                  {/* Team 1 */}
                  <div className="flex gap-2">
                    <div className="text-center">
                      <Image
                        src="/p1.jpg"
                        alt="player"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <p className="text-xs mt-1">Wren Lee</p>
                    </div>

                    <div className="text-center">
                      <Image
                        src="/p2.jpg"
                        alt="player"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <p className="text-xs mt-1">Emerson White</p>
                    </div>
                  </div>

                  {/* VS */}
                  <span className="text-xs text-gray-500">VS</span>

                  {/* Team 2 */}
                  <div className="flex gap-2">
                    <div className="text-center">
                      <Image
                        src="/p3.jpg"
                        alt="player"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <p className="text-xs mt-1">Taylor Davis</p>
                    </div>

                    <div className="text-center">
                      <Image
                        src="/p4.jpg"
                        alt="player"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <p className="text-xs mt-1">Bailey Allen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => setOpenModal(true)}
                className="w-full bg-blue-900 text-white py-3 rounded-full font-medium hover:bg-blue-800 transition"
              >
                join game
              </button>
              {openModal && (
                <PadelBookingModal onClose={() => setOpenModal(false)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
