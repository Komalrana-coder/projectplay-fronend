"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Employee = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  status: string;
  image: string;
};
export default function Employees() {
  const router = useRouter();
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Working":
        return "bg-green-100 text-green-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      case "OnLeave":
        return "bg-orange-100 text-gray-900";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const fetchEmployees = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/getEmployee?page=${page}&limit=10&search=${search}`,
    );
    const data = await res.json();
    
    console.log("employees:",data);
    setEmployees(data.employees || []);
    setTotalPages(data.totalPages || 1);
  };
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEmployees();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, page]);

  return (
  <div className="min-h-screen w-full bg-white p-2 md:p-4">

    {/* Heading */}
    <h4 className="w-full text-xl md:text-2xl font-semibold text-blue-900 mb-4">
      All Employees
    </h4>

    {/* Top Actions */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

      <div></div>

      {/* Add Button */}
      <div className="flex justify-start md:justify-end">
        <button
          onClick={() => router.push("/authority/addEmployee")}
          className="bg-blue-600 text-white text-sm rounded-full px-4 py-2 w-full md:w-auto"
        >
          Add Employee
        </button>
      </div>
    </div>

    {/* Main Layout */}
    <div className="flex flex-col xl:flex-row gap-6 w-full">

      {/* Left Table */}
      <div
        className={`bg-gray-100 rounded-xl p-4 shadow transition-all duration-300 overflow-hidden ${
          selectedEmployee ? "xl:w-2/3 w-full" : "w-full"
        }`}
      >

        {/* Header */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <h4 className="text-lg md:text-xl font-raleway text-blue-900">
            All Employees
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
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Phone</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {Array.isArray(employees) && employees.length > 0 ? (
                employees.map((emp) => (
                  <tr
                    key={emp._id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="border-b hover:bg-blue-50 cursor-pointer transition"
                  >

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[180px]">

                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">

                          {emp?.image ? (
                            <img
                              src={emp?.image}
                              className="w-full h-full object-cover"
                              alt="user"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                              {emp.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>

                        <span className="truncate">
                          {emp.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span>
                        {emp.status}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 break-all min-w-[220px]">
                      {emp.email}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.phoneNumber}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No employees found
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

      {/* Right Details Card */}
      {selectedEmployee && (
        <div className="w-full xl:w-[380px] flex-shrink-0">

          <div className="bg-gray-100 rounded-2xl p-4 shadow-md">

            <div className="w-full flex flex-col rounded-xl">

              {/* Image */}
              <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-200">

                <img
                  src={selectedEmployee.image}
                  alt="employee"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Form */}
              <form className="space-y-3 mt-4">

                {/* Name */}
                <div>
                  <label className="text-sm text-gray-700">
                    Name of employee
                  </label>

                  <input
                    className="bg-white rounded-lg shadow px-3 py-2 w-full mt-1"
                    value={selectedEmployee.name}
                    readOnly
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div>
                    <label className="text-sm text-gray-700">
                      Email Address
                    </label>

                    <input
                      className="bg-white rounded-lg shadow px-3 py-2 w-full mt-1 break-all"
                      value={selectedEmployee.email}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700">
                      Phone Number
                    </label>

                    <input
                      className="bg-white rounded-lg shadow px-3 py-2 w-full mt-1"
                      value={selectedEmployee.phoneNumber}
                      readOnly
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm text-gray-700">
                    Status
                  </label>

                  <input
                    className="bg-white rounded-lg shadow px-3 py-2 w-full mt-1"
                    value={selectedEmployee.status}
                    readOnly
                  />
                </div>
              </form>

              {/* Button */}
              <button
                onClick={() =>
                  router.push(
                    `/authority/updateEMployee/${selectedEmployee._id}`
                  )
                }
                className="bg-blue-600 rounded-lg py-3 px-4 mt-6 w-full text-white hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
