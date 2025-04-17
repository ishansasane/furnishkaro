import { useState } from "react";
import { setTaskDialogOpen } from "../Redux/dataSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface TaskDialogProps {
  onClose: () => void;
  name: string;
  setrefresh: (val: boolean) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ onClose, isEditing, setediting, name, setrefresh, projectData, taskDialogOpen, setProjectFlag }) => {
  const [taskName, setTaskName] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [dateTime, setDateTime] = useState(undefined);
  const [assignee, setAssignee] = useState(undefined);
  const [project, setProject] = useState(undefined);
  const [priority, setPriority] = useState(isEditing ? isEditing[6] : "Moderate");
  const [status, setStatus] = useState(isEditing ? isEditing[7] : "To Do");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addTask = async () => {
    if (!dateTime) {
      alert("Please select a date and time");
      return;
    }

    let date = undefined;
    const now = new Date();
    date = now.toISOString().slice(0,16);
    // Splitting Date & Time

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/addtask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: taskName,
        description,
        dateTime, // Sending only date
        date, // Sending only time
        assigneeLink: assignee,
        projectLink: project,
        priority,
        status,
      }),
    });

    if (response.status === 200) {
      alert("Task Added");
    } else {
      alert("Error adding task");
    }
    setrefresh(true);
    onClose();
  };

  const editTask = async () => {
    // Splitting Date & Time
    const date = isEditing[3]

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updatetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: name,
        description,
        dateTime, // Sending only date
        date, // Sending only time
        assigneeLink: assignee,
        projectLink: project,
        priority,
        status,
      }),
    });

    if (response.status === 200) {
      alert("Task updated");
    } else {
      alert("Error updating task");
    }
    setediting(null);
    setrefresh(true);
    onClose();
  };

  const cancel = () => {
    const flag = taskDialogOpen;
    dispatch(setTaskDialogOpen(false));
    if(flag){
      dispatch(setProjectFlag(true));
      navigate("/projects");
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
            value={isEditing ? isEditing[0] : taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
        )}

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={isEditing && description == undefined ? isEditing[1] : description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        ></textarea>

        {/* Date & Time */}
        <input
          type="datetime-local"
          value={isEditing && dateTime == undefined ? isEditing[2] : dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Assignee */}
        <input
          type="text"
          placeholder="Assignee"
          value={isEditing && assignee == undefined ? isEditing[4] : assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Project Selection */}
        <select
          value={isEditing && project == undefined ? isEditing[5] : project}
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
          value={isEditing && priority == undefined ? isEditing[6] : priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

        {/* Status Selection */}
        <select
          value={isEditing && status == undefined ? isEditing[7] : status}
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
