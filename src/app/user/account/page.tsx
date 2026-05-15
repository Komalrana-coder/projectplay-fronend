"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type User = {
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
};

type Player = {
  name: string;
  email: string;
};

type Match = {
  _id?: string;
  game: string;
  duration: number;
  gameType: string;
  players: Player[];
  venue?: { name: string };
  court?: { name: string };
  date?: string;
  timeSlot?: string[];
  status: string;
  image: string;
};

export default function ProfilePage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("API RESPONSE 👉", data);
      setUser(data);
    };

    fetchProfile();
  }, []);

  const fetchMyBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches/getMyBooking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setMatches(data.data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMyBooking();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", user?.name || "");
      formData.append("email", user?.email || "");
      formData.append("phoneNumber", user?.phoneNumber || "");

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log("UPDATED RESPONSE ", data);

      if (res.ok) {
        setUser(data.data);
         toast.success("User Updated");
      } else {
        console.error(data.message);
          toast.error("Failed to update")
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
  <div className="min-h-screen bg-white p-3 md:p-6">

  {/* Main Grid */}
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

    {/* LEFT SIDE - PROFILE */}
    <div className="xl:col-span-4 bg-gray-100 rounded-2xl shadow p-4 md:p-5">

      {/* Heading */}
      <h2 className="text-blue-900 font-semibold text-2xl mb-5">
        Profile
      </h2>

      {/* Profile Image */}
      <div className="relative">

        <img
          src={
            image
              ? URL.createObjectURL(image)
              : user?.image || "/profile.jpg"
          }
          alt="profile"
          className="w-full h-52 md:h-64 object-cover rounded-xl"
        />

        <input
          type="file"
          accept="image/*"
          id="profileUpload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(file);
          }}
        />

        <button
          type="button"
          onClick={() =>
            document.getElementById("profileUpload")?.click()
          }
          className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full text-sm shadow"
        >
          ✏️ Change Image
        </button>
      </div>

      {/* Form */}
      <div className="mt-5 space-y-4">

        <div>
          <label className="text-sm text-gray-500">
            Name
          </label>

          <input
            className="w-full mt-1 p-3 border rounded-full bg-white text-sm"
            value={user?.name || ""}
            onChange={(e) =>
              setUser((prev) =>
                prev
                  ? { ...prev, name: e.target.value }
                  : prev
              )
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Phone
          </label>

          <input
            className="w-full mt-1 p-3 border rounded-full bg-white text-sm"
            value={user?.phoneNumber || ""}
            onChange={(e) =>
              setUser((prev) =>
                prev
                  ? {
                      ...prev,
                      phoneNumber: e.target.value,
                    }
                  : prev
              )
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Email
          </label>

          <input
            className="w-full mt-1 p-3 border rounded-full bg-white text-sm"
            value={user?.email || ""}
            onChange={(e) =>
              setUser((prev) =>
                prev
                  ? { ...prev, email: e.target.value }
                  : prev
              )
            }
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-900 text-white py-3 rounded-full mt-3"
        >
          Save
        </button>
      </div>
    </div>

    {/* RIGHT SIDE - TRANSACTIONS */}
    <div className="xl:col-span-8 bg-gray-100 rounded-2xl shadow p-4 md:p-5 overflow-hidden">

      {/* Heading */}
      <h2 className="text-blue-900 font-semibold text-2xl mb-5">
        Transactions
      </h2>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">

        <table className="min-w-[750px] w-full text-sm bg-white">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Sr No</th>
              <th className="p-3 text-left">Venue</th>
              <th className="p-3 text-left">Court</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-center">Payment</th>
            </tr>
          </thead>

          <tbody>
            {matches.length > 0 ? (
              matches.map((item, i) => (
                <tr
                  key={item._id || i}
                  onClick={() => handleSelect(i)}
                  className={`cursor-pointer transition ${
                    selectedId === i
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="p-3">{i + 1}</td>

                  <td className="p-3">
                    {item.venue?.name || "N/A"}
                  </td>

                  <td className="p-3">
                    {item.court?.name || "N/A"}
                  </td>

                  <td className="p-3">
                    {item.date || "N/A"}
                  </td>

                  <td className="p-3 min-w-[180px]">
                    {item.timeSlot?.join(", ") || "N/A"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-4 text-gray-500"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  );
}
