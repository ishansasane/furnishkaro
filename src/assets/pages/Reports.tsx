import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Reports() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [filteredData, setFilteredData] = useState([]);

  // Dummy Data
  const [data, setData] = useState([
    { id: 1, date: "2024-03-10", totalProjects: 10, completedProjects: 6, totalAmount: 5000, totalReceived: 3000, totalDue: 2000 },
    { id: 2, date: "2024-03-12", totalProjects: 15, completedProjects: 10, totalAmount: 7500, totalReceived: 5000, totalDue: 2500 },
    { id: 3, date: "2024-03-15", totalProjects: 20, completedProjects: 18, totalAmount: 9000, totalReceived: 8000, totalDue: 1000 },
    { id: 4, date: "2024-03-18", totalProjects: 5, completedProjects: 2, totalAmount: 2000, totalReceived: 1000, totalDue: 1000 },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [activeForm, setActiveForm] = useState("form1");

  // Apply Date Filter
  const applyFilter = () => {
    if (startDate && endDate) {
      const filtered = data.filter(
        (item) => new Date(item.date) >= startDate && new Date(item.date) <= endDate
      );
      setFilteredData(filtered);
    }
  };

  // Reset Filter
  const resetFilter = () => {
    setDateRange([null, null]);
    setFilteredData([]);
  };

  // Toggle Selection (for a single row)
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Select All
  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]); // Unselect all
    } else {
      setSelectedIds(data.map((item) => item.id)); // Select all
    }
  };

  // Delete Selected Rows
  const deleteSelected = () => {
    setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setFilteredData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]); // Reset selection
  };

  return (
    <div className="p-2 md:p-6  bg-gray-50 md:mt-0 mt-20 h-screen">
      <h1 className="text-2xl font-bold"> Reports</h1>
      <div className="flex flex-col items-center p-6">
        {/* Button Group */}
        <div className="flex w-full flex flex-wrap  gap-4 mb-6">
        <button
            className={`px-4 py-2 rounded-xl ${
              activeForm === "form1"
                ? "text-black underline underline-offset-8 decoration-sky-800"
                : "text-gray-500"
            }`}
            onClick={() => setActiveForm("form1")}
          >
            Sale Summary
          </button>
          <button
            className={`px-4 py-2 rounded-xl ${activeForm === "form2" ? "text-black underline underline-offset-8 decoration-sky-800" : "text-gray-500"}`}
            onClick={() => setActiveForm("form2")}
          >
            Customer Wise
          </button>
          <button
            className={`px-4 py-2 rounded-xl ${activeForm === "form3" ? "text-black underline underline-offset-8 decoration-sky-800" : "text-gray-500"}`}
            onClick={() => setActiveForm("form3")}
          >
            Product Group Wise
          </button>
        </div>

        {/* Form Components */}
        <div className="w-full md:p-6 p-2 bg-white shadow-lg rounded-lg">
          {activeForm === "form1" && (
            <Form1
              dateRange={dateRange}
              setDateRange={setDateRange}
              applyFilter={applyFilter}
              resetFilter={resetFilter}
              filteredData={filteredData}
              data={data}
              toggleSelection={toggleSelection}
              deleteSelected={deleteSelected}
              selectedIds={selectedIds}
              toggleSelectAll={toggleSelectAll}
            />
          )}
          {activeForm === "form2" && <Form2 />}
          {activeForm === "form3" && <Form3 />}
        </div>
      </div>
    </div>
  );
}

// Form 1 with Date Range Picker & Delete Feature
function Form1({ dateRange, setDateRange, applyFilter, resetFilter, filteredData, data, toggleSelection, deleteSelected, selectedIds, toggleSelectAll }) {
  return (
    <div className="md:p-7 p-1 overflow-x-auto">
      <div className="flex items-center gap-2 mb-4">
        <DatePicker
          selectsRange
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={(update) => setDateRange(update)}
          placeholderText="Select Date Range"
          className="p-2 border rounded"
        />
        <button onClick={applyFilter} className="p-2 bg-blue-500 text-white rounded">
          Apply
        </button>
        <button onClick={resetFilter} className="p-2 bg-gray-300 rounded">
          Reset
        </button>
      </div>

      {/* Delete Button */}
      {selectedIds.length > 0 && (
        <button onClick={deleteSelected} className="mb-4 p-2 bg-red-500 text-white rounded">
          Delete Selected
        </button>
      )}

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border cursor-pointer" onClick={toggleSelectAll}>
               {selectedIds.length === data.length ? "✅" : "⬜"} Dates
            </th>
            <th className="p-2 border">Total Projects</th>
            <th className="p-2 border">Completed Projects</th>
            <th className="p-2 border">Total Amount</th>
            <th className="p-2 border">Total Received</th>
            <th className="p-2 border">Total Due</th>
          </tr>
        </thead>
        <tbody>
          {(filteredData.length > 0 ? filteredData : data).map((item) => (
            <tr key={item.id} className="text-center border">
              <td
                className={`p-2 border cursor-pointer ${selectedIds.includes(item.id) ? "bg-blue-200" : ""}`}
                onClick={() => toggleSelection(item.id)}
              >
                {selectedIds.includes(item.id) ? "✅" : "⬜"} {item.date}
              </td>
              <td className="p-2 border">{item.totalProjects}</td>
              <td className="p-2 border">{item.completedProjects}</td>
              <td className="p-2 border">{item.totalAmount}</td>
              <td className="p-2 border">{item.totalReceived}</td>
              <td className="p-2 border">{item.totalDue}</td>
            </tr>
          ))}
          {filteredData.length === 0 && data.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Form2() {
  return (
    <div className="p-4 md:p-7 p-1 overflow-x-auto">
      
      <div className="flex items-center gap-2 mb-4">
        <DatePicker
          selectsRange
          // startDate={dateRange[0]}
          // endDate={dateRange[1]}
          // onChange={(update) => setDateRange(update)}
          placeholderText="Select Date Range"
          className="p-2 border rounded"
        />
        <button  className="p-2 bg-blue-500 text-white rounded">
          Apply
        </button>
        <button  className="p-2 bg-gray-300 rounded">
          Reset
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Projects</th>
            <th className="p-2 border">Completed Projects</th>
            <th className="p-2 border">Pending Projects</th>
            <th className="p-2 border">Total Amount</th>
            <th className="p-2 border">Total Received</th>
            <th className="p-2 border">Total Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" className="text-center p-4 text-gray-500">
              No Data
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}


function Form3() {
  return (
    <div className=" md:p-7 p-1 overflow-x-auto">
      
      <div className="flex items-center gap-2 mb-4">
        <DatePicker
          selectsRange
          // startDate={dateRange[0]}
          // endDate={dateRange[1]}
          // onChange={(update) => setDateRange(update)}
          placeholderText="Select Date Range"
          className="p-2 border rounded"
        />
        <button  className="p-2 bg-blue-500 text-white rounded">
          Apply
        </button>
        <button  className="p-2 bg-gray-300 rounded">
          Reset
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Group</th>
            <th className="p-2 border">Projects</th>
            <th className="p-2 border">Completed Projects</th>
            <th className="p-2 border">Pending Projects</th>
            <th className="p-2 border">Total Amount</th>
            <th className="p-2 border">Total Received</th>
            <th className="p-2 border">Total Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" className="text-center p-4 text-gray-500">No Data</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

