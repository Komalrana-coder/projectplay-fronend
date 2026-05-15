"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  level: number;
  image:string
};
export default function viewUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<User | null>(null);

  const fetchUsers = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getUsers?page=${page}&limit=10&search=${encodeURIComponent(search || "")}`,
    );

    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.totalPages || 1);
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, page]);

 return (
  <div className="min-h-screen w-full bg-white p-2 md:p-4">

    {/* Heading */}
    <h4 className="w-full text-xl md:text-2xl font-semibold text-blue-900 mb-4">
      All Users
    </h4>

    {/* Top Actions */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

      <div></div>

      {/* <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2 w-full md:w-auto">
        Sort
      </button> */}
    </div>

    {/* Main Layout */}
    <div className="flex flex-col xl:flex-row gap-6 w-full">

      {/* Left Table Section */}
      <div
        className={`bg-gray-100 rounded-xl p-3 shadow transition-all duration-300 overflow-hidden ${
          selectedUsers ? "xl:w-2/3 w-full" : "w-full"
        }`}
      >

        {/* Header */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <h4 className="text-lg md:text-xl font-raleway text-blue-900">
            All Users
          </h4>

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-72 border rounded-lg px-3 bg-white py-2 text-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">

          <table className="min-w-[700px] xl:min-w-full bg-white rounded-xl overflow-hidden shadow">

            <thead className="bg-gray-200 text-gray-700 text-sm">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Level</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => setSelectedUsers(user)}
                    className="border-b hover:bg-blue-50 cursor-pointer transition"
                  >

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[180px]">

                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">

                          {user?.image ? (
                            <img
                              src={user?.image}
                              className="w-full h-full object-cover"
                              alt="user"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                              {user.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>

                        <span className="truncate">
                          {user.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 break-all min-w-[220px]">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {user.phoneNumber}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Right Side Details */}
      {selectedUsers && (
        <div className="w-full xl:w-[380px] flex-shrink-0">

          <div className="bg-gray-100 rounded-2xl shadow-lg p-4 relative overflow-hidden">

            {/* Top Header */}
            <div className="bg-blue-600 text-white rounded-2xl p-4">

              <div className="flex items-center gap-4">

                {selectedUsers?.image ? (
                  <img
                    src={selectedUsers?.image}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                    alt="user"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-2xl font-bold">
                    {selectedUsers.name?.charAt(0) || "U"}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold break-words">
                    {selectedUsers.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="absolute w-20 h-40 bottom-10 right-0 md:w-40 md:h-72 opacity-70 pointer-events-none">

              <Image
                src="/girl.svg"
                alt="illustration"
                fill
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-2 md:p-4 relative z-10">

              {/* Personal Details */}
              <div className="mb-6">

                <h3 className="font-semibold text-gray-700 mb-3">
                  Personal Details
                </h3>

                <div className="space-y-2 text-sm">

                  <p className="text-gray-600 break-words">
                    Phone Number:
                    <span className="font-medium text-gray-800 ml-2">
                      {selectedUsers.phoneNumber}
                    </span>
                  </p>

                  <p className="text-gray-600 break-all">
                    Email Address:
                    <span className="font-medium text-gray-800 ml-2">
                      {selectedUsers.email}
                    </span>
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div>

                <h3 className="font-semibold text-gray-700 mb-3">
                  Statistics
                </h3>

                <div className="grid grid-cols-2 gap-y-3 text-sm">

                  <p className="text-gray-500">
                    Loyalty Points
                  </p>

                  <p className="font-medium text-right">
                    5800
                  </p>

                  <p className="text-gray-500">
                    Level
                  </p>

                  <p className="font-medium text-right">
                    65456
                  </p>

                  <p className="text-gray-500">
                    Last Month Level
                  </p>

                  <p className="font-medium text-right">
                    -1
                  </p>

                  <p className="text-gray-500">
                    Confidence
                  </p>

                  <p className="font-medium text-right">
                    27%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
