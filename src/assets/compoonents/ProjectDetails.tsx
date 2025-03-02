const ProjectDetails = () => {
    return (
      <div className="mb-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div>
            <input className="border p-2 rounded w-full" placeholder="Reference (optional)" />
          </div>
          <div>
            <input className="border p-2 rounded w-full" placeholder="Project Name *" required />
          </div>
  
          <div>
            <input className="border p-2 rounded w-full" placeholder="Address (optional)" />
          </div>
          <div>
            <textarea className="border p-2 rounded w-full" placeholder="Any Additional Requests (optional)"></textarea>
          </div>
  
          <div>
            <select className="border p-2 rounded w-full">
              <option value="">Select Interior Name (optional)</option>
              <option value="Modern">Modern</option>
              <option value="Classic">Classic</option>
              <option value="Minimalist">Minimalist</option>
            </select>
          </div>
  
          <div>
            <select className="border p-2 rounded w-full">
              <option value="">Select Sales Associate (optional)</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </select>
          </div>
  
          <div>
            <select className="border p-2 rounded w-full">
              <option value="">Select User (optional)</option>
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
            </select>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectDetails;
  