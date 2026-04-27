import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-3 bg-white rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-4">Today's Schedule</h2>

         
        </div>

       
        <div className="col-span-6 flex flex-col gap-6">

          {/* Recent Booking */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold mb-3">Recent Booking</h2>

            <table className="w-full text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left">Name</th>
                  <th>Game</th>
                  <th>City</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {[1,2,3].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">User {i+1}</td>
                    <td>Padel</td>
                    <td>Chandigarh</td>
                    <td>22-01-2024</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics */}
          <div className="bg-gray-900 rounded-xl p-4 text-white shadow h-64">
            <h2 className="mb-2">Statistics</h2>
            <div className="flex items-center justify-center h-full text-gray-400">
              .....
            </div>
          </div>
        </div>


        {/* RIGHT SIDE */}
        <div className="col-span-3 flex flex-col gap-6">

          {/* Ongoing Matches */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold">Ongoing Matches</h2>
            <p className="text-sm text-gray-500 mt-2">Padel: 4</p>
            <p className="text-sm text-gray-500">Pickleball: 3</p>
          </div>

          {/* Loyalty Points */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-semibold">Loyalty Points</h2>
            <button className="mt-3 px-4 py-1 bg-blue-600 text-white rounded">
              Manage
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}