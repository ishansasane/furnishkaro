import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, MoreVertical } from "lucide-react";
import TaskDialog from "../compoonents/TaskDialog";
import { setTasks } from "../Redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
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

export default function Tasks() {
  const [tasks, settasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [editing, setediting] = useState(null);
  const [deleted, setdeleted] = useState(false);
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

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTaskData();
      
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
    }
    if (taskData.length === 0) getTasks();
    else settasks(taskData);
  }, [dispatch, taskData]);
  

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTaskData();
      dispatch(setTasks(data));
      settasks(data);
    }
    if (refresh) {
      getTasks();
      setrefresh(false);
    }
  }, [refresh]);

  const editData = (n: string) => {
    setName(n);
    setDialogOpen(true);
  };

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
      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="border px-3 py-2 rounded-md w-[20vw] mb-4"
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-sky-50">
          <tr>
            <th className="px-4 py-2">Task</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Due Date</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Assignee</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            task[7] == `${filter}` || filter == "All Tasks" ?  <tr key={index} className="hover:bg-sky-50">
            <td className="px-4 py-2">{task[0]}</td>
            <td className={`${task[6] == "High" ? "text-red-600" : ""} ${task[6] == "Low" ? "text-green-600" : ""} ${task[6] == "Moderate" ? "text-yellow-400" : ""} font-bold px-4`}>{task[6]}</td>
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

    </div>
  );
}
