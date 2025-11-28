import React from 'react';
import { Activity } from 'lucide-react';
import Badge from './Badge'; // Assuming Badge is in the same components directory

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
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="text-rose-500" size={20} />
          <h2 className="text-lg font-bold text-gray-800">Medical History</h2>
        </div>
        {isAdmin && !isEditingMedicalHistory && (
          <button onClick={handleEditMedicalHistory} className="px-3 py-1 bg-indigo-500 text-white rounded-xl text-sm hover:bg-indigo-600 transition-colors shadow-sm">Edit</button>
        )}
      </div>
      
      {isEditingMedicalHistory ? (
        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase text-gray-400 font-semibold mb-2 ml-1">Dental Problems (comma-separated)</label>
            <textarea value={editableDentalProblems.join(', ')} onChange={(e) => setEditableDentalProblems(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))} className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white" rows="3"></textarea>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 font-semibold mb-2 ml-1">Treatments (comma-separated)</label>
            <textarea value={editableTreatments.join(', ')} onChange={(e) => setEditableTreatments(e.target.value.split(',').map(item => item.trim()).filter(item => item !== ''))} className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white" rows="3"></textarea>
          </div>
          <div>
            <label className="block text-xs uppercase text-gray-400 font-semibold mb-1 ml-1">Medications</label>
            <textarea value={editableMedications} onChange={(e) => setEditableMedications(e.target.value)} className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white" rows="3"></textarea>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleCancelEditMedicalHistory} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">Cancel</button>
            <button onClick={handleSaveMedicalHistory} className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-sm">Save</button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase text-gray-400 font-semibold mb-2">Dental Problems</p>
            <div className="flex flex-wrap gap-2">
              {primaryAppointment?.medicalHistory?.dentalProblems?.length > 0 ? (
                primaryAppointment.medicalHistory.dentalProblems.map((p, i) => <Badge key={i} text={p} color="red" />)
              ) : <span className="text-sm text-gray-500 italic">None</span>}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 font-semibold mb-2">Treatments</p>
            <div className="flex flex-wrap gap-2">
              {primaryAppointment?.medicalHistory?.treatments?.length > 0 ? (
                primaryAppointment.medicalHistory.treatments.map((t, i) => <Badge key={i} text={t} color="blue" />)
              ) : <span className="text-sm text-gray-500 italic">None</span>}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase text-gray-400 font-semibold mb-1">Medications</p>
            <span className="text-sm text-gray-500 italic">{primaryAppointment?.medicalHistory?.medications || 'None'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistorySection;
