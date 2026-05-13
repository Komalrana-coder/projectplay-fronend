"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookingModal from "@/app/_component/playerModal/page";
type Player = {
  name: string;
  email?: string;
} ;
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
    image: string;
  };
  venue?: {
    name: string;
    address: string;
  };
  players: (Player | null)[];
  status: string;
};

export default function matches() {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [playerModal, setPlayerModal] = useState(false);
  const [players, setPlayers] = useState<(Player | null)[]>([]);

  const handleOpenModal = (index: number) => {
    setSelectedIndex(index);
    setPlayerModal(true);
  };

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

  const updatePlayersInDB = async () => {
    try {
      if (!selectedMatch?._id) {
        alert("No match selected");
        return;
      }

      const token = localStorage.getItem("token");

      const updateRes = await fetch(
        `http://localhost:8000/api/matches/updatePlayers/${selectedMatch._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            players: players.filter((p) => p && p.name),
          }),
        },
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) {
        console.error(updateData);
        alert("Failed to update players");
        return;
      }

      console.log("Players updated");

      const filledPlayers = players.filter(
        (p) => p && p.name && p.name.trim() !== "",
      );

      const dynamicAmount = filledPlayers.length * 300;

      const paymentRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: selectedMatch._id,
            amount: dynamicAmount,
          }),
        },
      );

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        alert(paymentData.message || "Payment failed");
        return;
      }

      window.location.href = paymentData.url;
    } catch (error) {
      console.error("ERROR:", error);
      alert("Something went wrong");
    }
  };
  useEffect(() => {
    if (selectedMatch) {
      setPlayers(selectedMatch.players || []);
    }
  }, [selectedMatch]);

 
  return (
    <div className="min-h-screen w-full  bg-white  md:p-2">
      <h4 className="w-full flex text-xl md:text-2xl font-semibold text-blue-900">
        Open Matches
      </h4>
      <div className=" flex flex-col  gap-3 mb-4">
        <div className="w-full flex item-center md:flex-row md:items-center gap-2">
          <div className="flex-1 gap-2 mt-2"></div>
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
            <h4 className="text-xl font-raleway text-blue-900">Upcoming Matches</h4>
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

          <div className=" flex justify-between w-full text-sm font-raleway text-gray-600 ">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="text-left px-4 py-2">Name Creater</th>
                  <th className="text-left px-4 py-2">People Joined</th>
                  <th className="text-left px-4 py-2">Game</th>
                  <th className="text-left px-4 py-2">Venue</th>
                  <th className="text-left px-4 py-2">Date&Time</th>
                  <th className="text-left px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {matches.length > 0 ? (
                  
                  matches.map((match) => (
                 

                    <tr
                      key={match._id}
                      onClick={() => setSelectedMatch(match)}
                      className="border-b hover:bg-blue-500 cursor-pointer"
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-300">
                            
                            {match.user?.image ? (
                             <img src={`http://localhost:8000${match.user?.image}`} 
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
                        {match.players?.filter((p) => p?.name?.trim()).length} /
                        4
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            match.players?.filter((p) => p?.name?.trim())
                              .length === 4
                              ? " text-green-700"
                              : " text-red-600"
                          }`}
                        >
                          {match.players?.filter((p) => p?.name?.trim())
                            .length === 4
                            ? "Full"
                            : "Open"}
                        </span>
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

                {(() => {
                  const playersData = players.some((p) => p !== null)
                    ? players
                    : selectedMatch?.players || [];

                  const totalSlots = 4;

                  const slots = Array.from(
                    { length: 4 },
                    (_, i) => playersData[i] || null,
                  );

                  // split into 2 teams
                  const team1: (Player | null)[] = [slots[0], slots[2]];
                  const team2: (Player | null)[] = [slots[1], slots[3]];

                  return (
                    <div className="flex justify-between items-center">
                      {/* Team 1 */}
                      <div className="flex gap-2">
                        {team1.map((player: Player | null, index) => (
                          <div key={index} className="text-center">
                            {player ? (
                              <>
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                  {player?.name?.charAt(0)}
                                </div>
                                <p className="text-xs mt-1">{player?.name}</p>
                              </>
                            ) : (
                              <>
                                <div
                                  onClick={() =>
                                    handleOpenModal(index === 0 ? 0 : 2)
                                  }
                                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                                >
                                  <span className="text-lg font-bold text-gray-600">
                                    +
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Available
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* VS */}
                      <span className="text-xs text-gray-500">VS</span>

                      {/* Team 2 */}
                      <div className="flex gap-2">
                        {team2.map((player, index) => (
                          <div key={index} className="text-center">
                            {player ? (
                              <>
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                  {player.name.charAt(0)}
                                </div>
                                <p className="text-xs mt-1">{player.name}</p>
                              </>
                            ) : (
                              <>
                                <div
                                  onClick={() =>
                                    handleOpenModal(index === 0 ? 1 : 3)
                                  }
                                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                                >
                                  <span className="text-lg font-bold text-gray-600">
                                    +
                                  </span>
                                </div>
                                <p className="text-xs mt-1 text-gray-500">
                                  Available
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      {playerModal && selectedIndex !== null && (
                        <BookingModal
                          onClose={() => setPlayerModal(false)}
                          onSave={(player) => {
                            setPlayers((prev) => {
                              const updated = [...prev];
                              updated[selectedIndex!] = player;

                              return updated;
                            });

                            setPlayerModal(false);
                          }}
                        />
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  if (!selectedMatch?._id) {
                    alert("No match selected");
                    return;
                  }

                  const filteredPlayers = players.filter(
                    (p) => p && p.name?.trim(),
                  );

                  updatePlayersInDB();
                }}
                className="w-full bg-blue-900 text-white py-3 rounded-full"
              >
                join game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
