import React from "react";

const InquiryCard = ({
  project,
  comments,
  inquiryDate,
  followUpDate,
  status,
  handlestatuschange,
  onCardClick,
  customer,
}) => {
  return (
    <div
      className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 cursor-pointer"
      onClick={onCardClick}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-indigo-600 truncate">{project}</h3>
        <p className="text-sm text-gray-800 font-medium truncate">{customer}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{comments}</p>
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-500">
        <p> Inquiry: <span className="text-gray-700">{inquiryDate}</span></p>
        <p> Follow-up: <span className="text-gray-700">{followUpDate}</span></p>
      </div>

      <div className="mt-3">
        <select
          value={status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handlestatuschange(project, e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 text-sm text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="New Inquiry"> New Inquiry</option>
          <option value="In Progress"> In Progress</option>
          <option value="Convert to Project"> Convert to Project</option>
          <option value="Not Interested"> Not Interested</option>
        </select>
      </div>
    </div>
  );
};

export default InquiryCard;
