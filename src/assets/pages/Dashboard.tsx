import { useState, useEffect } from "react";
import Card from "./CardPage";
import DeadlineCard from "../compoonents/DeadlineCard";
import TaskCard from "../compoonents/TaskCard";
import InquiryCard from "../compoonents/InquiryCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store.ts";
import { setTasks, setProjects, setPaymentData, setProjectFlag } from "../Redux/dataSlice.ts";
import TaskDialog from "../compoonents/TaskDialog.tsx";
import { AnimatePresence, motion } from "framer-motion";
import EditProjects from "./EditProjects.tsx";
import { useNavigate } from "react-router-dom";

const fetchTaskData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
  const data = await response.json();
  if(data.body){
    return data.body;
  }else{
    return [];
  }
};

const Dashboard: React.FC = () => {
  const [isTaskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const tasks  = useSelector((state: RootState) => state.data.tasks);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const projects  = useSelector((state: RootState) => state.data.projects);
    const paymentData = useSelector((state : RootState) => state.data.paymentData);
    const projectsData = useSelector((state : RootState) => state.data.projects);
    const [Amount, setAmount] = useState(0);
    const [Tax, setTax] = useState(0);
    const [projectDiscount, setProjectDiscount] = useState(0);

    const navigate = useNavigate();

    const [index, setIndex] = useState(null);
    const [flag, setFlag] = useState(false);
    const [sendProject, setSendProject] = useState([]);

    const [totalPayment, setTotalPayment] = useState(0);
    const [Discount, setDiscount] = useState(0);

    const [selectedTask, setSelectedTask] = useState([]);

    const [refresh, setRefresh] = useState(true);

const deleteTask = async (name: string) => {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: name }),
    });

    if (response.status === 200) {
      alert("Task deleted");

      // Fetch updated tasks
      const updatedTasks = await fetchTaskData();
      const sortedTasks = updatedTasks.sort(
        (a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()
      );

      // Update Redux and local state
      dispatch(setTasks(sortedTasks));

      // Optionally cache the updated tasks
      localStorage.setItem("taskData", JSON.stringify({ data: sortedTasks, time: Date.now() }));

      // Reset selected task
      setSelectedTask(null);

      // Toggle refresh to update other components if needed
      setRefresh(prev => !prev);
    } else {
      alert("Error deleting task");
    }
    setTaskDialogOpen(false);
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Something went wrong while deleting the task.");
  }
};


