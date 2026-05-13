 "use client";
import { useState } from "react";
 import { useRouter } from "next/navigation";
 import Link from "next/link";
import toast from "react-hot-toast";

export default function forgetPassword() {
   <h1>Forget Password </h1>;
const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
         try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

    console.log("Response status:", res.status);

    const data = await res.json();
    console.log("Response data:", data);
    localStorage.setItem("resetToken", data.token);

  
      if (res.ok) {
        toast.success("OTP send to gmail")
         router.push("/verifyOtp");
      } else {
       toast.error("send again")
      }
    } catch (error) {
      console.log(error);
      toast.error("server error")
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
           Forget Password
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

    

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send OTP
          </button>
          {/* login */}
          <div className=" mb-6 text-center mt-2 ">
           <span className="text-sm">Remember Login?</span> 
            <Link href="/" className="text-sm text-blue-500 hover:underline">
             Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );


}