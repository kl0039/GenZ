
import React from 'react';

const AdminHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white shadow-sm">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="text-sm text-gray-500">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
