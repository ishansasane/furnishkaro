import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { RootState } from "../Redux/store";
import { setPaymentData, setProjects } from "../Redux/dataSlice";
import { useDispatch, useSelector } from "react-redux";

function Reports() {

  const dispatch = useDispatch();

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
      grandTotal : row[19]
    }));

    return projects;
  };

  const [payments, setPayments] = useState([]);
  const [projects, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");

  const [searchCustomer, setSearchCustomer] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const projectData = useSelector(( state : RootState ) => state.data.projects);
  const paymentsData = useSelector(( state : RootState ) => state.data.paymentData);

  const [projectPayments, setProjectPayments] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = Date.now();

      // ---------- Handle Project Data ----------
      const cachedProjects = localStorage.getItem("projectData");
      let projects = [];

      if (cachedProjects) {
        const parsed = JSON.parse(cachedProjects);
        const timeDiff = now - parsed.time;

        if (timeDiff < 5 * 60 * 1000 && parsed.data.length > 0) {
          dispatch(setProjects(parsed.data));
          setProjectsData(parsed.data);
          projects = parsed.data;
        } else {
          projects = await fetchProjectData();
          dispatch(setProjects(projects));
          setProjectsData(projects);
          localStorage.setItem("projectData", JSON.stringify({ data: projects, time: now }));
        }
      } else {
        projects = await fetchProjectData();
        dispatch(setProjects(projects));
        setProjectsData(projects);
        localStorage.setItem("projectData", JSON.stringify({ data: projects, time: now }));
      }

      // ---------- Handle Payments ----------
      try {
        const paymentRes = await fetch(
          "https://sheeladecor.netlify.app/.netlify/functions/server/getPayments",
          {
            credentials: "include",
          }
        );

        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          if (paymentData.success === "true") {
            dispatch(setPaymentData(paymentData.message));
            setPayments(paymentData.message);

            // Group payments by project name
            const paymentSums = projects.map((project) => {
              const totalPaid = paymentData.message
                .filter((payment: any[]) => payment[1] == project.projectName)
                .reduce((acc: number, payment: any[]) => acc + (parseFloat(payment[2]) || 0), 0);
              return totalPaid;
            });

            setProjectPayments(paymentSums);
            console.log(paymentSums);
          }
        } else {
          console.error("Failed to fetch payment data:", paymentRes.status);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [dispatch]);


const filteredPayments = (payments ?? []).filter(([customer, , , date]) => {
  const matchCustomer = customer
    .toLowerCase()
    .includes(searchCustomer.toLowerCase());

  const matchDate =
    (!dateFrom || dayjs(date).isAfter(dayjs(dateFrom).subtract(1, "day"))) &&
    (!dateTo || dayjs(date).isBefore(dayjs(dateTo).add(1, "day")));

  return matchCustomer && matchDate;
});


  const totalPaymentAmount = filteredPayments.reduce(
    (acc, curr) => acc + parseFloat(curr[2] || 0),
    0
  );

  const totalProjectValue = projects.reduce(
    (acc, proj) => acc + parseFloat(proj[4] || 0),
    0
  );

  const totalAdvance = projects.reduce(
    (acc, proj) => acc + parseFloat(proj[7] || 0),
    0
  );
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reports Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 mt-10">
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded  ${
            activeTab === "payments"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 rounded ${
            activeTab === "projects"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-300"
          }`}
        >
          Projects
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {activeTab === "payments" && (
            <>
              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search by customer"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>

              {/* Summary */}
              <div className="mb-4 text-lg font-semibold">
                Total Payments: ₹{totalPaymentAmount.toLocaleString()}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="px-4 py-2">Customer</th>
                      <th className="px-4 py-2">Project</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Mode</th>
                      <th className="px-4 py-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((pay, idx) => (
                      <tr key={idx} className="border-t">
                        {pay.map((val, i) => (
                          <td key={i} className="px-4 py-2">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "projects" && (
            <>
              {/* Summary */}
              <div className="mb-4 text-lg font-semibold">
                Total Project Value: ₹{totalProjectValue.toLocaleString()} |
                Total Advance: ₹{totalAdvance.toLocaleString()}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="px-4 py-2">Project Name</th>
                      <th className="px-4 py-2">Customer Name</th>
                      <th className="px-4 py-2">Total Amount</th>
                      <th className="px-4 py-2">Paid</th>
                      <th className="px-4 py-2">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{proj.projectName}</td>
                        <td className="px-4 py-2">{proj.customerLink[0]}</td>
                        <td className="px-4 py-2">₹{proj.grandTotal}</td>
                        <td className="px-4 py-2">₹{projectPayments[idx]}</td>
                        <td className="px-4 py-2">{proj.grandTotal - projectPayments[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;
