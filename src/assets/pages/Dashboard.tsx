
import { useState, useEffect } from "react";
import Card from "./CardPage";
import DeadlineCard from "../compoonents/DeadlineCard.tsx";
import TaskCard from "../compoonents/TaskCard.tsx";
import InquiryCard from "../compoonents/InquiryCard.tsx"; // Corrected import path
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store.ts";
import { setTasks, setProjects, setPaymentData, setProjectFlag, setInquiryData } from "../Redux/dataSlice.ts";
import TaskDialog from "../compoonents/TaskDialog.tsx";
import { AnimatePresence, motion } from "framer-motion";
import EditProjects from "./EditProjects.tsx";
import { useNavigate } from "react-router-dom";

const fetchTaskData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
  const data = await response.json();
  if (data.body) {
    return data.body;
  } else {
    return [];
  }
};

const fetchInquiryData = async () => {
  const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getInquiry");
  const data = await response.json();
  if (data.body) {
    return data.body;
  } else {
    return [];
  }
};

const Dashboard: React.FC = () => {
  const [isTaskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);
  const [isInquiryFormOpen, setInquiryFormOpen] = useState<boolean>(false);
  const [isInquiryDialogOpen, setInquiryDialogOpen] = useState<boolean>(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    project: "",
    comments: "",
    inquiryDate: "",
    followUpDate: "",
    customer : ""
  });

  const sendInquiry = async () => {
    const projectName = inquiryForm.project;
    const comment  = inquiryForm.comments;
    const inquiryDate = inquiryForm.inquiryDate;
    const followUpDate = inquiryForm.followUpDate;
    const customer = inquiryForm.customer;

    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/sendInquiry", {
      method : "POST",
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({ projectName, comment, inquiryDate, projectDate : followUpDate, status : "New Inquiry", customer })
    });

    if(response.status === 200){
      alert("Inquiry Added");
      const data = await fetchInquiryData();
      dispatch(setInquiryData(data));
      setInquiryFormOpen(false);
    }else{
      alert("Error in adding inquiry");
    }
  }

  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.data.tasks);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const projects = useSelector((state: RootState) => state.data.projects);
  const paymentData = useSelector((state: RootState) => state.data.paymentData);
  const projectsData = useSelector((state: RootState) => state.data.projects);
  const inquiries = useSelector((state : RootState) => state.data.inquiry);
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

        const updatedTasks = await fetchTaskData();
        const sortedTasks = updatedTasks.sort(
          (a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()
        );

        dispatch(setTasks(sortedTasks));

        localStorage.setItem("taskData", JSON.stringify({ data: sortedTasks, time: Date.now() }));

        setSelectedTask(null);

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
    if (inquiries.length == 0) {
      const fetchData = async () => {
        try {
          const data = await fetchInquiryData();
          dispatch(setInquiryData(data));
        } catch (err) {
          console.error("Fetch failed:", err);
        }
      };
      fetchData();
    }
  }, [inquiries, dispatch]);


  useEffect(() => {

  })

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
          throw new Error(`HTTP error! Status: ${taskRes.status}`);
        }

        const taskData = await taskRes.json();
        const tasksList = Array.isArray(taskData.body) ? taskData.body : [];

        if (isMounted) {
          const filtered = tasksList.filter(task => task[7] !== "Completed");
          dispatch(setTasks(tasksList));
          setFilteredTasks(filtered);
          localStorage.setItem("taskData", JSON.stringify({ data: tasksList, time: now }));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [dispatch, refresh]);

  const fetchProjectData = async () => {
    try {
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

      if (!Array.isArray(data.body)) {
        throw new Error("Invalid data format: Expected an array in data.body");
      }

      const parseSafely = (value: any, fallback: any) => {
        if (value == null || value === "") return fallback;
        if (typeof value !== "string") return value || fallback;
        try {
          return JSON.parse(value);
        } catch (error) {
          console.warn("Invalid JSON:", value, error);
          return fallback;
        }
      };

      const deepClone = (obj: any) => {
        try {
          return JSON.parse(JSON.stringify(obj));
        } catch {
          return [];
        }
      };

      const fixBrokenArray = (input: any): string[] => {
        if (Array.isArray(input)) return input;
        if (typeof input !== "string" || input === "") return [];

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
            return cleaned.filter(item => item);
          } catch {
            return [];
          }
        }
      };

      const projects = data.body.map((row: any[], rowIndex: number) => {
        try {
          return {
            projectName: row[0] || "",
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
            projectAddress: row[17] || "",
            date: row[18] || "",
          };
        } catch (error) {
          console.error(`Error processing project row ${rowIndex}:`, row, error);
          return null;
        }
      }).filter(project => project !== null);

      return projects;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data.message) ? data.message : [];
    } catch (error) {
      console.error("Error fetching payment data:", error);
      return [];
    }
  };

  const [received, setReceived] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await fetchProjectData();
        const projects = Array.isArray(projectRes) ? projectRes : [];

        dispatch(setProjects(projects));

        let totalTax = 0;
        let totalAmount = 0;
        let discount = 0;

        projects.forEach(project => {
          totalTax += parseFloat(project.totalTax) || 0;
          totalAmount += parseFloat(project.totalAmount) || 0;
          discount += parseFloat(project.discount) || 0;
        });

        setTotalPayment(totalAmount + totalTax);
        setDiscount(discount);

        const validProjectNames = new Set(projects.map(project => project.projectName));

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

        const updatedTasks = await fetchTaskData();
        const sortedTasks = updatedTasks.sort(
          (a, b) => new Date(a[2]).getTime() - new Date(b[2]).getTime()
        );

        dispatch(setTasks(sortedTasks));

        localStorage.setItem("taskData", JSON.stringify({ data: sortedTasks, time: Date.now() }));
      } else {
        alert("Error updating task");
      }

      setTaskDialogOpen(false);
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
        const cacheExpiry = 5 * 60 * 1000;

        if (cached) {
          const parsed = JSON.parse(cached);

          const isCacheValid = parsed?.data?.length > 0 && (now - parsed.time) < cacheExpiry;

          if (isCacheValid) {
            dispatch(setProjects(parsed.data));
            return;
          }
        }

        const freshData = await fetchProjectData();

        if (Array.isArray(freshData)) {
          dispatch(setProjects(freshData));
          localStorage.setItem("projectData", JSON.stringify({ data: freshData, time: now }));
        } else {
          console.warn("Fetched project data is not an array:", freshData);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);

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
    const name = selectedTask[5];

    const index = projects.findIndex(project => project.projectName === name);

    setIndex(index);

    if (index !== -1) {
      const matchedProject = projects[index];

      setSendProject(matchedProject);
      setTax(matchedProject.totalTax || 0);
      setAmount(matchedProject.totalAmount || 0);
      setProjectDiscount(matchedProject.discount || 0);
      setTaskDialogOpen(false);
      setFlag(true);
    } else {
      console.warn("No matching project found for:", name);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiries([...inquiries, { ...inquiryForm, status: "New Inquiry" }]);
    setInquiryFormOpen(false);
    setInquiryForm({
      project: "",
      comments: "",
      inquiryDate: "",
      followUpDate: ""
    });
  };

  const handleDeleteInquiry = async (projectName) => {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteInquiry", {
        method : "POST",
        headers : {
          "content-type" : "application/json",
        },
        body : JSON.stringify({ projectName })
      })

      if(response.status === 200){
        const data = await fetchInquiryData();
        dispatch(setInquiryData(data));
        alert("Inquiry Deleted");
        setInquiryDialogOpen(false);
      }else{
        alert("Error");
      }
  };

  const handleMarkAsApproved = async (projectName, status) => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updateInquiry", {
        method : "POST",
        headers : {
          "content-type" : "application/json",
        },
        body : JSON.stringify({ projectName, status })
      })

      if(response.status === 200){
        const data = await fetchInquiryData();
        dispatch(setInquiryData(data));
        alert("Status changed");
        setInquiryDialogOpen(false);
        navigate("/add-project");
      }else{
        alert("Error");
      }    
  };

  const handleStatusChange = async (projectName, status) => {
        const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/updateInquiry", {
        method : "POST",
        headers : {
          "content-type" : "application/json",
        },
        body : JSON.stringify({ projectName, status })
      })

      if(response.status === 200){
        const data = await fetchInquiryData();
        dispatch(setInquiryData(data));
        alert("Status changed");
        setInquiryDialogOpen(false);
        if(status == "Convert to Project"){
            navigate("/add-project");
        }
      }else{
        alert("Error");
      }
  };

  return (
    <div className="p-6 md:mt-0 mt-20 bg-gray-100 min-h-screen">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ${flag ? "hidden" : ""}`}>
        <div className="flex" onClick={() => navigate("/projects")}><Card title="Orders" value={projects.length} color="bg-blue-500" className="w-full max-w-sm"/></div>
        <Card title="Total Value" value={Math.round((totalPayment - Discount))} color="bg-purple-500" isCurrency />
        <div className="flex" onClick={() => navigate("/paymentsPage")}><Card title="Payment Received" value={Math.round(received)} color="bg-green-500" isCurrency /></div>
        <div className="flex" onClick={() => navigate("/duePage")}><Card title="Payment Due" value={Math.round(totalPayment - received - Discount)} color="bg-red-500" isCurrency /></div>
      </div>

      <div className={`${flag ? "hidden" : ""} grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2`}>
        <div className="bg-white flex flex-wrap flex-col shadow-md rounded-xl p-6">
          <p className="md:text-[1.7vw] font-semibold mb-4 text-gray-800"> Project Deadlines</p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
  {projects && projects.map((project, index) => (
    <div
      key={index}
      onClick={() => {
        setSendProject(project);
        setIndex(index);
        setTax(project.totalTax);
        setAmount(project.totalAmount);
        setProjectDiscount(project.discount);
        setFlag(true);
      }}
    >
      <DeadlineCard
        setFlag={setFlag}
        setTax={setTax}
        setProjectDiscount={setProjectDiscount}
        setAmount={setAmount}
        setSendProject={setSendProject}
        index={index}
        setIndex={setIndex}
        project={project}
        projectName={project.projectName}
        date={project.projectDate}
      />
    </div>
  ))}
</div>

        </div>

        <div className="bg-white shadow-md rounded-xl p-3 col-span-2">
          <div className="flex flex-row w-full justify-between items-center mb-4">
            <Link to="/tasks" className="!no-underline">
              <p className="md:text-[1.7vw] font-semibold text-gray-800">Tasks</p>
            </Link>
            <button onClick={() => setTaskDialog(true)} style={{ borderRadius: "6px" }} className="mb-2 bg-sky-600 text-white hover:bg-sky-700 px-2 md:text-[1.7vw] py-1">Add Task</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 overflow-y-auto max-h-[90vh] pr-2">
            {filteredTasks && filteredTasks.map((task, index) => (
              <div key={index} onClick={() => { setSelectedTask(task); setTaskDialogOpen(true); }}>
                <TaskCard taskData={task} />
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
              onClick={() => setTaskDialog(false)}
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
        {isInquiryFormOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInquiryFormOpen(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative border border-gray-200">
                <button
                  onClick={() => setInquiryFormOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add Inquiry</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project</label>
                    <input
                      type="text"
                      value={inquiryForm.project}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, project: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      value={inquiryForm.customer}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, customer: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comments</label>
                    <textarea
                      value={inquiryForm.comments}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, comments: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      placeholder="Enter comments"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Inquiry Date</label>
                    <input
                      type="date"
                      value={inquiryForm.inquiryDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, inquiryDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Follow-Up Date</label>
                    <input
                      type="date"
                      value={inquiryForm.followUpDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, followUpDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setInquiryFormOpen(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                      onClick={(e) => {e.preventDefault(); sendInquiry(); }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
        {isInquiryDialogOpen && selectedInquiry && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md relative border border-gray-200">
              <button
                onClick={() => setInquiryDialogOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-2 text-gray-800"> {selectedInquiry[0]}</h2>
              <div className="space-y-3 p-3 text-gray-700 text-sm">
                <p className="flex justify-between">
                  <strong>Status:</strong>
                  <span className={`inline-block px-2 py-1 rounded text-white ${selectedInquiry[4] == 'approved' ? 'bg-green-500' : selectedInquiry[4] === 'New Inquiry' ? 'bg-blue-500' : selectedInquiry[4] === 'In Progress' ? 'bg-yellow-500' : selectedInquiry[4] === 'Convert to Project' ? 'bg-purple-500' : selectedInquiry[4] == "Not Intrested" ? "bg-red-500" : "bg-black" }`}>
                    {selectedInquiry[4]}
                  </span>
                </p>
                <hr />
                <p className="flex justify-between"><strong>Customer:</strong> {selectedInquiry[5]}</p>
                <hr />
                <p className="flex justify-between"><strong>Comments:</strong> {selectedInquiry[1]}</p>
                <hr />
                <p className="flex justify-between"><strong>Inquiry Date:</strong> {selectedInquiry[2]}</p>
                <hr />
                <p className="flex justify-between"><strong>Follow-Up Date:</strong> {selectedInquiry[3]}</p>
                <hr />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleDeleteInquiry(selectedInquiry[0])}
                  className="bg-white border !border-red-500 text-red-500 px-4 py-2 !rounded-lg hover:!bg-red-500 hover:!text-white transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleMarkAsApproved(selectedInquiry[0], "Convert to Project")}
                  className={`${selectedInquiry[4] == "Convert to Project" ? "hidden" : ""} flex items-center bg-gray-200 text-gray-700 px-4 py-2 !rounded-lg hover:bg-gray-300 transition-colors`}
                >
                  <span className="mr-2">✔</span> Mark As Approved
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className={`bg-white shadow-md rounded-xl p-6 mt-2 ${flag ? "hidden" : ""}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4"> Inquiries</h2>
          <button
            style={{ borderRadius: "6px" }}
            className="mb-2 bg-sky-600 text-white hover:bg-sky-700 px-2 md:text-[1.7vw] py-1"
            onClick={() => setInquiryFormOpen(true)}
          >
            Add Inquiry
          </button>
        </div>
        <div className="flex flex-wrap gap-6 overflow-x-auto pb-4">
          {inquiries.map((inquiry, index) => (
            <div key={index}>
              <InquiryCard
                project={inquiry[0]}
                comments={inquiry[1]}
                inquiryDate={inquiry[2]}
                followUpDate={inquiry[3]}
                status={inquiry[4]}
                customer={inquiry[5]}
                handlestatuschange={handleStatusChange}
                onCardClick={() => { setSelectedInquiry(inquiry); setInquiryDialogOpen(true); }}
              />
            </div>
          ))}
        </div>
      </div>

      {isTaskDialogOpen && selectedTask && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
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
