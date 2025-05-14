import { useState, useEffect } from "react";
import Card from "./CardPage";
import DeadlineCard from "../compoonents/DeadlineCard";
import TaskCard from "../compoonents/TaskCard";
import InquiryCard from "../compoonents/InquiryCard";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store.ts";
import { setTasks, setProjects, setPaymentData } from "../Redux/dataSlice.ts";

const Dashboard: React.FC = () => {
  const [isTaskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const tasks  = useSelector((state: RootState) => state.data.tasks);
    const projects  = useSelector((state: RootState) => state.data.projects);
    const paymentData = useSelector((state : RootState) => state.data.paymentData);

    const [totalPayment, setTotalPayment] = useState(0);
    const [discount, setDiscount] = useState(0);

    const [selectedTask, setSelectedTask] = useState([]);

    const [refresh, setRefresh] = useState(true);

  const deleteTask = async (name: string) => {
    await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: name }),
    });

    setRefresh(true);
    setSelectedTask(null);
  };

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const taskRes = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks", {
        credentials: "include"
      });

      if (!taskRes.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const taskData = await taskRes.json();
      dispatch(setTasks(taskData.body || []));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  if (tasks.length === 0) {
    fetchTasks();
  }
}, [tasks.length, dispatch, refresh]);

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

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const projectRes = await fetchProjectData();

      const projects = projectRes;

      dispatch(setProjects(projects));

      // Calculate totalTax + totalAmount
      let totalTax = 0;
      let totalAmount = 0;
      let discount = 0;

      projects.forEach(project => {
        totalTax += parseFloat(project.totalTax);
        totalAmount += parseFloat(project.totalAmount);
        discount += parseFloat(project.discount);
      });

      setTotalPayment(totalAmount + totalTax); // Optional: add to previous if needed
      setDiscount(discount);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  fetchProjects();
}, [projects.length, dispatch]);



    const fetchPaymentData = async () => {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments"); 
      const data = await response.json();
      return data.message;
    }

    const [received, setReceived] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const cached = localStorage.getItem("paymentData");
      const now = Date.now();

      if (cached) {
        const parsed = JSON.parse(cached);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data?.length) {
          dispatch(setPaymentData(parsed.data));

          const total = parsed.data.reduce((acc, curr) => {
            const amount = parseFloat(curr[2]);
            return acc + (isNaN(amount) ? 0 : amount);
          }, 0);
          setReceived(total);
          return;
        }
      }

      const paymentData = await fetchPaymentData();
      if (paymentData) {
        dispatch(setPaymentData(paymentData));
        localStorage.setItem("paymentData", JSON.stringify({ data: paymentData, time: now }));

        const total = paymentData.reduce((acc, curr) => {
          const amount = parseFloat(curr[2]);
          return acc + (isNaN(amount) ? 0 : amount);
        }, 0);
        setReceived(total);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  fetchData();
}, [dispatch]);

  const handleMarkAsCompleted = async (status, name) => {
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
        status,
      }),
    });

    if (response.status === 200) {
      alert("Task updated");
    } else {
      alert("Error updating task");
    }
    if(refresh){
      setRefresh(false);
    }else{
      setRefresh(true);
    }
  };

   return (
    <div className="p-6 md:mt-0 mt-20 bg-gray-100 min-h-screen">

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card  title="Orders"  value={projects.length} color="bg-blue-500" className="w-full max-w-sm"/>
        <Card title="Total Value" value={totalPayment - discount} color="bg-green-500" isCurrency />
        <Card title="Payment Received" value={received} color="bg-purple-500" isCurrency />
        <Card title="Payment Due" value={totalPayment - received - discount} color="bg-red-500" isCurrency />
      </div>

      {/* Deadlines & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Project Deadlines */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📅 Project Deadlines</h2>
          <div className="space-y-4">
            {projects != undefined && projects.map((project, index) => (
              <DeadlineCard project={project.projectName} date={project.projectDate} key={index} />
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
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50  bg-opacity-50 flex items-center justify-center z-50">
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
              <p className="flex justify-between"><strong>Priority :</strong> <span className={`inline-block px-2 py-1 rounded text-white ${selectedTask[6].toLowerCase() === 'high' ? 'bg-red-500' : selectedTask[6].toLowerCase() === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>{selectedTask[6]}</span></p>
              <hr />
              <p className="flex justify-between"><strong>Status :</strong> <span className={`inline-block px-2 py-1 rounded text-white ${selectedTask[7].toLowerCase() === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`}>{selectedTask[7]}</span></p>
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
                onClick={() => deleteTask(selectedTask[0])}
                className="bg-white border !border-red-500 text-red-500 px-4 py-2 !rounded-lg hover:!bg-red-500 hover:!text-white transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => handleMarkAsCompleted(selectedTask[6], selectedTask[0])}
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