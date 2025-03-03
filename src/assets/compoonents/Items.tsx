import { useState } from "react";

const Items = () => {
  const [search, setSearch] = useState("");

  const items = [
    { id: 1, name: "Satin", description: "", costingType: "sq feet", groupType: "area_based", entryDate: "03 February 2025" },
    { id: 2, name: "Cloth", description: "", costingType: "sq feet", groupType: "area_based", entryDate: "30 December 2024" },
    { id: 3, name: "Blind", description: "", costingType: "feet", groupType: "running_length_based", entryDate: "30 December 2024" },
    { id: 4, name: "OUTDOOR ROPE SOFA SET WITH CUSHION IN ALUMINIUM", description: "", costingType: "piece", groupType: "fixed_length_items", entryDate: "30 December 2024" },
    { id: 5, name: "Pleated Stitching 114\"", description: "Pleated Stitching...", costingType: "parts", groupType: "tailoring", entryDate: "27 December 2024" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Items</h1>
            <nav className="text-gray-500">
              <a href="#" className="hover:underline">Dashboard</a>
              <span className="mx-2">•</span>
              <span>Items</span>
            </nav>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              <i className="fas fa-plus"></i> Add Item
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
              More Options <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow rounded-lg p-4">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />

          {/* Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 px-4"><input type="checkbox" /></th>
                <th className="py-2 px-4">Item Name</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Costing Type</th>
                <th className="py-2 px-4">Group Type</th>
                <th className="py-2 px-4">Entry Date</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items
                .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                .map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2 px-4"><input type="checkbox" /></td>
                    <td className="py-2 px-4 text-blue-500 hover:underline">{item.name}</td>
                    <td className="py-2 px-4">{item.description}</td>
                    <td className="py-2 px-4">{item.costingType}</td>
                    <td className="py-2 px-4">{item.groupType}</td>
                    <td className="py-2 px-4">{item.entryDate}</td>
                    <td className="py-2 px-4"><i className="fas fa-ellipsis-v"></i></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Items;
