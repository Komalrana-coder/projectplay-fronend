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
};
export default function Employees(){
  const router = useRouter();
  const getStatusStyle=(status: string) => {
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
      `http://localhost:8000/api/admin/getEmployee?page=${page}&limit=10&search=${search}`,
    );
    const data = await res.json();
    setEmployees(data.employees ||[]);
    setTotalPages(data.totalPages || 1);
  };
  useEffect(() => {
    const delay = setTimeout(()=>{
      fetchEmployees();
    }, 400);
    return ()=>clearTimeout(delay);
  }, [search, page]);


  return (
    <div className="min-h-screen w-full  bg-gray-100 p-4 md:p-6">
      <h4 className="w-full flex text-xl md:text-2xl font-semibold">
        All Employees
      </h4>
      <div className=" flex flex-col  gap-3 mb-4">
        <div className="w-full flex item-center md:flex-row md:items-center gap-2">
          <div className="flex-1"></div>
          <div className="flex gap-2">
            <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
              Sort
            </button>
            <button className="bg-gray-900 text-white text-sm rounded-full px-4 py-2">
              Status
            </button>
          </div>
          <div className=" flex-1 flex justify-end">
            <button
              onClick={() => router.push("/authority/addEmployee")}
              className="bg-gray-900 text-white  text-sm rounded-full px-4 py-2"
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
      <div className=" flex w-full  gap-6 transition-all duration-300">
        <div
          className={`bg-gray-200 rounded-xl p-4 overflow-x-auto shadow transition-all duration-300 ${
            selectedEmployee ? "w-2/3" : "w-full"
          }`}
        >
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-xl font-semibold">All Employees</h4>
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

          <div className=" flex justify-between w-full text-sm font-semibold text-gray-600 ">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Phone</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr
                      key={emp._id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(emp.status)}`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 break-all">{emp.email}</td>
                      <td className="px-4 py-2">{emp.phoneNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4">
                      no employee found
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

        {/* right */}
        {selectedEmployee && (
          <div className="w-1/3 bg-gray-100   p-4 transition-all duration-300">
            <div className="w-full flex flex-col  rounded-xl  px-3">
              <Image
                height={100}
                width={100}
                alt=""
                src="/manimage.svg"
                className="w-full"
              />

              <form className="space-y-1 mt-3  ">
                <label>Name of employee</label>
                <input
                  className="bg-white  rounded shadow px-3 py-2 w-full"
                  value={selectedEmployee.name}
                  readOnly
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <label>Email Address</label>
                    <input
                      className="bg-white rounded-lg shadow px-3 py-2 w-full"
                       value={selectedEmployee.email}
                        readOnly
                    />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input
                      className="bg-white  rounded-lg shadow px-3 py-2 w-full"
                      value={selectedEmployee.phoneNumber}
                       readOnly
                    />
                  </div>
                </div>
                <label>Status</label>
                <input
                 className="bg-white  rounded-lg shadow px-3 py-2 w-full"
                      value={selectedEmployee.status}
                       readOnly
                />
              </form>
                <button 
               onClick={() => router.push(`/authority/updateEMployee/${selectedEmployee._id}`)}  
                className="bg-blue-600 rounded py-2 px-4 mt-6 w-full text-white">
                  view Details
                </button>
            </div>
          </div>
        )}
       
      </div>
    </div>
  );
}
