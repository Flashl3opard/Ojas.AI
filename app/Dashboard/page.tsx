"use client";

import { useState, useMemo } from "react";
import {
  FiPlus,
  FiUsers,
  FiActivity,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";
import Navbar from "../components/Navbar";

type Patient = {
  id: string;
  name: string;
  age?: number;
  sex?: "M" | "F" | "O";
  dosha: "Vata" | "Pitta" | "Kapha" | "Mixed";
  status: "On Plan" | "Follow-up Due" | "New" | "Completed";
  adherence?: number; // %
};

export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "p1",
      name: "Ansh Bire",
      dosha: "Vata",
      status: "On Plan",
      adherence: 78,
      age: 32,
      sex: "M",
    },
    {
      id: "p2",
      name: "Indrapal",
      dosha: "Pitta",
      status: "Follow-up Due",
      adherence: 55,
      age: 27,
      sex: "F",
    },
    {
      id: "p3",
      name: "Shobhit",
      dosha: "Kapha",
      status: "New",
      adherence: 0,
      age: 45,
      sex: "M",
    },
    {
      id: "p4",
      name: "Vanshikha",
      dosha: "Vata",
      status: "On Plan",
      adherence: 90,
      age: 38,
      sex: "F",
    },
    {
      id: "p5",
      name: "Yash",
      dosha: "Pitta",
      status: "Completed",
      adherence: 100,
      age: 50,
      sex: "M",
    },
  ]);

  const [query, setQuery] = useState("");
  const [doshaFilter, setDoshaFilter] = useState<"" | Patient["dosha"]>("");
  const [statusFilter, setStatusFilter] = useState<"" | Patient["status"]>("");
  const [showAdd, setShowAdd] = useState(false);

  // Add patient state
  const [newPatientName, setNewPatientName] = useState("");
  const [newDosha, setNewDosha] = useState<Patient["dosha"]>("Vata");
  const [newStatus, setNewStatus] = useState<Patient["status"]>("New");
  const [newAge, setNewAge] = useState<number | "">("");
  const [newSex, setNewSex] = useState<Patient["sex"]>("O");

  // Metrics
  const totals = useMemo(() => {
    const totalPatients = patients.length;
    const activePlans = patients.filter((p) => p.status === "On Plan").length;
    const followUps = patients.filter(
      (p) => p.status === "Follow-up Due"
    ).length;
    const alerts = patients.filter((p) => (p.adherence ?? 0) < 50).length;
    return { totalPatients, activePlans, followUps, alerts };
  }, [patients]);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (doshaFilter && p.dosha !== doshaFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      return true;
    });
  }, [patients, query, doshaFilter, statusFilter]);

  function handleAddPatient(e?: React.FormEvent) {
    e?.preventDefault();
    if (!newPatientName.trim()) return;
    const id = "p" + (patients.length + 1);
    const p: Patient = {
      id,
      name: newPatientName.trim(),
      dosha: newDosha,
      status: newStatus,
      adherence: 0,
      age: typeof newAge === "number" ? newAge : undefined,
      sex: newSex,
    };
    setPatients((s) => [p, ...s]);
    setShowAdd(false);
    setNewPatientName("");
    setNewDosha("Vata");
    setNewStatus("New");
    setNewAge("");
    setNewSex("O");
  }
  type CardProps = {
    title: string;
    value: number;
    icon: React.ReactNode;
    className?: string; // ✅ allow extra styling
  };
  const Card: React.FC<CardProps> = ({ title, value, icon, className }) => {
    return (
      <div
        className={`p-6 rounded-2xl shadow-lg flex items-center gap-4 ${className}`}
      >
        <div className="p-3 bg-white rounded-full">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Dr. Armaan Gupta's Dashboard
              </h1>
              <p className="text-gray-500">
                Manage patients, diet plans & adherence
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search patients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border rounded-lg px-3 py-2 shadow-sm outline-none w-48"
              />
              <button
                onClick={() => setShowAdd(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 flex items-center gap-2"
              >
                <FiPlus /> Add Patient
              </button>
            </div>
          </header>

          {/* Stats cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-3xl ">
            <Card
              className="bg-green-50"
              title="Total Patients"
              value={totals.totalPatients}
              icon={<FiUsers className="text-green-600 text-2xl" />}
            />
            <Card
              className="bg-blue-50"
              title="Active Diet Plans"
              value={totals.activePlans}
              icon={<FiActivity className="text-blue-600 text-2xl" />}
            />
            <Card
              className="bg-yellow-50"
              title="Follow-ups Due"
              value={totals.followUps}
              icon={<FiRefreshCw className="text-yellow-500 text-2xl" />}
            />
            <Card
              className="bg-red-50"
              title="Low Adherence Alerts"
              value={totals.alerts}
              icon={<FiAlertTriangle className="text-red-500 text-2xl" />}
            />
          </section>

          {/* Patients Table */}
          <section className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Patient List</h2>
              <span className="text-sm text-gray-500">
                {filtered.length} results
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200">
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 font-medium">Age / Sex</th>
                    <th className="p-3 font-medium">Dosha</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Adherence</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-25"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {p.name}
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {p.age ?? "-"} / {p.sex}
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {p.dosha}
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {p.status}
                      </td>
                      <td className="p-3">
                        <div className="w-28 bg-gray-50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${p.adherence ?? 0}%`,
                              background:
                                (p.adherence ?? 0) >= 75
                                  ? "#10b981"
                                  : (p.adherence ?? 0) >= 50
                                  ? "#f59e0b"
                                  : "#ef4444",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {p.adherence ?? 0}%
                        </span>
                      </td>
                      <td className="p-3 flex gap-2 justify-center">
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
                          View
                        </button>
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-400">
                        No patients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Add Patient Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <form
            onSubmit={handleAddPatient}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold">Add New Patient</h3>
            <input
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              placeholder="Full name"
              required
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Age"
                min={0}
                value={newAge}
                onChange={(e) =>
                  setNewAge(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="flex-1 border rounded px-3 py-2"
              />
              <select
                value={newSex}
                onChange={(e) => setNewSex(e.target.value as Patient["sex"])}
                className="border rounded px-3 py-2"
              >
                <option value="O">Other</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <select
              value={newDosha}
              onChange={(e) => setNewDosha(e.target.value as Patient["dosha"])}
              className="w-full border rounded px-3 py-2"
            >
              <option>Vata</option>
              <option>Pitta</option>
              <option>Kapha</option>
              <option>Mixed</option>
            </select>
            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as Patient["status"])
              }
              className="w-full border rounded px-3 py-2"
            >
              <option>New</option>
              <option>On Plan</option>
              <option>Follow-up Due</option>
              <option>Completed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

/* Small reusable stat card */
function Card({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );
}
