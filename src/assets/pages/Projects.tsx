import { useState } from "react";
import { Edit, Trash2, Plus,  } from "lucide-react";
import { Link } from "react-router-dom";

// Define the type for a project
interface Project {
  id: number;
  projectName: string;
  customerName: string;
  status: string;
  amount: string;
  received: string;
  due: string;
  createdBy: string;
  date: string;
  quote: string;
}

// Sample project data
const projectsData: Project[] = [
  {
    id: 1,
    projectName: "Project Alpha",
    customerName: "John Doe",
    status: "approved",
    amount: "₹50,000",
    received: "₹30,000",
    due: "₹20,000",
    createdBy: "Admin",
    date: "2025-02-23",
    quote: "Quote123",
  },
  {
    id: 2,
    projectName: "Project Beta",
    customerName: "Jane Smith",
    status: "good pending",
    amount: "₹70,000",
    received: "₹40,000",
    due: "₹30,000",
    createdBy: "Sales Team",
    date: "2025-02-22",
    quote: "Quote456",
  },
];

// Status filter options
const statusFilters = [
  "all",
  "approved",
  "good pending",
  "goods complete",
  "tailor complete",
  "tailor pending",
] as const;

export default function Projects() {
  const [projects] = useState<Project[]>(projectsData);
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("all");

  // Filter projects based on selected status
  const filteredProjects =
    filter === "all" ? projects : projects.filter((proj) => proj.status === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🚀 Projects</h1>
        <Link to="/add-project">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md">
          <Plus size={18} /> Add Project
        </button>
        </Link>
      </div>

      <div className="mb-4 flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as (typeof statusFilters)[number])}
          className="border px-3 py-2 rounded-md"
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input type="text" placeholder="Search projects..." className="border px-3 py-2 rounded-md" />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Project Name</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Received</th>
            <th className="border px-4 py-2">Due</th>
            <th className="border px-4 py-2">Created By</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Quote</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id} className="border">
              <td className="border px-4 py-2">{project.projectName}</td>
              <td className="border px-4 py-2">{project.customerName}</td>
              <td className="border px-4 py-2">{project.status}</td>
              <td className="border px-4 py-2">{project.amount}</td>
              <td className="border px-4 py-2">{project.received}</td>
              <td className="border px-4 py-2">{project.due}</td>
              <td className="border px-4 py-2">{project.createdBy}</td>
              <td className="border px-4 py-2">{project.date}</td>
              <td className="border px-4 py-2">{project.quote}</td>
              <td className="border px-4 py-2">
                <div className="flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300">
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
