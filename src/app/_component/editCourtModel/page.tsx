"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

type Court = {
  id: string;
  name: string;
  status: string;
};

type Props = {
  court: Court;
  onClose: () => void;
  onUpdate: (court: Court) => void;
};

export default function EditCourtModal({ court, onClose, onUpdate }: Props) {
  const [name, setName] = useState(court.name);
  const [status, setStatus] = useState(court.status);

  useEffect(() => {
    setName(court.name);
    setStatus(court.status);
  }, [court]);

  const handleSave = async () => {
    const updatedCourt = { ...court, name, status };

    await fetch(`/api/courts/${court.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCourt),
    });

    onUpdate(updatedCourt);
    onClose();
  };

  return (
   
       <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl w-[350px] p-4 shadow-lg">
  
          {/* Image Section */}
          <div className="relative">
            <Image
              src="/manimage.svg"
              alt="court"
              width={300}
              height={150}
              className="rounded-xl w-full h-40 object-cover"
            />
  
            <button className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full text-xs shadow">
               Change Image
            </button>
          </div>
  
          {/* Form */}
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-gray-600">
                Name of the court
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Court 1"
                className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-full outline-none"
              />
            </div>
  
            <div>
              <label className="text-sm text-gray-600">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-full outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
  
          {/* Buttons */}
          <div className="flex justify-between mt-5 gap-2">
            <button
              onClick={onClose}
              className="w-1/2 bg-red-500 text-white py-2 rounded-full"
            >
              Delete Court
            </button>
  
            <button
              onClick={handleSave}
              className="w-1/2 bg-blue-900 text-white py-2 rounded-full"
            >
              Save
            </button>
          </div>
        </div>
      </div>
  );
}