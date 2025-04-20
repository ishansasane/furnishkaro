import { useEffect, useState } from "react";
import { Edit, Trash2, Plus,  } from "lucide-react";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setProjects, setTasks, setProjectFlag } from "../Redux/dataSlice";
import { Root } from "react-dom/client";
import EditProjects from "./EditProjects";

// Define the type for a project
interface Project {
  id: number;
  projectName: string;
  customerName: string;
  status: string;
  amount: string;
  received: string;
  due: string;
  createdBy: string;
  date: string;
  quote: string;
}


// Status filter options
const statusFilters = [                                                                                                                                                 
  "all",
  "approved",
  "good pending",
  "goods complete",
  "tailor complete",
  "tailor pending",
] as const;

export default function Projects() {
  const [projects, setprojects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("all");
  const [index, setIndex] = useState(null);
  const [flag, setFlag] = useState(false);
  const [sendProject, setSendProject] = useState([]);
  const [taskData, setTaskData] = useState([]);

  const dispatch = useDispatch();
  const projectData = useSelector((state : RootState) => state.data.projects);
  const tasks = useSelector((state : RootState) => state.data.tasks);
  const projectFlag = useSelector(( state : RootState ) => state.data.projectFlag);
  let sampleprojectData = [];

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
  
      // Ensure data.body exists and is an array
      if (!data.body || !Array.isArray(data.body)) {
        throw new Error("Invalid data format: Expected an array in data.body");
      }
  
      // Parse customerLink and allData for each row
      const projects = data.body.map((row, index) => {
        // Safely parse JSON fields
        const parseSafely = (value, fallback) => {
          try {
            return value ? JSON.parse(value) : fallback;
          } catch (error) {
            console.warn(`Invalid JSON in row ${index}:`, value, error);
            return fallback;
          }
        };
  
        const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

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
          allData: parseSafely(row[9], []),
          projectDate: row[10] || "",
          additionalRequests: row[11],
          interiorArray: typeof row[12] === "string"
            ? row[12].replace(/^"(.*)"$/, "$1").split(",").map(str => str.trim())
            : [],
          salesAssociateArray: typeof row[13] === "string"
            ? row[13].replace(/^"(.*)"$/, "$1").split(",").map(str => str.trim())
            : [],
          
          // Safely parse additionalItems and goodsArray
          additionalItems: deepClone(parseSafely(row[14], [])),
          
          // Fetching goodsArray with same pattern, assuming it's in the correct format
          goodsArray: parseSafely(row[15], []), // Assuming goodsArray is at index 15 (adjust accordingly)
        };
        
        
      });

      return projects;
    } catch (error) {
      console.error("Error fetching project data:", error);
      alert("Failed to fetch projects. Please try again.");
      return []; // Return empty array to prevent breaking the UI
    }
  };

  const fetchTaskData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
    const data = await response.json();
    return data.body;
  };

  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function getData(){
      const data = await fetchProjectData();
      dispatch(setProjects(data));
      setprojects(projectData);
    }
    async function taskData(){
      const data = await fetchTaskData();
      setTasks(data);
      setTaskData(data);
      console.log(data);
    }
    if(projectData.length == 0){
      getData();
    }else{
      setprojects(projectData);
    }
    if(tasks.length == 0){
      taskData();
    }else{
      setTaskData(tasks);
    }
  } ,[dispatch, projectData, tasks, deleted]);

  // Filter projects based on selected status
  const filteredProjects =
    filter === "all" ? projects : projects.filter((proj) => proj.status === filter);

    const deleteProject = async (name) => {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteprojectdata", {
        method : "POST",
        headers : {
          "content-type" : "application/json"
        },
        credentials : "include",
        body : JSON.stringify({ projectName : name })
      });

      if(response.status == 200){
        alert("Project Deleted");
      }else{
        alert("Error");
      }
      const data = await fetchProjectData();
      dispatch(setProjects(data));
      setprojects(projectData);
    }

  return (
    <div className={`md:!p-6 p-2  md:mt-0 mt-20 h-screen bg-gray-50 `}>
      <div className={` flex justify-between flex-wrap items-center mb-4`}>
        <h1 className="text-2xl font-bold">🚀 Projects</h1>
        <Link to="/add-project">
        <button className="flex items-center  gap-2 bg-blue-600 text-white px-4 py-2 !rounded-md">
          <Plus size={18} /> Add Project
        </button>
        </Link>
      </div>
<div className="bg-white md:!p-6 p-2 mt-5 md:mt-0 rounded-md shadow overflow-x-auto">
      <div className={`${flag ? "hidden" : ""} mb-4 flex gap-4`}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as (typeof statusFilters)[number])}
          className="border px-3 py-2 rounded-md"
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input type="text" placeholder="Search projects..." className="border px-3 py-2 rounded-md" />
      </div>

      <table className={`${flag ? "hidden" : ""}  w-full`}>
        <thead className="bg-sky-50">
          <tr>
            <th className="px-4 py-2">Project Name</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Received</th>
            <th className="px-4 py-2">Due</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Quote</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project, index) => (
            <tr key={index} className="hover:bg-sky-50">
              <td className="px-4 py-2">{project.projectName}</td>
              <td className="px-4 py-2">{project.customerLink ? project.customerLink[0] : ""}</td>
              <td className="px-4 py-2">{project.status}</td>
              <td className="px-4 py-2">{project.totalAmount + project.totalTax - project.discount}</td>
              <td className="px-4 py-2">{project.paid}</td>
              <td className="px-4 py-2">{project.totalAmount + project.totalTax - project.discount - project.paid}</td>
              <td className="px-4 py-2">{project.createdBy}</td>
              <td className="px-4 py-2">{project.projectDate}</td>
              <td className="px-4 py-2">{project[12]}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button onClick={(e) => { setIndex(index); setSendProject(project); setFlag(true); }} className="border px-2 py-1 rounded-md bg-gray-300">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteProject(project.projectName)} className="border px-2 py-1 rounded-md bg-red-500 text-white">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {flag && <EditProjects 
        projectData={sendProject}
        index={index}
        goBack={() => {setFlag(false); dispatch(setProjectFlag(false));}}
        tasks={taskData}
      />}
    </div>
    </div>
  );
}
