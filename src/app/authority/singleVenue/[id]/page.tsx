"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddCourtModal from "@/app/_component/courtModel/page";
import EditCourtModal from "@/app/_component/editCourtModel/page";
import Select, { Options } from "react-select";
import Venue from "../../ViewVenue/page";



export default function SingleUser() {
  const facilities = [
    "Free Parking",
    "Paid Parking",
    "Rental Equipments",
    "Locker rooms & changing areas",
    "Restrooms & showers",
  ];

  type Employee = {
    _id: string;
    name: string;
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];


  type empType = { name: string };

  const options = [
    { value: "padle", label: "padle" },
    { value: "pickle", label: "pickle" },
    { value: "badminton", label: "badminton"},
  ];

  interface CourtModalProps {
    onClose: () => void;
    onSave: (court: any) => void;
  }

  type court = { id: string; name: string; status: string };

  type venueType = {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    games: [string];
    courts: court[];
    status: string;
    facilities: [string];
    employee: empType[];
    timings: Record<string, { open :string; close: string }>;
    image: string;
  };

  const { id } = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<venueType>();
  const [courtModal, setCourtModal] = useState(false);
  const [courts, setCourts] = useState<court[]>([]);

  const [editCourtIndex, setEditCourtIndex] = useState<number | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const gamesArray = selectedOptions.map((opt) => opt.value);

  const [timings, setTimings] = useState(
    days.reduce((acc: any, day) => {
      acc[day] = {
        open: "",
        close: "",
      };
      return acc;
    }, {}),
  );

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/venue/getSingleVenue/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API RESPONSE:", data);

          const venueData = data?.data || data?.venue || data;
          if (!venueData) return;
          setVenue(data.data);
          setSelectedFacilities(data.data.facilities || []);
          setTimings(data.data.timings || {});
          setSelected(data.data.employee || []);
          setCourts(data.data.courts || []);
        });
    }
  }, [id]);
  const handleTimeChange = (
    day: string,
    type: "open" | "close",
    value: string,
  ) => {
    setTimings((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  useEffect(() => {
    fetch(`NEXT_PUBLIC_BACKEND_URL/api/admin/getEmployee`)
      .then((res) => res.json())

      .then((data: any) => {
        console.log(data.employees);
        setEmployees(data?.employees);
      });
  }, []);

  const handleSelect = (emp: any) => {
    const exist = selected.find((e) => e._id === emp._id);
    if (exist) {
      setSelected(selected.filter((e) => e._id !== emp._id));
    } else {
      setSelected([...selected, emp]);
    }
  };

  const handleAddCourt = (newCourt: any) => {
    setCourts((prev) => [...prev, newCourt]);
  };

  const handleChange = (selected: any) => {
    const cleaned = (selected || []).filter((opt: any) => opt?.value);
    setSelectedOptions(cleaned);
  };

  useEffect(() =>{
    if (venue?.games) {
      const formatted = venue.games
        .filter((game: string) => game)
        .map((game: string) => ({
          value: game,
          label: game,
        }));
      setSelectedOptions(formatted);
    }
  }, [venue]);

  const handleRemove = async (id: any) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/venue/removeVenueEmp/${venue?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            employee: id,
          }),
        },
      );
      setSelected((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateVenue = async () => {

      try {
    const formData = new FormData();
    formData.append("name", venue?.name || "");
    formData.append("description", venue?.description || "");
    formData.append("address", venue?.address || "");
    formData.append("city", venue?.city || "");
    formData.append("state", venue?.state || "");
    formData.append("status", venue?.status || "");

    formData.append("facilities", JSON.stringify(selectedFacilities));
    formData.append("timings", JSON.stringify(timings));
    formData.append("employee", JSON.stringify(selected));
    formData.append("courts", JSON.stringify(courts));
    formData.append("games", JSON.stringify(gamesArray));


      if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const res = await fetch(
      `http://localhost:8000/api/venue/updateVenue/${id}`,
      {
        method: "PUT",
        body: formData, 
      }
    );

    const data = await res.json();

    if (res.ok) {
      console.log("VENUE IMAGE:", venue?.image);
      toast.success("Venue Updated");
      router.push("/authority/ViewVenue");
    } else {
      toast.error("Failed to update");
    }
  } catch (error) {
    console.log(error);
  }
};

console.log("venue:", venue);
console.log("image:", venue?.image);

  if (!venue) return <p>Loading...</p>;

  return( 
    <div className=" bg-white flex justify-center items-center w-full ">
      <div className="w-full container mx-auto bg-white  ">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {venue.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* LEFT FORM */}
          <div className="md:col-span-1 bg-gray-100 p-4 rounded-xl">
            <div className="space-y-4 ">
              <div className="md:col-span-1 bg-gray-100  rounded-xl">
                <div className="space-y-4">
                  {/* Image Upload Box */}
                  <div className="bg-gray-200 h-40 rounded-xl flex items-center justify-center relative overflow-hidden">
                    {/* Hidden Input */}
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                    />

                    {/* Image Preview */}
                    {(selectedFile || venue?.image)   && (
                      <Image
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : `http://localhost:8000${venue.image.startsWith('/') ? '' : '/'}${venue.image}`
                        }
                        alt="venue"
                        fill
                        className="absolute inset-0 w-full h-full object-cover"
                          unoptimized 
                      />
                    )}

                    {/* Upload Button (overlay) */}
                    <div className="absolute bottom-0 left-2 w-full  pb-2">
                      <button
                        onClick={() =>
                          document.getElementById("fileUpload")?.click()
                        }
                        className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full text-xs shadow"
                      >
                        {selectedFile ? "Change Image" : "Upload Image"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              

              <label>Name of venue</label>
              <input
                className="bg-white  rounded shadow px-3 py-2 w-full"
                type="text"
                value={venue.name || ""}
                onChange={(e) => setVenue({ ...venue, name: e.target.value })}
              />

              <label>Description</label>
              <input
                className="bg-white  rounded shadow px-3 py-2 w-full"
                type="text"
                placeholder="Description"
                value={venue.description || ""}
                onChange={(e) =>
                  setVenue({ ...venue, description: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Address</label>
                  <input
                    placeholder="address"
                    type="text"
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                    value={venue.address || ""}
                    onChange={(e) =>
                      setVenue({ ...venue, address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>City</label>
                  <input
                    placeholder="city"
                    type="text"
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                    value={venue.city || ""}
                    onChange={(e) =>
                      setVenue({ ...venue, city: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>State</label>
                  <input
                    placeholder="state"
                    type="text"
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                    value={venue.state || ""}
                    onChange={(e) =>
                      setVenue({ ...venue, state: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={venue?.status}
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                  >
                    <option value={"active"}>Active</option>
                    <option value={"Inactive"}>InActive</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Game Available</label>
                <Select
                  options={options}
                  value={selectedOptions}
                  onChange={handleChange}
                  isMulti={true}
                />
              </div>
              <button
                className="w-full bg-blue-800 text-white py-2 rounded-full"
                onClick={handleUpdateVenue}
              >
                Save
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Courts</h2>
                <button
                  onClick={() => setCourtModal(true)}
                  className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm"
                >
                  + Add A New Court
                </button>
                {courtModal && (
                  <AddCourtModal
                    onClose={() => setCourtModal(false)}
                    onSave={handleAddCourt}
                  />
                )}
              </div>

              {/* Court Card */}
              <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm w-fit">
                {courts.map((court: court, i: number) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-3 shadow-sm w-fit"
                  >
                    <div className="flex">
                      <Image
                        src="/manimage.svg"
                        alt="court"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />

                      <div className="ml-4">
                        <p className="font-medium text-sm font-bold">
                          {court.name}
                        </p>
                        <p className="text-xs text-red-500">{court.status}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditCourtIndex(i);
                        setEditModal(true);
                      }}
                      className="text-center bg-gray-900 text-white px-6 w-full mt-3 rounded-xl"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              {/*  MODAL OUTSIDE MAP */}
              {editModal && editCourtIndex !== null && (
                <EditCourtModal
                  court={courts[editCourtIndex]}
                  onClose={() => {
                    setEditModal(false);
                    setEditCourtIndex(null);
                  }}
                  onUpdate={(updatedCourt) => {
                    const updatedCourts = [...courts];
                    updatedCourts[editCourtIndex] = updatedCourt;
                    setCourts(updatedCourts);
                  }}
                />
              )}
            </div>

            {/* //facilities */}
            <div className="flex gap-2">
              <div className="bg-gray-100 w-1/2 rounded-xl p-4">
                <h2 className="font-semibold mb-3">Select Facilities</h2>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {facilities.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{item}</p>
                      <input
                        type="checkbox"
                        className="accent-orange-500"
                        checked={selectedFacilities.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFacilities((prev) => [...prev, item]);
                          } else {
                            setSelectedFacilities((prev) =>
                              prev.filter((f) => f !== item),
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100  w-1/2 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Employees</h2>
                  <button
                    onClick={() => setOpen(true)}
                    className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm"
                  >
                    + Add New Employee
                  </button>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {selected.map((emp, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{emp.name}</p>
                      <button
                        onClick={() => handleRemove(emp._id)}
                        className="bg-orange-100  rounded-xl text-sm text-orange-500 px-3 "
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                  <div className="bg-white px-4 w-90 py-4 rounded">
                    <h2>Select Employee</h2>

                    {/* list */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {employees?.map((emp) => (
                        <div key={emp._id} className=" text-center rounded-xl">
                          <div className="mx-auto  rounded-xl">
                            <Image
                              src="/manimage.svg"
                              alt="court"
                              width={100}
                              height={100}
                              className="rounded-lg"
                            />
                          </div>
                          <div className="">
                            <span className="text-sm mt-2">{emp.name}</span>
                            <input
                              className="mt-2"
                              type="checkbox"
                              checked={selected.some((e) => e._id === emp._id)}
                              onChange={() => handleSelect(emp)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="mt-3 bg-blue-500 text-white px-2 py-1"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* timingsection */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex justify-between">
                <h2 className="font-semibold mb-3">Timings</h2>
                <h2 className="font-semibold mb-3">Opening Hours</h2>
                <h2 className="font-semibold mb-3 ">Closing Hours</h2>
              </div>

              <div className="space-y-3">
                {days.map((day) => (
                  <div
                    key={day}
                    className="grid grid-cols-3 gap-2 items-center"
                  >
                    <p className="text-sm text-gray-600">{day}</p>

                    <input
                      type="time"
                      value={timings?.[day]?.open || ""}
                      className="time"
                      onChange={(e) =>
                        handleTimeChange(day, "open", e.target.value)
                      }
                    />

                    <input
                      type="time"
                      value={timings?.[day]?.close || ""}
                      className="time"
                      onChange={(e) =>
                        handleTimeChange(day, "close", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
