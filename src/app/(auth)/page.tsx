"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function Login() {
   <h1>Login Page </h1>;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  
  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
console.log("res",res)
  if (res.ok) {
    toast.success("Login Successful ");
     localStorage.setItem("token", data.token);

      if (data.role === "admin") {
        router.push("/authority/dashboard");
      }
    
      else if (data.role === "employee") {
        router.push("/authority/dashboard");
      }

      else if (data.role === "user") {
        router.push("/user/openMatches");
      }
       
  } else {
    toast.error("Invalid credentials");
  }
  };
  

   return (
     <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl  flex flex-wrap w-[1200px]  overflow-hidden">

        {/* LEFT IMAGE SECTION */}
        <div className="w-1/2  flex  items-center justify-center p-5">
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
            Welcome Back
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
            <label className="text-sm text-gray-600">Your Password</label>
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
           {/* register */}
          <div className="text-left mb-6">
            <Link href="/register" className="text-sm text-blue-500 hover:underline">
              Register User
            </Link>
              <Link href="/home/features" className="text-sm text-blue-500 hover:underline">
              home
            </Link>
          </div>

          {/* Forgot */}
          <div className="text-right mb-6">
            <Link href="/forgetPassword" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white  py-2 rounded-full hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );


}