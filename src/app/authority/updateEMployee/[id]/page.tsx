"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";



export default function singleEmployee() {
  const router = useRouter();
  const {id} = useParams();

  const [employee, setEmployee] = useState<any>(null);
  useEffect(() => {
    if (id) {         
      fetch(`http://localhost:8000/api/admin/getSingleEmployee/${id}`)
        .then((res) => res.json())
        .then((data) =>setEmployee(data));
    }
  }, [id]);
  if (!employee) return <p>Loading...</p>;

  const handleUpdate = async () =>{
  try {
    const res = await fetch(
      `http://localhost:8000/api/admin/updateEmployee/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      }
    );

    const data = await res.json();

    if (res.ok) {
     toast.success("Employee Updated");
     router.push("/authority/viewEmployees")
    
     
    } else {
      toast.error("Failed to update")
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="w-full flex justify-center item-center">

      <div className="w-1/2  bg-white  rounded-xl shadow p-4 transition-all duration-300">
        <div className="w-full flex flex-col bg-gray-100 rounded-xl ">
          <Image
            height={100}
            width={600}
            alt=""
            src="/manimage.svg"
            className=""
          />

          <form className="space-y-1 mt-2 px-3">
            <label>Name of employee</label>
            <input
              className="bg-white  rounded-xl shadow px-3 py-2 w-full"
              value={employee.name|| ""}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
            <label>Phone Number</label>
            <input 
            className="bg-white  rounded-xl shadow px-3 py-2 w-full"  
             value={employee.phoneNumber || ""} 
             onChange={(e) =>
                setEmployee({ ...employee, phoneNumber: e.target.value })}
             />

            <label>Email Address</label>
            <input className="bg-white rounded-xl shadow px-3 py-2 w-full"   
             value={employee.email || ""} 
             onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })} />
            <label>Password</label>
            <input
             className="bg-white  rounded-xl shadow px-3 py-2 w-full" 
             value={employee.password || ""} 
             onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })}      
              />

            <label> Status</label>
            <select 
              value={employee.status||""}
             onChange={(e) =>
                setEmployee({ ...employee,status: e.target.value })}   
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
               >
                  <option  value="Working">Working</option>
                <option value="onLeave">OnLeave</option>
                <option value="Inactive">Inactive</option>

            </select>
           
          </form>
           <button 
            onClick={handleUpdate}
            className="bg-blue-700 rounded py-2 px-4 mt-6 w-full text-white">
              Save
            </button>
        </div>
      </div>
    </div>
  );
}
