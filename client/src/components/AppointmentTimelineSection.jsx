import React from 'react';
import { Clock } from 'lucide-react';
import TimelineItem from './TimelineItem'; // Assuming TimelineItem is in the same components directory

const AppointmentTimelineSection = ({
  appointmentsData,
  handleRescheduleClick,
  handleRebookClick
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Appointments</h2>
        </div>
        <button className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors">View All</button>
      </div>
      <div className="relative border-l-2 border-gray-100 ml-2 md:ml-3 space-y-8 pb-2">
        {appointmentsData.length > 0 ? appointmentsData.map((app) => (
            <div key={app._id} className="relative group">
              <TimelineItem 
                date={app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}
                title={app.service?.name}
                doctor={app.doctor?.name}
                status={app.status?.toLowerCase() || 'N/A'}
              />
              <div className="absolute top-0 right-0 p-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {app.status?.toLowerCase() !== 'completed' && (
                  <button onClick={() => handleRescheduleClick(app)} className="px-3 py-1 rounded-xl bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-0 shadow-sm transition-all active:scale-95">Reschedule</button>
                )}
                <button onClick={() => handleRebookClick(app)} className="px-3 py-1 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-0 shadow-sm transition-all active:scale-95">Rebook</button>
              </div>
            </div>
          )) : <div className="text-sm text-gray-500 italic px-4 py-2">No data available.</div>
        }
      </div>
    </div>
  );
};

export default AppointmentTimelineSection;
