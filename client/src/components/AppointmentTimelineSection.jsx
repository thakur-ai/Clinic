import React from 'react';
import { Clock, CalendarX, ArrowRight } from 'lucide-react';
import TimelineItem from './TimelineItem'; 

const AppointmentTimelineSection = ({
  appointmentsData,
  handleRescheduleClick,
  handleRebookClick
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
             <Clock size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Appointment History</h2>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar max-h-[500px]">
        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-2">
          {appointmentsData.length > 0 ? (
            appointmentsData.map((app) => (
              <div key={app._id} className="relative group">
                
                {/* The Timeline Row */}
                <TimelineItem 
                  date={app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}
                  title={app.service?.name}
                  doctor={app.doctor?.name}
                  status={app.status?.toLowerCase() || 'N/A'}
                />

                {/* Actions Overlay/Container 
                    - Mobile: Always visible, stacked below the item
                    - Desktop: Absolute positioned, visible on hover
                */}
                <div className="
                    mt-3 pl-10 flex gap-2 flex-wrap
                    md:mt-0 md:pl-0 md:absolute md:top-3 md:right-3 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:z-20
                ">
                    {app.status?.toLowerCase() !== 'completed' && (
                      <button 
                        onClick={() => handleRescheduleClick(app)} 
                        className="px-3 py-1.5 rounded-lg bg-white border border-indigo-100 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 hover:border-indigo-200 shadow-sm transition-all active:scale-95"
                      >
                        Reschedule
                      </button>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center ml-[-14px]">
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                 <CalendarX className="text-slate-300" size={24} />
               </div>
               <p className="text-sm font-medium text-slate-500">No appointments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentTimelineSection;