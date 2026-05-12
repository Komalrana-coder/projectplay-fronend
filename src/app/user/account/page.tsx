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

      const res = await fetch("http://localhost:8000/api/user/profile", {
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
        "http://localhost:8000/api/matches/getMyBooking",
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

      const res = await fetch("http://localhost:8000/api/user/update-profile", {
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
    <div className="min-h-screen bg-white p-6">
        <div className="w-full flex item-center md:flex-row md:items-center gap-2">

         <div className="flex gap-2 py-4 ">
         <div className=" text-blue-900 font-semibold text-2xl  px-4">
           Profile
           </div>
            
            <div className="text-blue-900 font-semibold text-2xl ml-[360]">
          Transactions
           </div>
            

           
          </div>
        </div>
        
      <div className="grid grid-cols-12 gap-6">

        
        {/* LEFT SIDE */}
        <div className="col-span-4 bg-gray-100 rounded-2xl shadow p-5">


          <div className="relative">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : user?.image
                    ? `http://localhost:8000${user.image}`
                    : "/profile.jpg"
              }
              alt="profile"
              className="w-full h-52 object-cover rounded-xl"
            />

            {/* Hidden file input */}
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

            {/* Button */}
            <button
              type="button"
              onClick={() => document.getElementById("profileUpload")?.click()}
              className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-full text-sm shadow"
            >
              ✏️ Change Image
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <input
                className="w-full mt-1 p-2 border rounded-full bg-white"
                value={user?.name || ""}
                onChange={(e) =>
                  setUser((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <input
                className="w-full mt-1 p-2 border rounded-full bg-white"
                value={user?.phoneNumber || ""}
                onChange={(e) =>
                  setUser((prev) =>
                    prev ? { ...prev, phoneNumber: e.target.value } : prev,
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                className="w-full mt-1 p-2 border rounded-full bg-white"
                value={user?.email || ""}
                onChange={(e) =>
                  setUser((prev) =>
                    prev ? { ...prev, email: e.target.value } : prev,
                  )
                }
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-blue-900 text-white py-2 rounded-full mt-3"
            >
              Save
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-8 bg-gray-100 rounded-2xl shadow p-5">
         

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm bg-white">
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
                      className={`cursor-pointer ${
                        selectedId === i
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{item.venue?.name || "N/A"}</td>
                      <td className="p-3">{item.court?.name || "N/A"}</td>
                      <td className="p-3">{item.date || "N/A"}</td>
                      <td className="p-3">
                        {item.timeSlot?.join(", ") || "N/A"}
                      </td>
                      <td className="px-4 py-2">
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
                    <td colSpan={6} className="text-center p-4 text-gray-500">
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
