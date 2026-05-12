"use client";
import { useState } from "react";
import Link from "next/link";
 import { useRouter } from "next/navigation";
 import toast from "react-hot-toast";

export default function register() {
   <h1>Register </h1>;
const router = useRouter();
const[name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const[phoneNumber,setPhoneNumber]=useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name,email, password,city,phoneNumber })
    });

    const data = await res.json();
console.log("res",res)
  if (res.ok) {
   toast.success("Register Successfully")
        router.push("/");
       
  } else {
    toast.error("Failed")
  }
   
  };
  

   return (
     <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl  flex w-[1200px] h-screen overflow-hidden">

        {/* LEFT IMAGE SECTION */}
        <div className="w-1/2  flex items-center justify-center p-7">
          <img
            src="/badmintain.png"
            alt="player"
            className="max-w-full h-auto"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          
          {/* Logo */}
          <div className=" mb-4">
           <img
           src="/logo.png"
           className="w-1/3 mx-auto "
           />
          </div>

          <h2 className="text-xl font-semibold text-center mb-6">
            Welcome Back
          </h2>

            <div className="grid md:grid-cols-2 md:gap-4">
           {/* Name*/}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="Name"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Your Password</label>
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           {/* city*/}
          <div className="mb-4">
            <label className="text-sm text-gray-600">City</label>
            <input
              type="city"
              placeholder="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

 {/* phoneNumber */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="phoneNumber"
              placeholder="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </div>
          {/* Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
           Register
          </button>
        </div>
      </div>
    </div>
  );
}