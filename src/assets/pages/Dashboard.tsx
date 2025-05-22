import { useState, useEffect } from "react";
import Card from "./CardPage";
import DeadlineCard from "../compoonents/DeadlineCard";
import TaskCard from "../compoonents/TaskCard";
import InquiryCard from "../compoonents/InquiryCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store.ts";
import { setTasks, setProjects } from "../Redux/dataSlice.ts";

const Dashboard: React.FC = () => {
  const [isTaskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.data.tasks);
  const projects = useSelector((state: RootState) => state.data.projects);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, projectRes] = await Promise.all([
          fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks", { credentials: "include" }),
          fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata", { credentials: "include" }),
        ]);

        if (!taskRes.ok || !projectRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const taskData = await taskRes.json();
        const projectData = await projectRes.json();

        dispatch(setTasks(taskData.body || []));
        dispatch(setProjects(projectData.body || []));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (tasks.length === 0 || projects.length === 0) {
      fetchData();
    }
  }, [tasks.length, projects.length, dispatch, refresh]);

  const handleDelete = () => {
    // Placeholder for delete functionality
    console.log("Delete task:", selectedTask);
    setTaskDialogOpen(false);
  };

  const handleMarkAsCompleted = () => {
    // Placeholder for mark as completed functionality
    console.log("Mark as completed:", selectedTask);
    setTaskDialogOpen(false);
  };

  return (
    <div className="p-6 md:mt-0 mt-20 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, User 👋</h1>
        <Link to="/add-project">
          <button className="bg-indigo-600  text-white px-5 py-2 !rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
            + Add Project
          </button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Orders" value={120} color="bg-blue-500" className="w-full max-w-sm" />
        <Card title="Total Value" value={500000} color="bg-green-500" isCurrency />
        <Card title="Payment Received" value={320000} color="bg-purple-500" isCurrency />
        <Card title="Payment Due" value={180000} color="bg-red-500" isCurrency />
      </div>

      {/* Deadlines & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Project Deadlines */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📅 Project Deadlines</h2>
          <div className="space-y-4">
            {projects &&
              projects.map((project, index) => (
                <DeadlineCard project={project[0]} date={project[5]} key={index} />
              ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white shadow-lg rounded-xl p-6 col-span-2">
          <div className="flex justify-between items-center mb-4">
            <Link to="/tasks" className="!no-underline">
              <h1 className="text-xl font-semibold text-gray-800">📝 Tasks</h1>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto h-96 pr-2">
            {tasks.map((task, index) => (
              <div key={index} onClick={() => { setSelectedTask(task); setTaskDialogOpen(true); }}>
                <TaskCard
                  task={task[0]}
                  description={task[1]}
                  date={task[2]}
                  time={task[3]}
                  assignee={task[4]}
                  priority={task[5]}
                  status={task[6]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries */}
      <div className="bg-white shadow-lg rounded-xl p-6 mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📩 Inquiries</h2>
        <div className="flex flex-wrap gap-6 overflow-x-auto pb-4">
          <InquiryCard
            project="E-commerce Website"
            comments="Client wants a Shopify integration."
            inquiryDate="Feb 15, 2025"
            followUpDate="Feb 28, 2025"
          />
          <InquiryCard
            project="Mobile App for Gym"
            comments="Needs a booking system & payment gateway."
            inquiryDate="Feb 20, 2025"
            followUpDate="March 5, 2025"
          />
          <InquiryCard
            project="Real Estate CRM"
            comments="Looking for a cloud-based solution."
            inquiryDate="Feb 25, 2025"
            followUpDate="March 10, 2025"
          />
        </div>
      </div>

      {/* Floating Modal */}
      {isTaskDialogOpen && selectedTask && (
        <div className=" fixed inset-0  backdrop-blur-sm bg-black/50  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative border border-gray-200">
            <button
              onClick={() => setTaskDialogOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2 text-gray-800">📝 {selectedTask[0]}</h2>
            <p className="text-sm text-gray-600 mb-4">By {selectedTask[4]}</p>
            <div className="space-y-3  p-3 text-gray-700 text-sm">
              <p className="flex justify-between"><strong>Priority :</strong> <span className={`inline-block px-2 py-1 rounded text-white ${selectedTask[5].toLowerCase() === 'high' ? 'bg-red-500' : selectedTask[5].toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>{selectedTask[5]}</span></p>
              <hr />
              <p className="flex justify-between"><strong>Status :</strong> <span className={`inline-block px-2 py-1 rounded text-white ${selectedTask[6].toLowerCase() === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`}>{selectedTask[6]}</span></p>
              <hr />
              <p className="flex justify-between"><strong>Project :</strong> <span className="text-blue-600">{selectedTask[1]}</span></p>
              <hr />
              <p className="flex justify-between"><strong>Assignee :</strong> {selectedTask[4]}</p>
              <hr />
              <p className="flex justify-between"><strong>Assigned by :</strong> {selectedTask[4]}</p>
              <hr />
              <p className="flex justify-between"><strong>Due date & time :</strong> {selectedTask[2]}, {selectedTask[3]}</p>
               <hr />
            </div>
            <div className="flex justify-between mt-6">  
              <button
                onClick={handleDelete}
                className="bg-white border !border-red-500 text-red-500 px-4 py-2 !rounded-lg hover:!bg-red-500 hover:!text-white transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleMarkAsCompleted}
                className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 !rounded-lg hover:bg-gray-300 transition-colors"
              >
                <span className="mr-2">✔</span> Mark As Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;