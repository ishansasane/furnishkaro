import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

function Reports() {
  const [payments, setPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");

  const [searchCustomer, setSearchCustomer] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentRes = await axios.get(
          "https://sheeladecor.netlify.app/.netlify/functions/server/getPayments"
        );
        const projectRes = await axios.get(
          "https://sheeladecor.netlify.app/.netlify/functions/server/getprojectdata"
        );

        if (paymentRes.data.success === "true") {
          setPayments(paymentRes.data.message);
        }
        if (projectRes.data.success) {
          setProjects(projectRes.data.body);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPayments = payments.filter(([customer, , , date]) => {
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
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 rounded ${
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
                      <th className="px-4 py-2">Advance</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2">{proj[0]}</td>
                        <td className="px-4 py-2">{JSON.parse(proj[1])[0]}</td>
                        <td className="px-4 py-2">₹{proj[4]}</td>
                        <td className="px-4 py-2">₹{proj[7]}</td>
                        <td className="px-4 py-2">{proj[3]}</td>
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
