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
  grandTotal: number;
  discountType: string;
  additionalRequests: string;
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
  const [index, setIndex] = useState<number | null>(null);
  const [flag, setFlag] = useState(false);
  const [sendProject, setSendProject] = useState<any>([]);
  const [taskData, setTaskData] = useState<any[]>([]);
  const [Received, setReceived] = useState(0);
  const [discountType, setDiscountType] = useState("cash");

  const dispatch = useDispatch();
  const projectData = useSelector((state: RootState) => state.data.projects);
  const tasks = useSelector((state: RootState) => state.data.tasks);
  const projectFlag = useSelector((state: RootState) => state.data.projectFlag);
  const paymentData = useSelector((state: RootState) => state.data.paymentData);
  const [projectPayments, setProjectPayments] = useState<number[]>([]);

  const [grandTotal, setGrandTotal] = useState(0);

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
      console.log("Raw API response:", data); // Debugging log

      if (!data.body || !Array.isArray(data.body)) {
        throw new Error("Invalid data format: Expected an array in data.body");
      }

      const parseSafely = (value: any, fallback: any) => {
        try {
          return typeof value === "string" ? JSON.parse(value) : value || fallback;
        } catch (error) {
          console.warn("Invalid JSON for value:", value, error);
          return fallback;
        }
      };

      const deepClone = (obj: any) => {
        try {
          return JSON.parse(JSON.stringify(obj));
        } catch (error) {
          console.warn("Deep clone failed for:", obj, error);
          return obj;
        }
      };

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

      const projects = data.body.map((row: any[], index: number) => {
        const additionalItems = deepClone(parseSafely(row[14], []));
        console.log(`Project ${index} additionalItems:`, additionalItems); // Debugging log
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
          additionalRequests: parseSafely(row[11], ""),
          interiorArray: fixBrokenArray(row[12]),
          salesAssociateArray: fixBrokenArray(row[13]),
          additionalItems,
          grandTotal: parseFloat(row[4]) - parseFloat(row[7]) + parseFloat(row[5]) || 0,
          discountType: row[15] || "cash",
        };
      });

      console.log("Processed projects:", projects); // Debugging log
      return projects;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  };

  const [added, setAdded] = useState(false);

  const fetchPaymentData = async () => {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/getPayments");
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error fetching payment data:", error);
      return [];
    }
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
            console.log("Using cached projects:", parsed.data); // Debugging log
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
        setDeleted(false);
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
          const projectWisePayments = projectData.map((project: any) => {
            const total = data
              .filter((item: any) => item[1] === project.projectName)
              .reduce((acc: number, curr: any) => {
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
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/gettasks");
      const data = await response.json();
      return data.body || [];
    } catch (error) {
      console.error("Error fetching task data:", error);
      return [];
    }
  };

  const [filteredTasks, setTaskNames] = useState<string[]>([]);

  const deleteTask = async (name: string) => {
    try {
      await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deletetask", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: name }),
      });
      setAdded(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredProjects =
    filter === "approved" ? projects : projects.filter((proj) => proj.status === filter);

  const deleteProject = async (name: string) => {
    try {
      const response = await fetch("https://sheeladecor.netlify.app/.netlify/functions/server/deleteprojectdata", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectName: name }),
      });

      const taskData = await fetchTaskData();
      const filteredTaskNames = taskData
        .filter((task: any) => task[5] === name)
        .map((task: any) => task[0]);

      setTaskNames(filteredTaskNames);

      for (const taskName of filteredTaskNames) {
        await deleteTask(taskName);
      }

      if (response.status === 200) {
        alert("Project Deleted");
        const cached = localStorage.getItem("projectData");
        let currentProjects: any[] = [];

        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.data)) {
            currentProjects = parsed.data;
          }
        }

        const updatedProjects = currentProjects.filter(p => p.projectName !== name);
        dispatch(setProjects(updatedProjects));
        setprojects(updatedProjects);
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
  const [chosenProject, setChosenProject] = useState<any>(false);

  const [Amount, setAmount] = useState(0);
  const [Tax, setTax] = useState(0);
  const [Discount, setDiscount] = useState(0);

  const setValues = (i: number) => {
    setTax(projectData[i].totalTax);
    setAmount(projectData[i].totalAmount);
    setDiscount(projectData[i].discount !== undefined ? projectData[i].discount : 0);
    setGrandTotal(projectData[i].grandTotal);
  };

  // PDF Generation Function
  const generatePDF = (project: any) => {
    console.log("Generating PDF for project:", project); // Debugging log
    console.log("Project additionalItems:", project.additionalItems); // Debugging log

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = 20;

    // Setting up fonts and colors
    const primaryColor = [0, 51, 102];
    const secondaryColor = [33, 33, 33];
    const accentColor = [0, 102, 204];
    const lightGray = [245, 245, 245];

    // Header Section
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setFillColor(...accentColor);
    doc.rect(0, 30, pageWidth, 1, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", pageWidth / 2, 18, { align: "center" });

    // Company Details
    yOffset += 15;
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("Sheela Decor", 15, yOffset);
    yOffset += 5;
    doc.text("123 Business Street, City, Country", 15, yOffset);
    yOffset += 5;
    doc.text("Email: contact@sheeladecor.com | Phone: +123 456 7890", 15, yOffset);
    yOffset += 8;

    // Divider Line
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.4);
    doc.line(15, yOffset, pageWidth - 15, yOffset);
    yOffset += 8;

    // Project and Customer Details
    doc.setFillColor(...lightGray);
    doc.roundedRect(15, yOffset, pageWidth - 30, 25, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Project Details", 20, yOffset + 6);
    doc.text("Customer Details", pageWidth / 2 + 5, yOffset + 6);
    yOffset += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`Project Name: ${project.projectName || "N/A"}`, 20, yOffset);
    doc.text(`Customer: ${project.customerLink?.[0] || "N/A"}`, pageWidth / 2 + 5, yOffset);
    yOffset += 5;
    doc.text(`Address: ${project.projectAddress || "N/A"}`, pageWidth / 2 + 5, yOffset);
    yOffset += 5;
    doc.text(`Date: ${project.projectDate || new Date().toLocaleDateString()}`, 20, yOffset);
    yOffset += 10;

    // Table Data Preparation
    const tableData: any[] = [];
    let srNo = 1;

    // Process allData (selections)
    if (Array.isArray(project.allData)) {
      project.allData.forEach((selection: any) => {
        if (selection.areacollection && Array.isArray(selection.areacollection) && selection.areacollection.length > 0) {
          tableData.push([
            { content: selection.area || "Unknown Area", colSpan: 9, styles: { fontStyle: "bold", fontSize: 9, fillColor: accentColor, textColor: [255, 255, 255] } },
          ]);

          selection.areacollection.forEach((collection: any) => {
            if (!Array.isArray(collection.items) || !collection.items.length) return;

            const item = collection.items[0];
            const qty = parseFloat(collection.quantities?.[0]) || 0;
            const calculatedMRP = (item[4] * parseFloat(collection.measurement?.quantity || "0")).toFixed(2);

            tableData.push([
              srNo++,
              `${collection.productGroup[0] || "N/A"} * ${collection.measurement?.quantity || 0}`,
              collection.measurement?.width && collection.measurement?.height
                ? `${collection.measurement.width}x${collection.measurement.height} ${collection.measurement.unit || ""}`
                : "N/A",
              `INR ${calculatedMRP}`,
              qty.toString(),
              `INR ${(item[4] * parseFloat(collection.measurement?.quantity || "0") * qty).toFixed(2)}`,
              `${item[5] || "0"}%`,
              `INR ${collection.taxAmount?.[0]?.toFixed(2) || "0.00"}`,
              `INR ${collection.totalAmount?.[0]?.toFixed(2) || "0.00"}`,
            ]);
          });
        }
      });
    }

    // Process additionalItems (Miscellaneous)
    if (Array.isArray(project.additionalItems) && project.additionalItems.length > 0) {
      console.log("Processing additionalItems for PDF:", project.additionalItems); // Debugging log
      tableData.push([
        { content: "Miscellaneous Items", colSpan: 9, styles: { fontStyle: "bold", fillColor: accentColor, textColor: [255, 255, 255], fontSize: 9 } },
      ]);

      project.additionalItems.forEach((item: any, index: number) => {
        console.log(`Processing item ${index}:`, item); // Debugging log
        const qty = parseFloat(item.quantity?.toString() || "0") || 0;
        const rate = parseFloat(item.rate?.toString() || "0") || 0;
        const netRate = parseFloat(item.netRate?.toString() || "0") || 0;
        const tax = parseFloat(item.tax?.toString() || "0") || 0;
        const taxAmount = parseFloat(item.taxAmount?.toString() || "0") || 0;
        const totalAmount = parseFloat(item.totalAmount?.toString() || "0") || 0;

        tableData.push([
          srNo++,
          item.name || `Miscellaneous Item ${index + 1}`,
          item.description || item.remark || "N/A",
          `INR ${rate.toFixed(2)}`,
          qty.toString(),
          `INR ${netRate.toFixed(2)}`,
          `${tax.toFixed(0)}%`,
          `INR ${taxAmount.toFixed(2)}`,
          `INR ${totalAmount.toFixed(2)}`,
        ]);
      });
    } else {
      console.log("No additionalItems available:", project.additionalItems); // Debugging log
      tableData.push([
        { content: "No Miscellaneous Items Available", colSpan: 9, styles: { halign: "center", fontSize: 8, textColor: secondaryColor } },
      ]);
    }

    // Draw Quotation Table
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Quotation Items", 15, yOffset);
    yOffset += 8;

    autoTable(doc, {
      startY: yOffset,
      head: [
        ["Sr. No.", "Item Name", "Description", "Rate", "Qty", "Net Rate", "Tax Rate", "Tax Amount", "Total"],
      ],
      body: tableData.length > 0 ? tableData : [[{ content: "No product data available.", colSpan: 9, styles: { halign: "center" } }]],
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 6.5,
        cellPadding: 1.5,
        textColor: secondaryColor,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
        overflow: 'linebreak',
        minCellHeight: 0,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
        halign: "center",
        cellPadding: 1.5,
      },
      alternateRowStyles: {
        fillColor: lightGray,
      },
      columnStyles: {
        0: { cellWidth: 7, halign: "center" },
        1: { cellWidth: 35, overflow: "linebreak" },
        2: { cellWidth: 20, overflow: "linebreak" },
        3: { cellWidth: 15, halign: "right" },
        4: { cellWidth: 8, halign: "center" },
        5: { cellWidth: 15, halign: "right" },
        6: { cellWidth: 10, halign: "center" },
        7: { cellWidth: 15, halign: "right" },
        8: { cellWidth: 15, halign: "right" },
      },
      margin: { top: yOffset, left: 15, right: 15, bottom: 50 },
      pageBreak: 'auto',
      rowPageBreak: 'avoid',
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${data.pageNumber}`, pageWidth - 15, pageHeight - 10, { align: "right" });
      },
      willDrawCell: (data) => {
        if (data.section === 'body' && (data.column.index === 1 || data.column.index === 2)) {
          const text = data.cell.text.join(' ');
          if (text.length > 25) {
            data.cell.text = doc.splitTextToSize(text, data.cell.width - 3);
          }
        }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && [3, 5, 7, 8].includes(data.column.index)) {
          data.cell.text = data.cell.text.map(text => text.replace(/^1\s*/, ''));
        }
      },
    });

    yOffset = (doc as any).lastAutoTable.finalY + 10;

    // Summary Section
    if (yOffset + 60 > pageHeight - 50) {
      doc.addPage();
      yOffset = 15;
    }
    doc.setFillColor(...lightGray);
    doc.roundedRect(pageWidth - 90, yOffset - 5, 75, 50, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text("Summary", pageWidth - 85, yOffset);
    yOffset += 8;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    const summaryItems = [
      { label: "Sub Total", value: `INR ${(project.totalAmount || 0).toFixed(2)}` },
      { label: "Total Tax", value: `INR ${(project.totalTax || 0).toFixed(2)}` },
      { label: "Total Amount", value: `INR ${((project.totalAmount + project.totalTax) || 0).toFixed(2)}` },
      { label: "Discount", value: `INR ${(project.discount || 0).toFixed(2)}` },
      { label: "Grand Total", value: `INR ${((project.grandTotal) || 0).toFixed(2)}` },
    ];

    summaryItems.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.text(item.label, pageWidth - 85, yOffset);
      doc.setFont("helvetica", "normal");
      doc.text(item.value.replace(/^1\s*/, ''), pageWidth - 20, yOffset, { align: "right" });
      yOffset += 8;
    });

    // Terms and Conditions (from AddProjectForm via additionalRequests)
    if (project.additionalRequests?.trim()) {
      console.log("Terms and Conditions from additionalRequests:", project.additionalRequests); // Debugging log
      if (yOffset + 30 > pageHeight - 50) {
        doc.addPage();
        yOffset = 15;
      }
      yOffset += 5;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("Terms & Conditions", 15, yOffset);
      yOffset += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...secondaryColor);
      const terms = doc.splitTextToSize(project.additionalRequests, pageWidth - 30);
      terms.forEach((term: string) => {
        if (yOffset + 5 > pageHeight - 50) {
          doc.addPage();
          yOffset = 15;
        }
        doc.text(`• ${term}`, 15, yOffset);
        yOffset += 5;
      });
    } else {
      console.log("No Terms and Conditions available in additionalRequests"); // Debugging log
    }

    // Footer
    if (yOffset + 20 > pageHeight - 50) {
      doc.addPage();
      yOffset = 15;
    }
    doc.setFillColor(...accentColor);
    doc.rect(0, pageHeight - 25, pageWidth, 1, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for choosing Sheela Decor!", pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Sheela Decor - All Rights Reserved", pageWidth / 2, pageHeight - 8, { align: "center" });

    // Save PDF
    doc.save(`Quotation_${project.projectName || "Project"}_${project.projectDate || new Date().toLocaleDateString()}.pdf`);
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
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.projectName}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.customerLink ? project.customerLink[0] : ""}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.grandTotal}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{projectPayments[index]}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{(project.grandTotal - (projectPayments[index] || 0)).toFixed(2)}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.createdBy}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.projectDate}</td>
                <td onClick={() => { setValues(index); setIndex(index); setSendProject(project); setDiscountType(project.discountType); setFlag(true); }} className="px-4 py-2">{project.date}</td>
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
        {confirmBox && <ConfirmBox setConfirmBox={setConfirmBox} deleteProject={deleteProject} project={chosenProject} />}
      </div>
    </div>
  );
}