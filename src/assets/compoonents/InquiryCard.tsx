import React, { useState } from "react";

interface InquiryCardProps {
  project: string;
  comments: string;
  inquiryDate: string;
  followUpDate: string;
}

const InquiryCard: React.FC<InquiryCardProps> = ({ project, comments, inquiryDate, followUpDate }) => {
  const [status, setStatus] = useState("New Inquiry");

  return (
    <div className="w-72 h-40 bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-gray-800">{project}</h3>
      <p className="text-sm text-gray-600">{comments}</p>
      <div className="text-xs text-gray-500">
        <p>Inquiry Date: {inquiryDate}</p>
        <p>Follow-up Date: {followUpDate}</p>
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full mt-2 border p-1 rounded"
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
