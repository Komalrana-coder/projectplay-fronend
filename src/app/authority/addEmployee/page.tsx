"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AddEmployee() {
  <h1>Add Employee </h1>;
  const router = useRouter();
  type Status = "Working" | "Inactive" | "OnLeave";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<Status>("Working");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleAddEmployee = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("status", status);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/addEmployee`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("res", res);

      if (res.ok) {
        toast.success("Employee Added");
        router.push("/authority/viewEmployees");
      } else {
        toast.error(data.message || "failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="   w-full bg-white  md:p-6">
      <h4 className="w-full flex text-xl md:text-2xl font-semibold">
        Add New Employee
      </h4>
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* left */}
        <div className="bg-gray-100 rounded-xl  mt-4 w-full">
          <div className="w-full px-7  py-4">
            <div className="w-full flex flex-col bg-gray-100 rounded-xl">
              <div className="md:col-span-1 bg-gray-100  rounded-xl">
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="w-full mt-1 px-4 py-2 border rounded"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-100 mt-6">
              <form className="space-y-1">
                <label>Name of employee</label>
                <input
                  className="bg-white  rounded shadow px-3 py-2 w-full"
                  type="text"
                  placeholder="name of employee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Phone Number</label>
                <input
                  className="bg-white  rounded-lg shadow px-3 py-2 w-full"
                  type="text"
                  placeholder="PhoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                  <option value="Working">Working</option>
                  <option value="onLeave">OnLeave</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div></div>
              </form>
            </div>
          </div>
        </div>
        {/* right */}

        <div className="w-full flex flex-col bg-gray-100  rounded-xl">
          <h4 className="px-4 text-lg text-blue-900 font-semibold">
            Credentials
          </h4>
          <div className="bg-gray-100 py-3 px-4 rounded-xl">
            <form className="space-y-4">
              <label>Email Address</label>
              <input
                className="bg-white  rounded shadow px-3 py-2 w-full"
                type="Email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                className="bg-white  rounded shadow px-3 py-2 w-full"
                type="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              
            </form>
            <button
                onClick={handleAddEmployee}
                className="bg-gray-900 rounded py-2 px-4 mt-6 w-full text-white"
              >
                Add Employee
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
