/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Pencil, XCircle, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { RootState } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setProjects, setTasks, setProjectFlag, setPaymentData } from "../Redux/dataSlice";
import EditProjects from "./EditProjects";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ConfirmBox from "./ConfirmBox";

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
  customerLink: any[];
  projectReference: string;
  totalAmount: number;
  totalTax: number;
  discount: number;
  projectDate: string;
  allData: any[];
  additionalItems: any[];
  interiorArray: string[];
  salesAssociateArray: string[];
  grandTotal : number;
  discountType : string;
}

// Status filter options
const statusFilters = [
  "All",
  "Approved",
  "Goods Pending",
  "Goods Complete",
  "Tailor Complete",
  "Tailor Pending",
] as const;

export default function Projects() {
  const [projects, setprojects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("approved");
  const [index, setIndex] = useState(null);
  const [flag, setFlag] = useState(false);
  const [sendProject, setSendProject] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [Received, setReceived] = useState(0);
  const [discountType, setDiscountType] = useState("cash");

  const dispatch = useDispatch();
  const projectData = useSelector((state: RootState) => state.data.projects);
  const tasks = useSelector((state: RootState) => state.data.tasks);
  const projectFlag = useSelector((state: RootState) => state.data.projectFlag);
  const paymentData = useSelector((state: RootState) => state.data.paymentData);
  const [projectPayments, setProjectPayments] = useState([]);

  const [grandTotal , setGrandTotal] = useState(0);

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
      projectAddress: row[17],
      date: row[18],
      grandTotal : row[19],
      discountType : row[20]
    }));

    return projects;
  };

  const [added, setAdded] = useState(false);

  const fetchPaymentData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments");
    const data = await response.json();
    return data.message;
  };

  const [deleted, setDeleted] = useState(false);
  
  // --- Fetch Projects ---
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
            setprojects(parsed.data);
            return;
          }
        }

        // If no valid cache, fetch fresh data
        const freshData = await fetchProjectData();

        if (Array.isArray(freshData)) {
          dispatch(setProjects(freshData));
          setprojects(freshData);
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
            setprojects(parsed.data);
          }
        }
      }
    };

    fetchProjects();
  }, [dispatch, flag]);

  // --- Fetch Tasks ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await fetchTaskData();
        dispatch(setTasks(data));
        setTaskData(data);
        setDeleted(false); // reset deleted after refreshing
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
  
    if (!tasks.length || deleted) {
      fetchTasks();
    }
  }, [dispatch, tasks.length, deleted]);
  
  // --- Fetch Payments after Projects are available ---
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await fetchPaymentData();
        dispatch(setPaymentData(data));
  
        if (data && projectData?.length) {
          const projectWisePayments = projectData.map((project) => {
            const total = data
              .filter((item) => item[1] === project.projectName)
              .reduce((acc, curr) => {
                const amount = parseFloat(curr[2]);
                return acc + (isNaN(amount) ? 0 : amount);
              }, 0);
            return total;
          });
  
          setProjectPayments(projectWisePayments);
        }
  
        setAdded(true);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      }
    };
  
    if (!added && projectData?.length) {
      fetchPayments();
    }
  }, [dispatch, added, projectData]);
  
  // --- API fetching functions ---
  const fetchTaskData = async () => {
    const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
    const data = await response.json();
    return data.body || [];
  };
  
  const [filteredTasks, setTaskNames] = useState([]);

  const deleteTask = async (name: string) => {
    await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: name }),
    });
    setAdded(false);
  };

  const filteredProjects =
    filter === "approved" ? projects : projects.filter((proj) => proj.status === filter);

  const deleteProject = async (name) => {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteprojectdata", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectName: name }),
      });

      // Fetch tasks and delete related ones
      const taskData = await fetchTaskData();
      const filteredTaskNames = taskData
        .filter((task) => task[5] === name)
        .map((task) => task[0]);

      setTaskNames(filteredTaskNames);

      for (const taskName of filteredTaskNames) {
        await deleteTask(taskName);
      }

      if (response.status === 200) {
        alert("Project Deleted");

        // 1. Get current cache
        const cached = localStorage.getItem("projectData");
        let currentProjects = [];

        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.data)) {
            currentProjects = parsed.data;
          }
        }

        // 2. Remove deleted project from cache
        const updatedProjects = currentProjects.filter(p => p.projectName !== name);

        // 3. Update Redux and state
        dispatch(setProjects(updatedProjects));
        setprojects(updatedProjects);

        // 4. Update localStorage
        localStorage.setItem("projectData", JSON.stringify({
          data: updatedProjects,
          time: Date.now()
        }));
      } else {
        alert("Error");
      }

    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error: Network issue or server not responding");
    }
  };

  const [confirmBox, setConfirmBox] = useState(false);
  const [chosenProject, setChosenProject] = useState(false);

  const [Amount, setAmount] = useState(0);
  const [Tax, setTax] = useState(0);
  const [Discount, setDiscount] = useState(0);

  const setValues = (i) => {
    setTax(projectData[i].totalTax);
    setAmount(projectData[i].totalAmount);
    setDiscount(projectData[i].discount !== undefined ? projectData[i].discount : 0);
    setGrandTotal(projectData[i].grandTotal);
  };

  // PDF Generation Function