useEffect(() => {
  let isMounted = true;

  const fetchTasks = async () => {
    try {
      const cached = localStorage.getItem("taskData");
      const now = Date.now();

      if (cached && !refresh) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data?.length > 0) {
          if (isMounted) {
            const filtered = parsed.data.filter(task => task[7] !== "Completed");
            dispatch(setTasks(parsed.data));
            setFilteredTasks(filtered);
          }
          return;
        }
      }

      const taskRes = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks", {
        credentials: "include"
      });

      if (!taskRes.ok) {
        throw new Error("❌ Failed to fetch tasks");
      }

      const taskData = await taskRes.json();
      const tasksList = taskData.body || [];

      if (isMounted) {
        const filtered = tasksList.filter(task => task[7] !== "Completed");
        dispatch(setTasks(tasksList));
        setFilteredTasks(filtered);
        localStorage.setItem("taskData", JSON.stringify({ data: tasksList, time: now }));
      }
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  };

  fetchTasks();

  return () => {
    isMounted = false;
  };
}, [dispatch, refresh]);


  const fetchProjectData = async () => {
    const response = await fetch(
      "https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata",
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.body || !Array.isArray(data.body)) {
      throw new Error("Invalid data format: Expected an array in data.body");
    }

    const parseSafely = (value: any, fallback: any) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value || fallback;
      } catch (error) {
        console.warn("Invalid JSON:", value, error);
        return fallback;
      }
    };

    const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

    const fixBrokenArray = (input: any): string[] => {
      if (Array.isArray(input)) return input;
      if (typeof input !== "string") return [];

      try {
        const fixed = JSON.parse(input);
        if (Array.isArray(fixed)) return fixed;
        return [];
      } catch {
        try {
          const cleaned = input
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map((item: string) => item.trim().replace(/^"+|"+$/g, ""));
          return cleaned;
        } catch {
          return [];
        }
      }
    };

    const projects = data.body.map((row: any[]) => ({
      projectName: row[0],
      customerLink: parseSafely(row[1], []),
      projectReference: row[2] || "",
      status: row[3] || "",
      totalAmount: parseFloat(row[4]) || 0,
      totalTax: parseFloat(row[5]) || 0,
      paid: parseFloat(row[6]) || 0,
      discount: parseFloat(row[7]) || 0,
      createdBy: row[8] || "",
      allData: deepClone(parseSafely(row[9], [])),
      projectDate: row[10] || "",
      additionalRequests: parseSafely(row[11], []),
      interiorArray: fixBrokenArray(row[12]),
      salesAssociateArray: fixBrokenArray(row[13]),
      additionalItems: deepClone(parseSafely(row[14], [])),
      goodsArray: deepClone(parseSafely(row[15], [])),
      tailorsArray: deepClone(parseSafely(row[16], [])),
      projectAddress : row[17],
    }));

    return projects;
  };

    const fetchPaymentData = async () => {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments"); 
      const data = await response.json();
      return data.message;
    }

    const [received, setReceived] = useState(0);

    useEffect(() => {

  const fetchData = async () => {
    try {
      // Step 1: Fetch Projects
      const projectRes = await fetchProjectData();
      const projects = projectRes;

      dispatch(setProjects(projects));

      // Calculate total tax, amount, and discount
      let totalTax = 0;
      let totalAmount = 0;
      let discount = 0;

      projects.forEach(project => {
        totalTax += parseFloat(project.totalTax);
        totalAmount += parseFloat(project.totalAmount);
        discount += parseFloat(project.discount);
      });

      setTotalPayment(totalAmount + totalTax);
      setDiscount(discount);

      // Create a Set of valid project names
      const validProjectNames = new Set(projects.map(project => project.projectName));

      // Step 2: Fetch Payments (from cache or fresh)
      const cached = localStorage.getItem("paymentData");
      const now = Date.now();

      if (cached) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data?.length) {
          dispatch(setPaymentData(parsed.data));

          const totalReceived = parsed.data.reduce((acc, payment) => {
            const projectName = payment[1];
            const amount = parseFloat(payment[2]);
            return validProjectNames.has(projectName)
              ? acc + (isNaN(amount) ? 0 : amount)
              : acc;
          }, 0);

          setReceived(totalReceived);
          return;
        }
      }

      // If no valid cache, fetch fresh payments
      const paymentData = await fetchPaymentData();

      if (paymentData) {
        dispatch(setPaymentData(paymentData));
        localStorage.setItem("paymentData", JSON.stringify({ data: paymentData, time: now }));

        const totalReceived = paymentData.reduce((acc, payment) => {
          const projectName = payment[1];
          const amount = parseFloat(payment[2]);
          return validProjectNames.has(projectName)
            ? acc + (isNaN(amount) ? 0 : amount)
            : acc;
        }, 0);

        setReceived(totalReceived);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [dispatch]);

const [taskDialogOpen, setTaskDialog] = useState(false);

const handleMarkAsCompleted = async (status, name) => {
  try {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updatetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: name,
        status,
      }),
    });

    if (response.status === 200) {
      alert("Task marked as completed");

      // Refetch updated tasks
      const updatedTasks = await fetchTaskData();
      const sortedTasks = updatedTasks.sort(
        (a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()
      );

      dispatch(setTasks(sortedTasks));

      // Optionally update localStorage
      localStorage.setItem("taskData", JSON.stringify({ data: sortedTasks, time: Date.now() }));
    } else {
      alert("Error updating task");
    }
    
    setTaskDialogOpen(false);
    // Toggle refresh state to trigger any related effects
    setRefresh(prev => !prev);

  } catch (error) {
    console.error("Error marking task as completed:", error);
    alert("Something went wrong while updating the task.");
  }
};

const [editing, setediting] = useState(null);
const [newrefresh, setrefresh] = useState(false);

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const cached = localStorage.getItem("projectData");
      const now = Date.now();
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes

      if (cached) {
        const parsed = JSON.parse(cached);

        const isCacheValid = parsed?.data?.length > 0 && (now - parsed.time) < cacheExpiry;

        if (isCacheValid) {
          dispatch(setProjects(parsed.data));
          return;
        }
      }

      // If no valid cache, fetch fresh data
      const freshData = await fetchProjectData();

      if (Array.isArray(freshData)) {
        dispatch(setProjects(freshData));
        localStorage.setItem("projectData", JSON.stringify({ data: freshData, time: now }));
      } else {
        console.warn("Fetched project data is not an array:", freshData);
      }

    } catch (error) {
      console.error("Failed to fetch projects:", error);

      // Optional fallback to stale cache if fetch fails
      const fallbackCache = localStorage.getItem("projectData");
      if (fallbackCache) {
        const parsed = JSON.parse(fallbackCache);
        if (parsed?.data?.length > 0) {
          dispatch(setProjects(parsed.data));
        }
      }
    }
  };

  fetchProjects();
}, [dispatch]);

