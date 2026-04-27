"use client";
import UserNavbar from "@/app/_component/UserNavbar/page";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen ">
      {/* Main Content */}
      <div className="flex-1">
        <UserNavbar/>
        <div className="p-4">
          {children} 
        </div>
      </div>
    </div>
  );
}