const generatePDF = (project: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 20;

    // Header with background
    doc.setFillColor(0, 48, 135); // Dark blue #003087
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", pageWidth / 2, 25, { align: "center" });
    yOffset = 40;

    // Company Details
    doc.setTextColor(0, 0, 0); // Black text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Sheela Decor", 20, yOffset);
    yOffset += 7;
    doc.text("123 Business Street, City, Country", 20, yOffset);
    yOffset += 7;
    doc.text("Email: contact@sheeladecor.com | Phone: +123 456 7890", 20, yOffset);
    yOffset += 10;
    doc.setDrawColor(0, 0, 255); // Blue line
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 10;

    // Customer and Project Details
    doc.setFontSize(10);
    doc.text("Project Details", 20, yOffset);
    doc.text("Customer Details", pageWidth / 2 + 20, yOffset);
    yOffset += 7;
    doc.text(`Project Name: ${project.projectName || "N/A"}`, 20, yOffset);
    doc.text(`Customer: ${project.customerLink?.[0] || "N/A"}`, pageWidth / 2 + 20, yOffset);
    yOffset += 7;
    doc.text(`Date: ${project.projectDate || "6/25/2025"}`, 20, yOffset);
    doc.text("Address: N/A", pageWidth / 2 + 20, yOffset);
    yOffset += 15;

    // Quotation Table (Main Items)
    const mainTableData: any[] = [];
    let srNo = 1;

    // Process allData (selections)
    project.allData.forEach((selection: any) => {
      if (selection.areacollection && selection.areacollection.length > 0) {
        selection.areacollection.forEach((collection: any) => {
          if (!Array.isArray(collection.items) || !collection.items.length) return;

          // Use the first item from items array, matching UI logic
          const item = collection.items[0];
          const qty = collection.quantities?.[0] || 0;
          const calculatedMRP = (item[4] * parseFloat(collection.measurement.quantity || "0")).toFixed(2);

          mainTableData.push([
            srNo++,
            collection.productGroup[0] || "N/A",
            collection.measurement.width && collection.measurement.height
              ? `${collection.measurement.width} x ${collection.measurement.height} ${collection.measurement.unit || ""}`
              : "N/A",
            calculatedMRP,
            qty,
            (item[4] * parseFloat(collection.measurement.quantity || "0") * qty).toFixed(2),
            item[5] || "0",
            collection.totalTax[0]?.toFixed(2) || "0.00",
            collection.totalAmount[0]?.toFixed(2) || "0.00",
          ]);
        });
      }
    });

    // Draw Main Quotation Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation Items", 20, yOffset);
    yOffset += 10;

    autoTable(doc, {
      startY: yOffset,
      head: [
        ["Sr. No.", "Product Name", "Size", "MRP", "Qty", "Subtotal", "Tax Rate (%)", "Tax Amount", "Total"],
      ],
      body: mainTableData.length > 0 ? mainTableData : [[{ content: "No product data available.", colSpan: 9, styles: { halign: "center" } }]],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 48, 135], textColor: [255, 255, 255], fontStyle: "bold" }, // Dark blue header
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    yOffset = (doc as any).lastAutoTable.finalY + 15;

    // Miscellaneous Table
    const miscTableData: any[] = [];
    let miscSrNo = 1;

    // Process miscellaneousData
    if (project.miscellaneousData && Array.isArray(project.miscellaneousData)) {
      project.miscellaneousData.forEach((misc: any) => {
        miscTableData.push([
          miscSrNo++,
          misc.productName || "N/A",
          misc.size || "N/A",
          misc.mrp?.toFixed(2) || "0.00",
          misc.quantity || 0,
          misc.subtotal?.toFixed(2) || "0.00",
          misc.taxRate || "0",
          misc.taxAmount?.toFixed(2) || "0.00",
          misc.total?.toFixed(2) || "0.00",
        ]);
      });
    }

    // Draw Miscellaneous Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Miscellaneous Items", 20, yOffset);
    yOffset += 10;

    autoTable(doc, {
      startY: yOffset,
      head: [
        ["Sr. No.", "Product Name", "Size", "MRP", "Qty", "Subtotal", "Tax Rate (%)", "Tax Amount", "Total"],
      ],
      body: miscTableData.length > 0 ? miscTableData : [[{ content: "No miscellaneous data available.", colSpan: 9, styles: { halign: "center" } }]],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 48, 135], textColor: [255, 255, 255], fontStyle: "bold" }, // Dark blue header
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    yOffset = (doc as any).lastAutoTable.finalY + 15;

    // Summary with background
    doc.setFillColor(245, 245, 245); // Light gray #f5f5f5
    doc.rect(pageWidth / 2 + 10, yOffset - 10, pageWidth / 2 - 40, 70, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", pageWidth / 3 + 60, yOffset);
    yOffset += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Sub Total:", pageWidth / 2 + 20, yOffset);
    doc.text(`INR ${project.totalAmount.toFixed(2)}`, pageWidth - 40, yOffset, { align: "right" });
    yOffset += 7;
    doc.text("Total Tax:", pageWidth / 2 + 20, yOffset);
    doc.text(`INR ${project.totalTax.toFixed(2)}`, pageWidth - 40, yOffset, { align: "right" });
    yOffset += 7;
    doc.text("Total Amount:", pageWidth / 2 + 20, yOffset);
    doc.text(`INR ${(project.totalAmount + project.totalTax).toFixed(2)}`, pageWidth - 40, yOffset, { align: "right" });
    yOffset += 7;
    doc.text("Discount:", pageWidth / 2 + 20, yOffset);
    doc.text(`INR ${project.discount.toFixed(2)}`, pageWidth - 40, yOffset, { align: "right" });
    yOffset += 7;
    doc.text("Grand Total:", pageWidth / 2 + 20, yOffset);
    doc.text(`INR ${(project.totalAmount).toFixed(2)}`, pageWidth - 40, yOffset, { align: "right" });

    // Footer
    yOffset = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("Thank you for your business!", pageWidth / 2, yOffset, { align: "center" });

    // Save PDF
    doc.save(`Quotation_${project.projectName || "Project"}_${project.projectDate || "6/25/2025"}.pdf`);
};

  const [paidAmount, setPaidAmount] = useState(0);

  return (
    <div className={`md:!p-6 p-2 md:mt-0 mt-20 h-screen bg-gray-50`}>
      <div className={`flex justify-between flex-wrap items-center mb-4`}>
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link to="/add-project">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 !rounded-md">
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

        <table className={`${flag ? "hidden" : ""} w-full`}>
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Received</th>
              <th className="px-4 py-2">Due</th>
              <th className="px-4 py-2">Created By</th>
              <th className="px-4 py-2">Deadline Date</th>
              <th className="px-4 py-2">Created On</th>
              <th className="px-4 py-2">Quote</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={index} className="hover:bg-sky-50">
                                
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.projectName}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.customerLink ? project.customerLink[0] : ""}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.grandTotal}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{projectPayments[index]}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{(project.grandTotal - (projectPayments[index] || 0)).toFixed(2)}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.createdBy}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.projectDate}</td>
                <td onClick={() => {setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.date}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => generatePDF(project)}
                    className="border px-2 py-1 rounded-md"
                  >
                    <Download size={16} />
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setValues(index);
                        setIndex(index);
                        setSendProject(project);
                        setDiscountType(project.discountType);
                        setFlag(true);
                      }}
                      className="border px-2 py-1 rounded-md"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => { setChosenProject(project); setConfirmBox(true); }}
                      className="border px-2 py-1 rounded-md"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flag && (
          <EditProjects
            projectData={sendProject}
            index={index}
            goBack={() => {
              setFlag(false);
              dispatch(setProjectFlag(false));
            }}
            tasks={taskData}
            projects={filteredProjects}
            Tax={Tax}
            setTax={setTax}
            Amount={Amount}
            setAmount={setAmount}
            Discount={Discount}
            setDiscount={setDiscount}
            grandTotal={grandTotal}
            setGrandTotal={setGrandTotal}
            discountType={discountType}
            setDiscountType={setDiscountType}
            Paid={paidAmount}
            setPaid={setPaidAmount}
          />
        )}
        {
          confirmBox && <ConfirmBox setConfirmBox={setConfirmBox} deleteProject={deleteProject} project={chosenProject}/>
        }
      </div>
    </div>
  );
}