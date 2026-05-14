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
    <div className="min-h-screen w-full  bg-white  md:p-2">
      <h4 className="w-full flex text-xl md:text-2xl  font-semibold text-blue-900">
        All Users
      </h4>
      <div className=" flex flex-col  gap-3 mb-4">
        <div className="w-full flex item-center md:flex-row md:items-center gap-2">
          <div className="flex-1"></div>
          <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
            Sort
          </button>
        </div>
      </div>
      <div className=" flex w-full  gap-6 transition-all duration-300">
        <div
          className={`bg-gray-100 rounded-xl p-2 overflow-x-auto shadow transition-all duration-300 ${
            selectedUsers ? "w-2/3" : "w-full"
          }`}
        >
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-xl font-raleway text-blue-900">All Users</h4>
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
          {/*table */}

          <div className=" flex justify-between w-full text-sm font-raleway text-gray-600 ">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Level</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Phone</th>
                  
                </tr>
              </thead>
               <tbody className="text-sm">

                
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => setSelectedUsers(user)}
                      className="border-b hover:bg-blue-500 cursor-pointer"
                    >
        <td className="px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative rounded-full overflow-hidden bg-gray-300">

              {user?.image ? (
                <img
                  src={user?.image}
                  className="w-8 h-8 rounded-full object-cover"
                  alt="user"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}

            </div>

            <span>{user.name || "Unknown"}</span>
          </div>
        </td>

        <td className="px-4 py-2">
          <span className="">
            {user.name}
          </span>
        </td>
         <td className="px-4 py-2 break-all">{user.email}</td>
        <td className="px-4 py-2">{user.phoneNumber}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={2} className="text-center py-4">
        No employees found
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
        {/* //right side */}
        {selectedUsers && (
          <div className="w-full max-w-md bg-gray-100 rounded-2xl shadow-lg p-4 relative">
            {/* Top Blue Header */}
            <div className="bg-blue-600 text-white rounded-2xl p-3 ">
              {/* Profile Image */}
              <div className="flex items-center gap-4">
                 {selectedUsers?.image? (
                <img
                  src={selectedUsers?.image}
                  className="w-20 h-20 rounded-full object-cover"
                  alt="user"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                  {selectedUsers.name?.charAt(0) || "U"}
                </div>
              )}
                <div>
                  <h2 className="text-xl font-semibold leading-tight">
                  {selectedUsers.name}
                  </h2>
                </div>
              </div>

              {/* Amount */}
              {/* <div className="absolute top-4 right-4 bg-blue-800 px-4 py-1 rounded-full text-sm">
                ₹2000
              </div> */}
            </div>


<div className="absolute w-20 h-40 bottom-12 right-0 md:w-52 md:h-80">
  <Image
    src="/girl.svg"
    alt="illustration"
    fill
    className="object-contain pointer-events-none"
  />
</div>
            {/* Content Section */}
            <div className="p-4">
              {/* Personal Details */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Personal Details
                </h3>

                <p className="text-sm text-gray-600 ">
                  Phone Number:{" "}
                  <span className="font-medium text-gray-800">
                    {selectedUsers.phoneNumber}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Email Address:{" "}
                  <span className="font-medium text-gray-800">
                    {selectedUsers.email}
                  </span>
                </p>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Statistics</h3>

                <div className="grid  grid-cols-[auto_auto] gap-x-4 w-fit text-sm">
                  <p className="text-gray-500">Loyalty Points</p>
                  <p className="flex justify-between font-medium">5800</p>

                  <p className="text-gray-500">Level</p>
                  <p className="text-right font-medium">65456</p>

                  <p className="text-gray-500">Last Month Level</p>
                  <p className="text-right font-medium">-1</p>

                  <p className="text-gray-500">Confidence</p>
                  <p className="text-right font-medium">27%</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {/* <button
                className="w-[95%] absolute bottom-0 mb-2 bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 transition"
                onClick={() =>
                  router.push(`/authority/singleUser/${selectedUsers._id}`)
                }
              >
                View More Details
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
