"use client";

 import { useRouter } from "next/navigation";
import Link from "next/link";
 import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyOtp() {
     const router = useRouter();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

   
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    // go back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: any) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    const updatedOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      updatedOtp[i] = newOtp[i] || "";
    }

    setOtp(updatedOtp);
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
   
      const token = localStorage.getItem("resetToken");
    
  if (!token) {
    alert("Token missing. Please request OTP again.");
    return;
  }
    console.log("OTP:", finalOtp);
    

    const res = await fetch("http://localhost:8000/api/auth/verifyOtp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ otp: finalOtp }),
    });

    const data = await res.json();
    

    if (res.ok) {
      toast.success("Verified OTP")
      router.push("/resetPassword")
    } else {
    toast.success("invalid OTP")
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
           Verify Otp
          </h2>

        

{/*otp */}
        
        <p className="text-gray-500 mb-6">Enter the 6-digit otp</p>

        <div
          className="flex justify-between gap-2 mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {(inputs.current[index] = el)}}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

    

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
          >
            Log In
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