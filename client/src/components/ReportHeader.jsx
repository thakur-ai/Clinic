import React from 'react';
import { ArrowLeft, ChevronRight, Download, LogOut } from 'lucide-react';

const ReportHeader = ({ primaryAppointment, isAdmin, navigate, handleLogout }) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        
        <div className="flex items-center md:hidden mb-2">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="hidden md:flex items-center text-sm text-gray-500 mb-2">
          <span>Dashboard</span>
          <ChevronRight size={16} className="mx-2" />
          <span>Patients</span>
          <ChevronRight size={16} className="mx-2" />
          <span className="font-medium text-blue-600">Report #{primaryAppointment?.appointmentId}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Medical Report</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Patient ID: <span className="font-mono text-gray-700">{primaryAppointment?.appointmentId}</span>
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            {isAdmin && (
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex justify-center items-center">
                <Download size={16} className="mr-2" /> Export PDF
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex justify-center items-center"
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
//op
export default ReportHeader;
