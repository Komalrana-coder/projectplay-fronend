import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
  
    const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); }
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

            <Link href="/home/features#features" className="px-4 py-1 rounded-full hover:bg-gray-200">
             Features
            </Link>

            <Link href="/home/features#howItWorks" className="px-4 py-1 rounded-full hover:bg-gray-200">
              How It Works
            </Link>
             <Link href="/home/features#Faq" className="px-4 py-1 rounded-full hover:bg-gray-200">
              FAQ
            </Link>

            <Link href="/home/cancellation" className="px-4 py-1 rounded-full hover:bg-gray-200">
             Cancellation&Refund
            </Link>
          </div>
        </div>

        {/* Right spacer (keeps center aligned) */}
        <div className="w-10"></div>
        
      </nav>
    
  );
}