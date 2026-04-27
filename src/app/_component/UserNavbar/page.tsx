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
    <div className="w-full bg-gray-100 ">
      <nav className="w-full  px-3 py-2 flex   items-center justify-between">

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

            <Link href="/user/home" className="px-4 py-1 rounded-full hover:bg-gray-200">
              home
            </Link>
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
         <button className="p-1 px-2 bg-blue-600 rounded-xl"
         onClick={handleLogout}
         >logout</button>
      </nav>
     
    </div>
  );
}