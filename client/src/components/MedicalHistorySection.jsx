import React from 'react';
import { Activity, Edit2, Check, X, AlertCircle, Pill, Stethoscope, FileText } from 'lucide-react';
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
  handleCancelEditMedicalHistory,
  handleSaveMedicalHistory
}) => {
  return (
    <div className="relative group bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-100/50">
      
      {/* Decorative Top Gradient Line to distinguish this card */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-orange-400"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100 bg-white relative z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
             <Activity size={22} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">Medical History</h2>
            <p className="text-xs text-slate-400 font-medium">Patient Clinical Records</p>
          </div>
        </div>
        
        {isAdmin && !isEditingMedicalHistory && (
          <button 
            onClick={handleEditMedicalHistory} 
            className="group/btn flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs sm:text-sm font-bold hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm active:scale-95"
          >
            <Edit2 size={14} className="group-hover/btn:scale-110 transition-transform" />
            <span>Update</span>
          </button>
        )}
      </div>
      
      {/* Body */}
      <div className="p-5 sm:p-7 bg-slate-50/30">
        {isEditingMedicalHistory ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
            
            {/* Edit: Dental Problems */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                <AlertCircle size={14} className="text-rose-500" /> Dental Problems
              </label>
              <textarea 
                value={editableDentalProblems.join(', ')} 
                onChange={(e) => setEditableDentalProblems(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))} 
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-sm resize-none shadow-inner" 
                rows="2"
                placeholder="e.g. Cavities, Gingivitis"
              ></textarea>
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Separate conditions with commas</p>
            </div>

            {/* Edit: Treatments */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                <Stethoscope size={14} className="text-blue-500" /> Treatments
              </label>
              <textarea 
                value={editableTreatments.join(', ')} 
                onChange={(e) => setEditableTreatments(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))} 
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm resize-none shadow-inner" 
                rows="2"
                placeholder="e.g. Root Canal, Scaling"
              ></textarea>
            </div>

            {/* Edit: Medications */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                <Pill size={14} className="text-amber-500" /> Medications
              </label>
              <textarea 
                value={editableMedications} 
                onChange={(e) => setEditableMedications(e.target.value)} 
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-sm resize-none shadow-inner" 
                rows="3"
                placeholder="List current medications..."
              ></textarea>
            </div>

            {/* Edit Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={handleCancelEditMedicalHistory} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSaveMedicalHistory} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
              >
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            
            {/* View: Dental Problems */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <AlertCircle size={60} className="text-rose-500" />
              </div>
              <p className="relative z-10 text-xs font-bold text-rose-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle size={14} /> Dental Problems
              </p>
              <div className="relative z-10 flex flex-wrap gap-2">
                {primaryAppointment?.medicalHistory?.dentalProblems?.length > 0 ? (
                  primaryAppointment.medicalHistory.dentalProblems.map((p, i) => (
                    <div className="transform transition-transform hover:scale-105" key={i}>
                       <Badge text={p} color="red" />
                    </div>
                  ))
                ) : (
                  <div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-3 text-center">
                    <span className="text-slate-400 text-sm font-medium italic">No dental issues recorded</span>
                  </div>
                )}
              </div>
            </div>

            {/* View: Treatments */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <Stethoscope size={60} className="text-blue-500" />
              </div>
              <p className="relative z-10 text-xs font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                 <Stethoscope size={14} /> Treatments History
              </p>
              <div className="relative z-10 flex flex-wrap gap-2">
                {primaryAppointment?.medicalHistory?.treatments?.length > 0 ? (
                  primaryAppointment.medicalHistory.treatments.map((t, i) => (
                    <div className="transform transition-transform hover:scale-105" key={i}>
                        <Badge text={t} color="blue" />
                    </div>
                  ))
                ) : (
                   <div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-3 text-center">
                    <span className="text-slate-400 text-sm font-medium italic">No treatments recorded</span>
                  </div>
                )}
              </div>
            </div>

            {/* View: Medications (Full Width on Desktop) */}
            <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-sm">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Pill size={14} /> Current Medications
              </p>
              <div className="bg-white rounded-xl p-4 border border-amber-100/50 shadow-sm">
                 <div className="flex gap-3">
                    <div className="mt-1 hidden sm:block">
                        <FileText size={18} className="text-amber-300" />
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {primaryAppointment?.medicalHistory?.medications || (
                        <span className="text-slate-400 font-normal italic">No active medications listed for this patient.</span>
                    )}
                    </p>
                 </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistorySection;