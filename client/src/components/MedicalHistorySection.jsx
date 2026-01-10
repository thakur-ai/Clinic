import React from 'react';
import { Activity, Edit2, Check, X } from 'lucide-react';
import Badge from './Badge'; 

const MedicalHistorySection = ({
  primaryAppointment,
  isAdmin,
  isEditingMedicalHistory,
  handleEditMedicalHistory,
  editableDentalProblems,
  setEditableDentalProblems,
  editableTreatments,
  setEditableTreatments,
  editableMedications,
  setEditableMedications,
  editablePastSurgeries,
  setEditablePastSurgeries,
  handleCancelEditMedicalHistory,
  handleSaveMedicalHistory
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/60 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center space-x-3">
          <div className="bg-rose-50 p-2 rounded-lg text-rose-500">
             <Activity size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Medical History</h2>
        </div>
        
        {isAdmin && !isEditingMedicalHistory && (
          <button 
            onClick={handleEditMedicalHistory} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm active:scale-95"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
        )}
      </div>
      
      <div className="p-6">
        {isEditingMedicalHistory ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Edit: Dental Problems */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Dental Problems <span className="text-slate-300 font-normal lowercase">(comma-separated)</span>
              </label>
              <textarea 
                value={editableDentalProblems.join(', ')} 
                onChange={(e) => setEditableDentalProblems(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))} 
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm resize-none shadow-inner" 
                rows="3"
                placeholder="e.g. Cavities, Gingivitis"
              ></textarea>
            </div>

            {/* Edit: Treatments */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Treatments <span className="text-slate-300 font-normal lowercase">(comma-separated)</span>
              </label>
              <textarea 
                value={editableTreatments.join(', ')} 
                onChange={(e) => setEditableTreatments(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))} 
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm resize-none shadow-inner" 
                rows="3"
                placeholder="e.g. Root Canal, Scaling"
              ></textarea>
            </div>

            {/* Edit: Medications */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Medications
              </label>
              <textarea
                value={editableMedications}
                onChange={(e) => setEditableMedications(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm resize-none shadow-inner"
                rows="3"
                placeholder="List current medications..."
              ></textarea>
            </div>

            {/* Edit: Past Surgeries */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Past Surgeries <span className="text-slate-300 font-normal lowercase">(comma-separated)</span>
              </label>
              <textarea
                value={editablePastSurgeries.join(', ')}
                onChange={(e) => setEditablePastSurgeries(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))}
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm resize-none shadow-inner"
                rows="3"
                placeholder="e.g. Appendectomy, Tonsillectomy"
              ></textarea>
            </div>

            {/* Edit Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button 
                onClick={handleCancelEditMedicalHistory} 
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSaveMedicalHistory} 
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 shadow-md shadow-emerald-200 hover:shadow-lg transition-all active:scale-95"
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* View: Dental Problems */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                Dental Problems
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryAppointment?.medicalHistory?.dentalProblems?.length > 0 ? (
                  primaryAppointment.medicalHistory.dentalProblems.map((p, i) => (
                    <div className="transform transition-transform hover:scale-105" key={i}>
                       <Badge text={p} color="red" />
                    </div>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-sm border border-slate-100 italic">
                    No records found
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-50"></div>

            {/* View: Treatments */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                Treatments
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryAppointment?.medicalHistory?.treatments?.length > 0 ? (
                  primaryAppointment.medicalHistory.treatments.map((t, i) => (
                    <div className="transform transition-transform hover:scale-105" key={i}>
                        <Badge text={t} color="blue" />
                    </div>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-sm border border-slate-100 italic">
                    No records found
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-50"></div>

            {/* View: Medications */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Medications
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {primaryAppointment?.medicalHistory?.medications || (
                    <span className="text-slate-400 italic">No medications listed.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-50"></div>

            {/* View: Past Surgeries */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                Past Surgeries
              </p>
              <div className="flex flex-wrap gap-2">
                {primaryAppointment?.medicalHistory?.pastSurgeries?.length > 0 ? (
                  primaryAppointment.medicalHistory.pastSurgeries.map((s, i) => (
                    <div className="transform transition-transform hover:scale-105" key={i}>
                        <Badge text={s} color="purple" />
                    </div>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-sm border border-slate-100 italic">
                    No records found
                  </span>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistorySection;
