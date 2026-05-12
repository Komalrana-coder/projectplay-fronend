import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserNavbar() {

  const router = useRouter();

  const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/"); 
};
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


        {/* Center Links (Pill Style) */}
        <div className="flex-1 flex justify-center ">
          <div className="flex items-center gap-2 shadow bg-white px-3 py-1 rounded-full text-sm text-gray-600">

            
            <Link href="/user/openMatches" className="px-4 py-1 rounded-full hover:bg-gray-200">
             Matches
            </Link>


            <Link href="/user/allVenue" className="px-4 py-1 rounded-full hover:bg-gray-200">
              Venues
            </Link>

            
            <Link href="/user/account" className="px-4 py-1 rounded-full hover:bg-gray-200">
             Account
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