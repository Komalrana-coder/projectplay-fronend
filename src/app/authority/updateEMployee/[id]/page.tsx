"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type EmployeeType = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  status: string;
  image?: string;
};

export default function singleEmployee() {
  const router = useRouter();
  const { id } = useParams();

  const [employee, setEmployee] = useState<EmployeeType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/admin/getSingleEmployee/${id}`)
        .then((res) => res.json())
        .then((data) => setEmployee(data));
    }
  }, [id]);
  if (!employee) return <p>Loading...</p>;

  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", employee?.name || "");
      formData.append("email", employee?.email || "");
      formData.append("phoneNumber", employee?.phoneNumber || "");
      formData.append("password", employee?.password || "");
      formData.append("status", employee?.status || "");

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        `http://localhost:8000/api/admin/updateEmployee/${id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      const data = await res.json();
      console.log("UPDATE RESPONSE 👉", data);

      if (res.ok) {
        toast.success("Employee Updated");
        setEmployee(data.data);
        //  router.push("/authority/viewEmployees")
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center item-center">
      <div className="w-1/2  bg-white  rounded-xl shadow p-4 transition-all duration-300">
        <div className="w-full flex flex-col bg-gray-100 rounded-xl ">
          <div className="relative">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : employee?.image
                    ? `http://localhost:8000${employee.image}`
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

          <form className="space-y-1 mt-2 px-3">
            <label>Name of employee</label>
            <input
              className="bg-white  rounded-xl shadow px-3 py-2 w-full"
              value={employee.name || ""}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  name: e.target.value,
                })
              }
            />
            <label>Phone Number</label>
            <input
              className="bg-white  rounded-xl shadow px-3 py-2 w-full"
              value={employee.phoneNumber || ""}
              onChange={(e) =>
                setEmployee((prev) =>
                  prev ? { ...prev, phoneNumber: e.target.value } : prev,
                )
              }
            />

            <label>Email Address</label>
            <input
              className="bg-white rounded-xl shadow px-3 py-2 w-full"
              value={employee.email || ""}
              onChange={(e) =>
                setEmployee((prev) =>
                  prev ? { ...prev, email: e.target.value } : prev,
                )
              }
            />
            <label>Password</label>

            <input
              className="bg-white  rounded-xl shadow px-3 py-2 w-full"
              value={employee.password || ""}
              onChange={(e) =>
                setEmployee((prev) =>
                  prev ? { ...prev, password: e.target.value } : prev,
                )
              }
            />

            <label> Status</label>
            <select
              value={employee.status || ""}
              onChange={(e) =>
                setEmployee((prev) =>
                  prev ? { ...prev, status: e.target.value } : prev,
                )
              }
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            >
              <option value="Working">Working</option>
              <option value="onLeave">OnLeave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </form>
          <button
            onClick={handleUpdate}
            className="bg-blue-700 rounded py-2 px-4 mt-6 w-full text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
