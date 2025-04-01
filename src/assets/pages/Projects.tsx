import { useEffect, useState } from "react";
import { Edit, Trash2, Plus,  } from "lucide-react";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setProjects, setTasks } from "../Redux/dataSlice";
import { Root } from "react-dom/client";

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

  const dispatch = useDispatch();
  const projectData = useSelector((state : RootState) => state.data.projects);

  const fetchProjectData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata", {
      credentials : "include",
    });

    const data = await response.json();

    return data.body;
  }

  useEffect(() => {
    async function getData(){
      const data = await fetchProjectData();
      dispatch(setProjects(data));
      setprojects(projectData);
    }
    if(projectData.length == 0){
      getData();
    }else{
      setprojects(projectData);
    }
  } ,[dispatch, projectData]);

  // Filter projects based on selected status
  const filteredProjects =
    filter === "all" ? projects : projects.filter((proj) => proj.status === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🚀 Projects</h1>
        <Link to="/add-project">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md">
          <Plus size={18} /> Add Project
        </button>
        </Link>
      </div>

      <div className="mb-4 flex gap-4">
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

      <table className="w-full">
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
              <td className="px-4 py-2">{project[0]}</td>
              <td className="px-4 py-2">{project[1]}</td>
              <td className="px-4 py-2">{project[4]}</td>
              <td className="px-4 py-2">{project[5]}</td>
              <td className="px-4 py-2">{project[6]}</td>
              <td className="px-4 py-2">{project[7]}</td>
              <td className="px-4 py-2">{project[8]}</td>
              <td className="px-4 py-2">{project[14]}</td>
              <td className="px-4 py-2">{project[12]}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button className="border px-2 py-1 rounded-md bg-gray-300">
                    <Edit size={16} />
                  </button>
                  <button className="border px-2 py-1 rounded-md bg-red-500 text-white">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
