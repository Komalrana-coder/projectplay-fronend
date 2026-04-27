"use client";
import { useState } from "react";

type Player = {
  name: string;
  email: string;
};

type Props = {
  onClose: () => void;
  onSave: (user: Player) => void;
};

export default function BookingModal({ onSave, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userExists, setUserExists] = useState(false);

  const checkUser = async (email: string) => {
    if (!email) return;

    const res = await fetch(
      "http://localhost:8000/api/matches/checkUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (data.exists) {
      setUserExists(true);
      setName(data.user.name);
    } else {
      setUserExists(false);
      setName("");
    }
  };

  const handleSubmit = async () => {
  if (!name || !email) return;

  const res = await fetch("http://localhost:8000/api/matches/checkUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  const data = await res.json();

  onSave({
  name,
  email,
});
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-4">Enter Details</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => checkUser(email)}
        />

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={userExists}
        />

        {userExists && (
          <p className="text-green-600 text-sm mb-2">
            User found
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}