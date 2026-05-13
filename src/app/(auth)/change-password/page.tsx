"use client";
import { useState } from "react";
import Link from "next/link";
 import { useRouter } from "next/navigation";

export default function ChangePassword() {
   <h1>Change Password </h1>;
const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword,setNewPassword]= useState("");

  const handleChangePassword = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password ,newPassword})
    });
    const data = await res.json();
console.log("res",res)
  if (res.ok) {
     alert("password Change Successful ");

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.role === "employee") {
        router.push("/employee/empDashboard");
      }
  } else {
    alert(" Failed ");
  }
   
  };
  

   return(
      <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl  flex w-[1200px] h-screen overflow-hidden">

        {/* LEFT IMAGE SECTION */}
        <div className="w-1/2  flex items-center justify-center p-5">
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
           className="w-1/2 mx-auto "
           />
          
          </div>
          <h2 className="text-xl font-semibold text-center mb-6">
           CHANGE PASSWORD
          </h2>
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
            <label className="text-sm text-gray-600">Old Password</label>
            <input
              type="password"
              placeholder="Old Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

           {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot */}
          <div className="text-right mb-6">
            <Link href="/forgetPassword" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            onClick={handleChangePassword}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );


}