const openProject = (selectedTask) => {
  const name = selectedTask[5]; // Project name from the task

  const index = projects.findIndex(project => project.projectName == name);

  setIndex(index);

  if (index !== -1) {
    const matchedProject = projects[index];

    setSendProject(matchedProject);
    setTax(matchedProject.taxAmount);
    setAmount(matchedProject.totalAmount);
    setProjectDiscount(matchedProject.discount);
    setTaskDialogOpen(false);
    setFlag(true);
  } else {
    console.warn("No matching project found for:", name);
  }
};



   return (
    <div className="p-6 md:mt-0 mt-20 bg-gray-100 min-h-screen">

      {/* Summary Cards Section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ${flag ? "hidden" : ""}`}>
        <div className="flex" onClick={() => navigate("/projects")}><Card title="Orders"  value={projects.length} color="bg-blue-500" className="w-full max-w-sm"/></div>
        <Card title="Total Value" value={Math.round((totalPayment - Discount))} color="bg-purple-500" isCurrency />
        <div className="flex" onClick={() => navigate("/paymentsPage")}><Card title="Payment Received" value={Math.round(received)} color="bg-green-500" isCurrency /></div>
        <div className="flex" onClick={() => navigate("/duePage")}><Card title="Payment Due" value={Math.round(totalPayment - received - Discount)} color="bg-red-500" isCurrency /></div>
      </div>

      {/* Deadlines & Tasks */}
      <div className={`${flag ? "hidden" : ""} grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2`}>
        {/* Project Deadlines */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <p className="md:text-[1.7vw] font-semibold mb-4 text-gray-800"> Project Deadlines</p>
          <div className="space-y-4">
            {projects != undefined && projects.map((project, index) => (
              <div onClick={() => {setSendProject(project); setIndex(index); setTax(project.taxAmount); setAmount(project.totalAmount); setProjectDiscount(project.discount); setFlag(true);}}><DeadlineCard setFlag={setFlag} setTax={setTax} setProjectDiscount={setProjectDiscount} setAmount={setAmount} setSendProject={setSendProject} index={index} setIndex={setIndex} project={project} projectName={project.projectName}  date={project.projectDate} key={index} /></div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white shadow-md rounded-xl p-3 col-span-2">
          <div className="flex flex-row w-full justify-between items-center mb-4">
            <Link to="/tasks" className="!no-underline">
              <p className="md:text-[1.7vw] font-semibold text-gray-800">Tasks</p>
            </Link>
            <button onClick={() => setTaskDialog(true)} style={{ borderRadius : "6px" }} className="mb-2 bg-sky-600 text-white hover:bg-sky-700 px-2 md:text-[1.7vw] py-1">Add Task</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[90vh] pr-2">
            {filteredTasks != undefined && filteredTasks.map((task, index) => (
              <div key={index} onClick={() => { setSelectedTask(task); setTaskDialogOpen(true); }}>
                <TaskCard
                    taskData={task}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
            <AnimatePresence>
        {taskDialogOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => (setTaskDialog(false))}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <TaskDialog
                onClose={() => setTaskDialog(false)}
                projectData={projects}
                setTaskDialogOpen={setTaskDialog}
                taskDialogOpen={taskDialogOpen}
                setProjectFlag={setProjectFlag}
                dashboard={true}
                setediting={setediting}
                setrefresh={setRefresh}
                refresh={refresh}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Inquiries */}
      <div className={`bg-white shadow-md rounded-xl p-6 mt-2 ${flag ? "hidden" : ""}`}>
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
            <div className="space-y-3 p-3 text-gray-700 text-sm">
              <p className="flex justify-between"><strong>Priority :</strong> <span className={`inline-block px-2 py-1 rounded text-white ${selectedTask[6].toLowerCase() === 'high' ? 'bg-red-500' : selectedTask[6].toLowerCase() === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}>{selectedTask[6]}</span></p>
              <hr />
              <p className="flex justify-between"><strong>Status :</strong> <span className={`inline-block px-2 py-1 rounded text-white ${selectedTask[7].toLowerCase() === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`}>{selectedTask[7]}</span></p>
              <hr />
              <p onClick={() => openProject(selectedTask)} className="flex justify-between"><strong>Project :</strong> <span className="text-blue-600">{selectedTask[5]}</span></p>
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
                onClick={() => deleteTask(selectedTask[0])}
                className="bg-white border !border-red-500 text-red-500 px-4 py-2 !rounded-lg hover:!bg-red-500 hover:!text-white transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => handleMarkAsCompleted("Completed", selectedTask[0])}
                className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 !rounded-lg hover:bg-gray-300 transition-colors"
              >
                <span className="mr-2">✔</span> Mark As Completed
              </button>
            </div>
          </div>
        </div>
      )}
      {flag && (
          <EditProjects
            projectData={sendProject}
            index={index}
            goBack={() => {
              setFlag(false);
              dispatch(setProjectFlag(false));
            }}
            tasks={tasks}
            projects={projects}
            Tax={Tax}
            setTax={setTax}
            Amount={Amount}
            setAmount={setAmount}
            Discount={projectDiscount}
            setDiscount={setProjectDiscount}
          />
        )}
    </div>
  );
};
export default Dashboard;