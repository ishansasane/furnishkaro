import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { setTasks } from "../Redux/dataSlice";
import TaskDialog from "../compoonents/TaskDialog";

interface Task {
  task: string;
  description: string;
  date: string;
  assignee: string;
  priority: "High" | "Moderate" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  project: string;
}

const fetchTaskData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
  const data = await response.json();
  return data.body;
};

const deleteTask = async (name, setdeleted, deleted) => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title: name }),
  });
  setdeleted(!deleted);
};

export default function Tasks() {
  const [tasks, settasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [editing, setediting] = useState(false);
  const [deleted, setdeleted] = useState(false);
  const [filter, setFilter] = useState("All");

  const dispatch = useDispatch();
  const taskData = useSelector((state: RootState) => state.data.tasks);

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTaskData();
      dispatch(setTasks(data));
      settasks(taskData);
    }
    if (taskData.length === 0) getTasks();
    else settasks(taskData);
  }, [dispatch, taskData]);

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTaskData();
      dispatch(setTasks(data));
      settasks(taskData);
    }
    if (deleted || editing) {
      getTasks();
      setdeleted(false);
      setediting(false);
    }
  }, [deleted, editing]);

  const editData = (n) => {
    setName(n);
    setediting(true);
    setDialogOpen(true);
  };

  // Filter tasks based on selected category
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task[6] === filter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">✅ Tasks</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
          onClick={() => setDialogOpen(true)}
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-4">
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-md border shadow-sm transition ${
              filter === status ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="border px-3 py-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-3 text-left">Task</th>
              <th className="border px-4 py-3 text-left">Project</th>
              <th className="border px-4 py-3 text-left">Date & Time</th>
              <th className="border px-4 py-3 text-left">Assignee</th>
              <th className="border px-4 py-3 text-left">Priority</th>
              <th className="border px-4 py-3 text-left">Status</th>
              <th className="border px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={index} className="border hover:bg-gray-50 transition">
                <td className="border px-4 py-3">
                  <span className="font-semibold">{task[0]}</span>
                  <p className="text-sm text-gray-500">{task[1]}</p>
                </td>
                <td className="border px-4 py-3">{task[2]}</td>
                <td className="border px-4 py-3">{task[3]}</td>
                <td className="border px-4 py-3">{task[4]}</td>
                <td className="border px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-white ${
                      task[5] === "High" ? "bg-red-500" : task[5] === "Moderate" ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  >
                    {task[5]}
                  </span>
                </td>
                <td className="border px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-white ${
                      task[6] === "Pending"
                        ? "bg-gray-500"
                        : task[6] === "In Progress"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task[6]}
                  </span>
                </td>
                <td className="border px-4 py-3 flex gap-2">
                  <button
                    className="border px-3 py-1 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                    onClick={() => editData(task[0])}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="border px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={() => deleteTask(task[0], setdeleted, deleted)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Task Dialog */}
      {isDialogOpen && <TaskDialog onClose={() => setDialogOpen(false)} isEditing={editing} setediting={() => setediting(false)} name={name} />}
    </div>
  );
}
