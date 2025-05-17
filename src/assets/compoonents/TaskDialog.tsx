import { useEffect, useState } from "react";
import { setTaskDialogOpen, setTasks } from "../Redux/dataSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface TaskDialogProps {
  onClose: () => void;
  name: string;
  setrefresh: (val: boolean) => void;
}

const fetchTaskData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
  const data = await response.json();
  if(data.body){
    return data.body;
  }else{
    return [];
  }
};

const TaskDialog: React.FC<TaskDialogProps> = ({ setAdded, onClose, isEditing, setediting, name, setrefresh, projectData, taskDialogOpen, setProjectFlag, setTaskDialogOpen }) => {
  const [taskName, setTaskName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [dateTime, setDateTime] = useState(undefined);
  const [assignee, setAssignee] = useState(undefined);
  const [project, setProject] = useState(undefined);
  const [priority, setPriority] = useState(isEditing ? isEditing[6] : "Moderate");
  const [status, setStatus] = useState(isEditing ? isEditing[7] : "To Do");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(isEditing != undefined){
      setTaskName(isEditing[0]);
      setDescription(isEditing[1]);
      setDateTime(isEditing[2]);
      setAssignee(isEditing[4]);
      setProject(isEditing[5]);
      setPriority(isEditing[6]);
      setStatus(isEditing[7]);
    }

  }, [isEditing]);

const addTask = async () => {
  if (!dateTime) {
    alert("Please select a date and time");
    return;
  }

  try {
    const now = new Date();
    const date = now.toISOString().slice(0, 16); // Extract ISO datetime

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addtask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: taskName,
        description,
        dateTime, // Actual selected date
        date,     // Current date for log or creation
        assigneeLink: assignee,
        projectLink: project,
        priority,
        status,
      }),
    });

    if (response.status === 200) {
      alert("Task Added");

      // Re-fetch tasks after adding
      const updatedTasks = await fetchTaskData();
      const sortedTasks = updatedTasks.sort(
        (a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()
      );

      dispatch(setTasks(sortedTasks));

      // Optional: update cache
      localStorage.setItem("taskData", JSON.stringify({ data: sortedTasks, time: Date.now() }));

      // Reset & close dialog
      setediting(null);
      setrefresh(true);
      onClose();
    } else {
      alert("Error adding task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    alert("Something went wrong while adding the task.");
  }
};


const editTask = async () => {
  try {
    const date = isEditing[3];

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updatetask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: taskName,
        description,
        dateTime, // Date
        date,     // Time
        assigneeLink: assignee,
        projectLink: project,
        priority,
        status,
      }),
    });

    if (response.status === 200) {
      alert("Task updated");

      // Re-fetch tasks after update
      const updatedTasks = await fetchTaskData();
      const sortedTasks = updatedTasks.sort((a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime());

      dispatch(setTasks(sortedTasks));

      // Optional: Update localStorage cache
      localStorage.setItem("taskData", JSON.stringify({ data: sortedTasks, time: Date.now() }));

      // Close dialog & reset states
      setediting(null);
      setrefresh(true);
      onClose();
    } else {
      alert("Error updating task");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Something went wrong while updating the task.");
  }
};

  const cancel = () => {
    const flag = taskDialogOpen;
    if(flag){
      dispatch(setProjectFlag(true));
      navigate("/projects");
      dispatch(setTaskDialogOpen(false));
    }
    setediting(null);
    onClose();
  };

  return (
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
      {/* Dialog Box */}
      <div className="relative bg-white shadow-lg rounded-lg p-6 w-full border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 {isEditing ? "Edit Task" : "Add Task"}</h2>

        {/* Task Name */}
        {!isEditing && (
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
        )}

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        ></textarea>

        {/* Date & Time */}
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Assignee */}
        <input
          type="text"
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Project Selection */}
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Project</option>
          {projectData.map((project, index) => (
            <option key={index} value={project.projectName}>{project.projectName}</option>
          ))}
        </select>

        {/* Priority Selection */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

        {/* Status Selection */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={cancel} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
          <button onClick={isEditing ? editTask : addTask} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isEditing ? "Edit Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDialog;
