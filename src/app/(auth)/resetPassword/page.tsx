"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("resetToken");

    if (!token) {
      alert("Token missing. Please try again.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
       body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok ||data.success) {
         localStorage.removeItem("resetToken");
         toast.success("Reset Password")
        router.push("/"); 
      } else {
        toast.error("failed")
      }
    } catch (error) {
      console.error(error);
      toast.error("Sever error")
    }
  };
   return (
     <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl  flex w-[1200px] h-screen overflow-hidden">

        {/* LEFT IMAGE SECTION */}
        
        <div className="w-1/2  flex items-center justify-center p-5">
          <img
            src="/badmintain.png"
            alt="player"
            className="max-w-full h-auto "
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
            Reset Password
          </h2>
          {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Set Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}