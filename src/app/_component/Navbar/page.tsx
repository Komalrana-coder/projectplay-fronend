import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
  
    const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); }
  return (
   
         
      <nav className="w-full sticky top-0 z-50 bg-white  px-3 py-2 flex   items-center justify-between">

        {/* Logo */}
        <div className="flex items-center ">
          
          <Image
            height={100}
            width={100}
            alt="logo"
            src="/logo.png"
            className="w-13"
          />
        </div>


        
        <div className="flex-1 flex justify-center ">
          <div className="flex items-center gap-2 shadow bg-white px-3 py-1 rounded-full text-sm text-gray-600">

            <Link href="/authority/dashboard" className="px-4 py-1 rounded-full hover:bg-gray-200">
              Dashboard
            </Link>

            <Link href="/authority/viewMatches" className="px-4 py-1 rounded-full hover:bg-gray-200">
              Matches
            </Link>

           

            <Link href="/authority/viewUsers" className="px-4 py-1 rounded-full hover:bg-gray-200">
              Users
            </Link>

            <Link href="/authority/ViewVenue" className="px-4 py-1 rounded-full hover:bg-gray-200 ">
              Venues
            </Link>

            <Link href="/authority/viewEmployees" className="px-4 py-1 rounded-full hover:bg-gray-200">
              Employees
            </Link>

          </div>
        </div>

       
        <div className="w-10"></div>
        <button
  onClick={handleLogout}
  className="flex items-center gap-2 bg-blue-500 text-white px-2 py-1 rounded-lg"
>
  <LogOut size={15} />
  Logout
</button>
      </nav>

  );
}