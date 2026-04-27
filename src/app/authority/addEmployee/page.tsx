"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AddEmployee() {
        <h1>Add Employee </h1>;
const router = useRouter();
type Status="Working"|"Inactive"|"OnLeave";
const[name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[phoneNumber,setPhoneNumber]=useState("");
const [status,setStatus]=useState<Status>("Working");
const handleAddEmployee = async () => {
    const res = await fetch("http://localhost:8000/api/admin/addEmployee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name,email, password,phoneNumber,status })
    });
    const data = await res.json( );
console.log("res",res)
  if (res.ok) {
     toast.success("Employee Added")
 router.push("/");
  } else {
    toast.error("failed")
  }
  };
   return (
    <div  className="   w-full bg-white  md:p-6">
        <h4 className="w-full flex text-xl md:text-2xl font-semibold">Add New Employee</h4>
       <div className="flex flex-col md:flex-row gap-6 mt-4">
       {/* left */}
        <div className="bg-gray-100 rounded-xl  mt-4 w-full">
             <div className="w-full px-7  py-4">  
               <div className="w-full flex flex-col bg-gray-100 rounded-xl">
                <Image
                      height={100}
                      width={100}
                       alt=""
                      src="/manimage.svg"
                      className="w-full"  
                />
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
              onChange={(e)=>setStatus(e.target.value as Status)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
                  <option  value="Working">Working</option>
                <option value="onLeave">OnLeave</option>
                <option value="Inactive">Inactive</option>
              </select>
                    <div >
                      
                    </div>
                     
                   </form>
                 </div>
                 </div> 
               </div>
       {/* right */}
           
                 <div className="w-full flex flex-col bg-gray-100  rounded-xl">
               
                <h4 className="px-4 text-lg text-blue-900 font-semibold">Credentials</h4>
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

                     <button
                      onClick={handleAddEmployee}
                     className="bg-gray-900 rounded py-2 px-4 mt-6 w-full text-white">
                      Add Employee
                     </button>
                   </form>
                 </div>
               </div>
</div>
 </div>
   );








}