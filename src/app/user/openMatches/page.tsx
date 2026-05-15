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

  const updatePlayersInDB = async () => {
    try {
      if (!selectedMatch?._id) {
        alert("No match selected");
        return;
      }

      const token = localStorage.getItem("token");

      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/updatePlayers/${selectedMatch._id}`,
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
    <div className="min-h-screen w-full bg-white p-2 md:p-4">
  {/* Heading */}
  <h4 className="w-full text-xl md:text-2xl font-semibold text-blue-900 mb-4">
    Open Matches
  </h4>

  <div className="flex flex-col gap-6 lg:flex-row transition-all duration-300">
    {/* LEFT SECTION */}
    <div
      className={`bg-gray-100 rounded-xl p-3 md:p-4 overflow-hidden shadow transition-all duration-300 ${
        selectedMatch ? "w-full lg:w-2/3" : "w-full"
      }`}
    >
      {/* Search */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h4 className="text-lg md:text-xl font-raleway text-blue-900">
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
          className="w-full sm:w-72 border rounded-lg px-3 py-2 text-sm bg-white"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-[800px] w-full bg-white rounded-xl overflow-hidden shadow">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="text-left px-4 py-3">Name Creator</th>
              <th className="text-left px-4 py-3">People Joined</th>
              <th className="text-left px-4 py-3">Game</th>
              <th className="text-left px-4 py-3">Venue</th>
              <th className="text-left px-4 py-3">Date & Time</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {matches.length > 0 ? (
              matches.map((match) => (
                <tr
                  key={match._id}
                  onClick={() => setSelectedMatch(match)}
                  className="border-b hover:bg-blue-50 cursor-pointer transition"
                >
                  {/* USER */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                        {match.user?.image ? (
                          <img
                            src={match.user.image}
                            alt="user"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold">
                            {match.user?.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>

                      <span className="whitespace-nowrap">
                        {match.user?.name || "Unknown"}
                      </span>
                    </div>
                  </td>

                  {/* PLAYERS */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {match.players?.filter((p) => p?.name?.trim()).length}/4

                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full font-semibold ${
                        match.players?.filter((p) => p?.name?.trim()).length ===
                        4
                          ? "text-green-700 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {match.players?.filter((p) => p?.name?.trim()).length ===
                      4
                        ? "Full"
                        : "Open"}
                    </span>
                  </td>

                  {/* GAME */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {match.game}
                  </td>

                  {/* VENUE */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {match.court?.name} ({match.venue?.name})
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {match.date}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${
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

      {/* PAGINATION */}
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

    {/* RIGHT SIDE CARD */}
    {selectedMatch && (
      <div className="w-full lg:w-1/3">
        <div className="bg-gray-100 rounded-2xl p-3 shadow-md sticky top-4">
          {/* IMAGE */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden">
            <Image
              src="/image12.svg"
              alt="Padel Game"
              fill
              className="object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="p-2 md:p-3 space-y-4">
            {/* TITLE */}
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-lg font-semibold break-words">
                {selectedMatch.game}
              </h2>

              <span className="text-sm text-gray-600 whitespace-nowrap">
                {selectedMatch.duration} mins
              </span>
            </div>

            {/* ADDRESS */}
            <p className="text-sm text-gray-600 break-words">
              {selectedMatch.venue?.address}
            </p>

            {/* DATE */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm text-gray-500">
              <span>{selectedMatch.date}</span>
              <span>{selectedMatch.timeSlot?.join(", ")}</span>
            </div>

            {/* CREATED BY */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Created By</span>

              <span className="text-sm">
                {selectedMatch.user?.name || "Unknown"}
              </span>
            </div>

            {/* PLAYERS */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Players</span>
              <span>{selectedMatch.players.length}</span>
            </div>

            {/* PLAYER SECTION */}
            <div className="bg-white rounded-xl p-3 text-center shadow-sm overflow-hidden">
              <p className="text-sm mb-4 text-gray-600">
                Players in the game
              </p>

              {(() => {
                const playersData = players.some((p) => p !== null)
                  ? players
                  : selectedMatch?.players || [];

                const slots = Array.from(
                  { length: 4 },
                  (_, i) => playersData[i] || null
                );

                const team1 = [slots[0], slots[2]];
                const team2 = [slots[1], slots[3]];

                return (
                  <div className="flex items-center justify-between gap-2">
                    {/* TEAM 1 */}
                    <div className="flex gap-2">
                      {team1.map((player, index) => (
                        <div key={index} className="text-center">
                          {player ? (
                            <>
                              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                {player?.name?.charAt(0)}
                              </div>

                              <p className="text-xs mt-1 max-w-[60px] truncate">
                                {player?.name}
                              </p>
                            </>
                          ) : (
                            <>
                              <div
                                onClick={() =>
                                  handleOpenModal(index === 0 ? 0 : 2)
                                }
                                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                              >
                                +
                              </div>

                              <p className="text-xs text-gray-500">
                                Available
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <span className="text-xs text-gray-500">VS</span>

                    {/* TEAM 2 */}
                    <div className="flex gap-2">
                      {team2.map((player, index) => (
                        <div key={index} className="text-center">
                          {player ? (
                            <>
                              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                {player?.name?.charAt(0)}
                              </div>

                              <p className="text-xs mt-1 max-w-[60px] truncate">
                                {player?.name}
                              </p>
                            </>
                          ) : (
                            <>
                              <div
                                onClick={() =>
                                  handleOpenModal(index === 0 ? 1 : 3)
                                }
                                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                              >
                                +
                              </div>

                              <p className="text-xs text-gray-500">
                                Available
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* BUTTON */}
            <button
              onClick={() => {
                if (!selectedMatch?._id) {
                  alert("No match selected");
                  return;
                }

                updatePlayersInDB();
              }}
              className="w-full bg-blue-900 text-white py-3 rounded-full hover:bg-blue-800 transition"
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
}
