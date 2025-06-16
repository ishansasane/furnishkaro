
import React from "react";

const InquiryCard = ({ project, comments, inquiryDate, followUpDate, status, handlestatuschange, onCardClick, customer }) => {
  return (
    <div
      className="w-full max-w-sm mx-auto bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4"
      onClick={onCardClick}
    >
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{project}</h3>
        <p className="text-md text-gray-600">{customer}</p>
        <p className="text-md text-gray-600">{comments}</p>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>Inquiry Date: {inquiryDate}</p>
        <p>Follow-up Date: {followUpDate}</p>
      </div>

      <select
        value={status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          handlestatuschange(project, e.target.value)
        }}
        className="w-full mt-2 border p-2 rounded-md text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option>New Inquiry</option>
        <option>In Progress</option>
        <option>Convert to Project</option>
        <option>Not Interested</option>
      </select>
    </div>
  );
};

export default InquiryCard;
