"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Venue() {
  const router = useRouter();
  const [venue, setVenue] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log("venue", venue);

  const fetchVenue = async () => {
    const res = await fetch(
      `http://localhost:8000/api/venue/getVenue?page=${page}&limit=10&search=${search}`,
    );
    const data = await res.json();
    setVenue(data.venue || []);
    setTotalPages(data.totalPages || 1);
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchVenue();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, page]);

  return (
    <div className="min-h-screen bg-white flex justify-center items-center py-1 px-2">
      <div className="w-full min-h-screen max-w-8xl bg-white  ">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">All Venues</h1>

          <div className="flex gap-3">
            <input
              placeholder="Search"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 rounded-full bg-gray-100 outline-none"
            />

            <button
              onClick={() => router.push("/authority/addVenue")}
              className="bg-gray-900 text-white px-4 py-2 rounded-full"
            >
              + Add A New Venue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4">
          {venue?.map((venue: any) => (
            <div
              key={venue._id}
              onClick={() => router.push(`/authority/singleVenue/${venue._id}`)}
              className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer"
            >

              <div className="relative w-full h-32">
                <Image
               
                  src={`http://localhost:8000${venue.image.startsWith('/') ? '' : '/'}${venue.image}`}
                  alt="venue"
                  fill
                  className="rounded-t-xl object-cover"
                  unoptimized
                />
              </div>


              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  {venue.name}
                </h3>
                <p className="text-xs text-gray-500">{venue.city}</p>
              </div>
            </div>
          ))}
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
    </div>
  );
}
