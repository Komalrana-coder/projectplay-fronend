"use client";

import Navbar from "../_component/HomeNavbar/page";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      
      <div className="flex-1">
        
        {/* Center Navbar */}
        <div className="flex justify-center w-full">
          <Navbar />
        </div>

        <div className="p-4">
          {children}
        </div>

      </div>
    </div>
  );
}