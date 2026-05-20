"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import BookingModal from "@/app/_component/playerModal/page";

type Court = {
  _id: string;
  name: string;
};
type Player = {
  name: string;
};



export default function BookingPage() {
  const router = useRouter();
  const [game, setGame] = useState<"padel" | "pickleball">("padel");
  const [gameType, setGameType] = useState<"public" | "private">("public");

  const [date, setDate] = useState<string>("");

  const [courts, setCourts] = useState<Court[]>([]);
  const [selected, setSelected] = useState<{
    [key: string]: number;
  }>({});
  const [timeSlot, setTimeSlot] = useState<string[]>([]);
  const [players, setPlayers] = useState<(Player | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [playerModal, setPlayerModal] = useState(false);

  const toggleSlot = (time: string) => {
    setTimeSlot((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const handleSelect = (courtId: string, mins: number) => {
    setSelected({
      [courtId]: mins,
    });
  };

  const handleOpenModal = (index: number) => {
    setSelectedIndex(index);
    setPlayerModal(true);
  };
  const params = useParams();
  const id = params?.id as string;

  console.log("id", id);

  useEffect(() => {
    if (!id) return;
    console.log("id", id);
    const fetchCourt = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/venue/getSingleVenue/${id}`,
        );
        const data = await res.json();

        console.log("VENUE DATA:", data);

        setCourts(data?.data?.courts || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourt();
  }, [id]);
  const courtId = Object.keys(selected)[0];
  const duration = selected[courtId];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayName = (day: number) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const timeSlots = ["06:00", "07:00", "08:00", "09:00", "10:00", "11:00"];

  const handleBookingAndPayment = async () => {
    try {
      const token = localStorage.getItem("token");

      const bookingRes = await fetch(
        "http://localhost:8000/api/matches/createBooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            game,
            timeSlot,
            gameType,
            date,
            courtId,
            duration,
            players: players.filter(Boolean),
          }),
        },
      );

      const bookingData = await bookingRes.json();

      console.log("FULL RESPONSE:", bookingData);

      if (!bookingRes.ok) {
        toast.error(bookingData.message || "Booking failed");
        return;
      }

      toast.success("Booking created");

      const bookingId = bookingData?.booking?._id;

      console.log("BOOKING ID:", bookingId);

      const filledPlayers = players.filter(
        (p: any) => p && p.name && p.name.trim() !== "",
      );
      const dynamicAmount = filledPlayers.length * 300;

      const paymentRes = await fetch(
        "http://localhost:8000/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: bookingId,
            amount: dynamicAmount,
          }),
        },
      );

      const paymentData = await paymentRes.json();

      if (paymentRes.ok) {
        window.location.href = paymentData.url;
      } else {
        toast.error(paymentData.message || "Payment failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 grid grid-cols-12 gap-4">
      {/* LEFT SIDE */}
      <div className="col-span-8 space-y-4">
        <div className="bg-gray-100 rounded-2xl p-4">
          <h2 className="text-gray-700 font-semibold mb-3">Select Game</h2>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setGame("padel")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                game === "padel"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              Padel
            </button>
            <button
              onClick={() => setGame("pickleball")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                game === "pickleball"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              Pickleball
            </button>
          </div>
        </div>
        
        {/* Date */}
        <div className="bg-gray-100 rounded-2xl p-4">
          <h2 className="text-gray-700 font-semibold mb-3">Dates</h2>

          <div className="flex gap-2 overflow-x-auto">
            {dates.map((day) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              let tempYear = year;
              let tempMonth = month;

              let selectedDate = new Date(tempYear, tempMonth, day);
              selectedDate.setHours(0, 0, 0, 0);

              // 🔥 If selected date is in past → move to next month
              if (selectedDate < today) {
                tempMonth += 1;

                if (tempMonth > 11) {
                  tempMonth = 0;
                  tempYear += 1;
                }

                selectedDate = new Date(tempYear, tempMonth, day);
              }

              const fullDate = selectedDate.toLocaleDateString("en-CA");


              return (
                <button
                  key={day}
                  onClick={() => setDate(fullDate)}
                  className={`px-3 py-2 rounded-md text-center min-w-[60px] ${
                    date === fullDate ? "bg-blue-900 text-white" : "bg-white"
                  }`}
                >
                  <div className="text-xs">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                  <div className="font-semibold">{day}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* court */}
        <div className="bg-gray-100 rounded-xl p-2">
          <h2 className="text-lg font-semibold mb-4">Select a court</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courts.map((court) => (
              <div key={court._id} className="bg-white p-4 rounded-xl shadow">
                {/* Court Name */}
                <h3 className="mb-3 font-medium">{court.name}</h3>

                {/* Duration Buttons */}
                <div className="flex gap-3">
                  {[60, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSelect(court._id, mins)}
                      className={`px-4 py-2 rounded border ${
                        selected[court._id] === mins
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots
        <div className="bg-white ">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((court) => (
              <div key={court} className="bg-gray-100 rounded-2xl p-5">
                <h3 className="text-gray-700 font-semibold mb-4">Time</h3>

                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => {
                    const isSelected = timeSlot.includes(`${court}-${time}`);

                    return (
                      <button
                        key={time}
                        onClick={() => toggleSlot(`${court}-${time}`)}
                        className={`rounded-lg py-3 text-center transition ${
                          isSelected
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-600"
                        }`}
                      >
                        <div className="font-medium">{time}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Time Slots */}
<div className="bg-white">
  <div className="bg-gray-100 rounded-2xl p-5">
    <h3 className="text-gray-700 font-semibold mb-4">
      Select Time Slot
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {timeSlots.map((time) => {
        const isSelected = timeSlot.includes(time);

        return (
          <button
            key={time}
            onClick={() => toggleSlot(time)}
            className={`rounded-lg py-3 text-center transition ${
              isSelected
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            <div className="font-medium">{time}</div>
          </button>
        );
      })}
    </div>
  </div>
</div>


        

        {/* Game Type */}
        <div className="bg-white">
          <div className="bg-gray-100 rounded-2xl p-5">
            {/* Title */}
            <h2 className="text-gray-700 font-semibold mb-4">Game Type</h2>
            {/* Toggle */}
            <div className="flex bg-white rounded-xl p-1 mb-6">
              <button
                onClick={() => setGameType("public")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  gameType === "public"
                    ? "bg-blue-900 text-white"
                    : "text-gray-500"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setGameType("private")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  gameType === "private"
                    ? "bg-blue-900 text-white"
                    : "text-gray-500"
                }`}
              >
                Private
              </button>
            </div>

            {/* Players Row */}
            <div className="flex items-center justify-between">
              {players.map((player, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 border text-lg font-semibold mb-2">
                    {player ? (
                      player.name.charAt(0)
                    ) : (
                      <button onClick={() => handleOpenModal(index)}>+</button>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {player?.name || "Available"}
                  </p>
                </div>
              ))}

              {/* Modal */}
              {playerModal && selectedIndex !== null && (
                <BookingModal
                  onClose={() => setPlayerModal(false)}
                  onSave={(player) => {
                    if (selectedIndex === null) return;

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
          </div>
        </div>

        {/*Continue */}
        <button
          className="w-full bg-blue-700 text-white py-3 rounded-lg"
          // onClick={handleAddBooking}
          onClick={handleBookingAndPayment}
        >
          Continue
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="col-span-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          {/* <h2 className="font-semibold text-lg">Name of the court</h2>
          <p className="text-sm text-gray-500 mb-3">Flexi Tower Mohali</p>

          <p className="text-sm text-gray-500 mb-3">
            Court information goes here. Clean and simple description.
          </p> */}

          <div className="text-sm mb-3">
            <p className="font-medium">Opening Hours</p>
            <p>Mon-Fri: 6:00 AM - 10:00 PM</p>
          </div>

          {/* <div className="flex gap-2 flex-wrap mb-4">
            Special Access
           Equipment Rental
            Parking
      </div>  */}

          <div className="flex gap-2">
            <button className="flex-1 bg-gray-200 py-2 rounded">
              Directions
            </button>
            <button className="flex-1 bg-blue-700 text-white py-2 rounded">
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
