import { useEffect } from "react";

const DeadlineCard = ({ projectName, project, date, setSendProject, setIndex, index, setTax, setAmount, setProjectDiscount, setFlag }) => {
  return (
    <div className="bg-blue-50 shadow-lg rounded-xl m-1 p-4 border-l-4 border-blue-500 transition-transform transform hover:scale-102 hover:shadow-xl w-max inline-block">
      <div className="flex items-center gap-3">
        <p className="text-xs text-gray-600 font-medium">Name:</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{projectName}</p>
      </div>
      <div className="flex items-center gap-3 mt-0.5">
        <p className="text-xs text-gray-600 font-medium">Date:</p>
        <p className="text-xs text-gray-600">{date}</p>
      </div>
      <div className="flex flex-col gap-0.5 mt-0.5">
        <p className="text-xs text-gray-600 font-medium">Items:</p>
        <div className="flex flex-wrap gap-3">
          {project.goodsArray && project.goodsArray.map((arr, idx) => (
            <p key={idx} className="text-xs text-gray-600">{arr.item?.[0]}{idx < project.goodsArray.length - 1 ? ',' : ''}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeadlineCard;