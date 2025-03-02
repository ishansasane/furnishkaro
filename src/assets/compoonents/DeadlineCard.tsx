interface DeadlineCardProps {
    project: string;
    date: string;
  }
  
  const DeadlineCard: React.FC<DeadlineCardProps> = ({ project, date }) => {
    return (
      <div className="bg-blue-50 shadow-md rounded-lg p-4 border-l-4 border-blue-500 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-semibold text-gray-800">{project}</h3>
        <p className="text-gray-500">{date}</p>
      </div>
    );
  };
  
  export default DeadlineCard;
  