"use client"
import Image from "next/image"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function singleUser(){

  const {id} = useParams();

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (id) {         
      fetch(`http://localhost:8000/api/admin/getSingleUser/${id}`)
        .then((res) => res.json())
        .then((data) =>setUser(data));
    }
  }, [id]);
  if (!user) return <p>Loading...</p>;


    return(
        <div>
            <div className="w-full max-w-md bg-gray-100 rounded-2xl shadow-lg p-4 relative">
                     {/* Top Blue Header */}
                     <div className="bg-blue-600 text-white rounded-2xl p-5 ">
                       {/* Profile Image */}
                       <div className="flex items-center gap-4">
                         <img
                           src="/avatar.jpg"
                           alt="profile"
                           className="w-16 h-16 rounded-full border-2 border-white"
                         />
         
                         <div>
                           <h2 className="text-xl font-semibold leading-tight">
                             Isabella <br /> Anderson
                           </h2>
                         </div>
                       </div>
         
                       {/* Amount */}
                       <div className="absolute top-4 right-4 bg-blue-800 px-4 py-1 rounded-full text-sm">
                         ₹2000
                       </div>
                     </div>
         
                     {/* <Image
                       height={10}
                       width={50}
                       src="/girl.svg"
                       alt="illustration"
                       className="absolute right-0 bottom-10 w-20 h-10! md:w-52 pointer-events-none"
                     /> */}
         <div className="absolute w-20 h-40 bottom-12 right-0 md:w-52 md:h-80">
           <Image
             src="/girl.svg"
             alt="illustration"
             fill
             className="object-contain pointer-events-none"
           />
         </div>
                     {/* Content Section */}
                     <div className="p-4">
                       {/* Personal Details */}
                       <div className="mb-4">
                         <h3 className="font-semibold text-gray-700 mb-2">
                           Personal Details
                         </h3>
         
                         <p className="text-sm text-gray-600 ">
                           Phone Number:{""}
                           <span className="font-medium text-gray-800" 
                            
                           >
                              {user?.phoneNumber||""}
                            
                            
                           </span>
                         </p>
                         <p className="text-sm text-gray-600">
                           Email Address:{" "}
                           <span className="font-medium text-gray-800">
                           
                              {user?.email || ""}
                           </span>
                         </p>
                       </div>
         
                       {/*Statistics*/}
                       <div>
                         <h3 className="font-semibold text-gray-700 mb-2">Statistics</h3>
         
                         <div className="grid  grid-cols-[auto_auto] gap-x-4 w-fit text-sm">
                           <p className="text-gray-500">Loyalty Points</p>
                           <p className="flex justify-between font-medium">5800</p>
         
                           <p className="text-gray-500">Level</p>
                           <p className="text-right font-medium">65456</p>
         
                           <p className="text-gray-500">Last Month Level</p>
                           <p className="text-right font-medium">-1</p>
         
                           <p className="text-gray-500">Confidence</p>
                           <p className="text-right font-medium">27%</p>
                         </div>
                       </div>
                     </div>
                     {/* <div className="mt-8">
                       <button
                         className="w-[95%] absolute bottom-0 mb-2 bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800 transition"
                         onClick={() =>
                           router.push(`/authority/singleUser/${selectedUsers._id}`)
                         }
                       >
                         View More Details
                       </button> */}
                     {/* </div> */}
                   </div>
        </div>
    )
}