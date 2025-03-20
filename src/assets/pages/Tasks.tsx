import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Edit, Trash2, Plus, MoreVertical } from "lucide-react";
import TaskDialog from "../compoonents/TaskDialog";
import { setTasks } from "../Redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
=======
import { Edit, Trash2, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { setTasks } from "../Redux/dataSlice";
import TaskDialog from "../compoonents/TaskDialog";
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a

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
<<<<<<< HEAD
=======

const deleteTask = async (name, setdeleted, deleted) => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title: name }),
  });
  setdeleted(!deleted);
};
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a

export default function Tasks() {
  const [tasks, settasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [editing, setediting] = useState(null);
  const [deleted, setdeleted] = useState(false);
<<<<<<< HEAD
  const [refresh, setrefresh] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); // Track which dropdown is open
  const [filter, setFilter] = useState("All Tasks");

  const dispatch = useDispatch();
  const taskData = useSelector((state: RootState) => state.data.tasks);

  const deleteTask = async (name: string) => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: name }),
    });

    setdeleted(!deleted);
    setrefresh(true);
  };
=======
  const [filter, setFilter] = useState("All");

  const dispatch = useDispatch();
  const taskData = useSelector((state: RootState) => state.data.tasks);
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTaskData();
<<<<<<< HEAD
      
      // Sort tasks by date in ascending order
      const sortedTasks = data.sort((a, b) => {
        return new Date(a[2]).getTime() - new Date(b[2]).getTime();
      });
  
      dispatch(setTasks(sortedTasks));
      settasks(sortedTasks);
    }
  
    if (taskData.length === 0) {
      getTasks();
    } else {
      // Ensure sorting is applied even if tasks are already in Redux store
      const sortedTaskData = [...taskData].sort((a, b) => {
        return new Date(a[2]).getTime() - new Date(b[2]).getTime();
      });
  
      settasks(sortedTaskData);
=======
      dispatch(setTasks(data));
      settasks(taskData);
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a
    }
    if (taskData.length === 0) getTasks();
    else settasks(taskData);
  }, [dispatch, taskData]);
  

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTaskData();
      dispatch(setTasks(data));
<<<<<<< HEAD
      settasks(data);
    }
    if (refresh) {
=======
      settasks(taskData);
    }
    if (deleted || editing) {
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a
      getTasks();
      setrefresh(false);
    }
<<<<<<< HEAD
  }, [refresh]);
=======
  }, [deleted, editing]);
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a

  const editData = (n: string) => {
    setName(n);
    setDialogOpen(true);
  };
<<<<<<< HEAD
=======

  // Filter tasks based on selected category
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task[6] === filter;
  });
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a

  const filterOptions = [
    { label: "All Tasks", value: "All Tasks" },
    { label: "To Do", value: "To Do" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
<<<<<<< HEAD
        <h1 className="text-2xl font-bold">✅ Tasks</h1>
        <button onClick={() => setDialogOpen(true)} style={{ borderRadius : "8px" }} className="flex items-center gap-2 bg-blue-600 rounded-3xl shadow-2xl text-white px-4 py-2"><Plus size={18}/> Add Task</button>
      </div>
      <div className="flex space-x-4 border-b pb-2 mb-4 lg:gap-4">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            className={`px-4 py-2 rounded transition ${
              filter === option.value ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(option.value)}
          >   
            {option.label}
          </button>
        ))}
      </div>
=======
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

>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a
      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
<<<<<<< HEAD
        className="border px-3 py-2 rounded-md w-[20vw] mb-4"
=======
        className="border px-3 py-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Table */}
<<<<<<< HEAD
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Task</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Assignee</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            task[7] == `${filter}` || filter == "All Tasks" ?  <tr key={index}>
            <td className="px-4 py-2">{task[0]}</td>
            <td className="px-4 py-2">{task[6]}</td>
            <td className="px-4 py-2">{task[5]}</td>
            <td className="px-4 py-2">{task[2]}</td>
            <td className="px-4 py-2">{task[3]}</td>
            <td className="px-4 py-2">{task[4]}</td>
            <td className="px-4 py-2">{task[7]}</td>
            <td className="px-4 py-2 relative">
              {/* Three Dots Menu */}
              <button
                className="p-2 hover:bg-gray-200 rounded-full"
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
              >
                <MoreVertical size={18} />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === index && (
                <div className="absolute w-32 bg-white shadow-md rounded-md z-[50] border">
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      editData(task[0]);
                      setOpenDropdown(null);
                      setediting(task);
                    }}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2"
                    onClick={() => {
                      deleteTask(task[0]);
                      setOpenDropdown(null);
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </td>
          </tr> : null
          ))}
        </tbody>
      </table>

      {/* Add Task Dialog */}
      {isDialogOpen && (
        <TaskDialog
          onClose={() => setDialogOpen(false)}
          isEditing={editing}
          setediting={setediting}
          name={name}
          setrefresh={setrefresh}
        />
      )}
=======
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
>>>>>>> b6f16bd0f26a8d75ae5a966033bbd3777376533a
    </div>
  );
}
