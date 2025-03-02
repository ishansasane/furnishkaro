import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import TaskDialog from "../compoonents/TaskDialog";


interface Task {
  task: string;
  description: string;
  date: string;
  time: string;
  assignee: string;
  priority: "High" | "Moderate" | "Low";
  status: "Pending" | "In Progress" | "Completed";
}

const initialTasks: Task[] = [
  {
    task: "Design UI",
    description: "Create homepage wireframe",
    date: "2025-02-23",
    time: "10:00 AM",
    assignee: "John Doe",
    priority: "High",
    status: "Pending",
  },
  {
    task: "Backend Setup",
    description: "Initialize database schema",
    date: "2025-02-24",
    time: "12:30 PM",
    assignee: "Jane Smith",
    priority: "Moderate",
    status: "In Progress",
  },
];

export default function Tasks() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const filteredTasks = tasks.filter((task) =>
    task.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">✅ Tasks</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => setDialogOpen(true)}
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="border px-3 py-2 rounded-md w-full mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Task</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Assignee</th>
            <th className="border px-4 py-2">Priority</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task, index) => (
            <tr key={index} className="border">
              <td className="border px-4 py-2">{task.task}</td>
              <td className="border px-4 py-2">{task.description}</td>
              <td className="border px-4 py-2">{task.date}</td>
              <td className="border px-4 py-2">{task.time}</td>
              <td className="border px-4 py-2">{task.assignee}</td>
              <td className="border px-4 py-2">{task.priority}</td>
              <td className="border px-4 py-2">{task.status}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button className="border px-2 py-1 rounded-md bg-gray-300">
                  <Edit size={16} />
                </button>
                <button className="border px-2 py-1 rounded-md bg-red-500 text-white">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Task Dialog */}
      {isDialogOpen && <TaskDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
}
