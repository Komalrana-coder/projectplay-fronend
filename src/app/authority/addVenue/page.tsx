"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Select from "react-select";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Employees from "../viewEmployees/page";
import AddCourtModal from "@/app/_component/courtModel/page";
import EditCourtModal from "@/app/_component/editCourtModel/page";

type Employee = {
  _id: string;
  name: string;
};
interface CourtModalProps {
  onClose: () => void;
  onSave: (court: any) => void;
}

type court = { id: string; name: string; status: string };
export default function addVenue() {
  const facilities = [
    "Free Parking",
    "Paid Parking",
    "Rental Equipments",
    "Locker rooms & changing areas",
    "Restrooms & showers",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const options = [
    { value: "padle", label: "padle" },
    { value: "pickle", label: "pickle" },
    { value: "badminton", label: "badminton" },
  ];

  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [courtModal, setCourtModal] = useState(false);
  const [editCourtIndex, setEditCourtIndex] = useState<number | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [courts, setCourts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<
    Record<string, boolean>
  >(
    facilities.reduce(
      (acc: Record<string, boolean>, item) => {
        acc[item] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );
  const [timings, setTimings] = useState(
    days.reduce((acc: any, day) => {
      acc[day] = {
        open: "",
        close: "",
      };
      return acc;
    }, {}),
  );
  console.log("selected", selected);
  console.log("save", save);

  const gamesArray = selectedOptions.map((opt) => opt.value);
  const handleAddVenue = async () => {
    const employeeIds = selected.map((emp) => emp._id);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("status", status);
    formData.append("description", description);

    formData.append("games", JSON.stringify(gamesArray));
    formData.append("facilities", JSON.stringify(selectedFacilitiesArray));
    formData.append("employees", JSON.stringify(employeeIds));
    formData.append("timings", JSON.stringify(timings));
    formData.append("courts", JSON.stringify(courts));

    if (selectedFile) {
      formData.append("image", selectedFile); 
    }

    const res = await fetch(`NEXT_PUBLIC_BACKEND_URL/api/venue/addVenue`, {
      method: "POST",
      body: formData, 
    });

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);

    if (res.ok && data.success) {
      toast.success("Venue Added");
      router.push("/authority/ViewVenue");
    } else {
      toast.error(data.message || "failed");
    }
  };

  const handleFacilityClick = (item: string) => {
    setSelectedFacility((prev: Record<string, boolean>) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/getEmployee")
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

  const selectedFacilitiesArray = Object.keys(selectedFacility).filter(
    (key) => selectedFacility[key],
  );

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

  const handleAddCourt = (newCourt: any) => {
    setCourts((prev) => [...prev, newCourt]);
  };

  const handleChange = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
  };
  return (
    <div className=" bg-white flex justify-center items-center w-full ">
      {/* Main Card */}
      <div className="w-full container mx-auto bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add New Venue
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* LEFT FORM */}
          <div className="md:col-span-1 bg-gray-100 p-4 rounded-xl">
            <div className="space-y-4 ">
              {/* Image Upload */}

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
                    {selectedFile && (
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-cover"
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
                placeholder="name of venue"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Description</label>
              <input
                className="bg-white  rounded shadow px-3 py-2 w-full"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Address</label>
                  <input
                    placeholder="address"
                    type="text"
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label>City</label>
                  <input
                    placeholder="city"
                    type="text"
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>State</label>
                  <input
                    type="text"
                    placeholder="state"
                    className="bg-white  rounded shadow px-3 py-2 w-full"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <label>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                onClick={handleAddVenue}
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
              <div className="bg-gray-100 rounded-xl p-3 flex   items-center gap-3 shadow-sm w-fit">
                {courts.map((court, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-3 shadow-sm w-fit"
                  >
                    <div className="flex ">
                      <Image
                        src="/manimage.svg"
                        alt="court"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />

                      <div className="ml-4">
                        <p className="font-medium text-sm text-bold ">
                          {court.name}
                        </p>
                        <p className="text-xs text-red-500 ">{court.status}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditCourtIndex(index);
                        setEditModal(true);
                      }}
                      className="   text-center bg-gray-900 text-white px-6 w-full mt-3 rounded-xl"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/*MODAL OUTSIDE MAP */}
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

            {/* //facilities */}

            <div className="flex gap-2">
              <div className="bg-gray-100 w-1/2 rounded-xl p-4">
                <h2 className="font-semibold mb-3">Select Facilities</h2>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {facilities.map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center"
                    >
                      <p className="text-sm text-gray-600">{item}</p>
                      <input
                        type="checkbox"
                        checked={selectedFacility[item]}
                        onChange={() => handleFacilityClick(item)}
                        className="accent-orange-500"
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
                  {selected.map((emp) => (
                    <div
                      key={emp._id}
                      className="flex justify-between items-center"
                    >
                      <p className="text-sm text-gray-600">{emp.name}</p>
                      <button
                        onClick={() =>
                          setSelected(selected.filter((e) => e._id !== emp._id))
                        }
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
                              className="mt-2 "
                              type="checkbox"
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
                      value={timings[day]?.open || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "open", e.target.value)
                      }
                      className="input"
                    />

                    <input
                      type="time"
                      value={timings[day]?.close || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "close", e.target.value)
                      }
                      className="input"
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
