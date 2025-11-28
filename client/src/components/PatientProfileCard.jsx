import React from 'react';
import { User, Calendar, Phone, Mail, Stethoscope } from 'lucide-react';
import InfoRow from './InfoRow'; // Assuming InfoRow is in the same components directory

const PatientProfileCard = ({ primaryAppointment }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full text-white backdrop-blur-sm">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">{primaryAppointment?.patientName}</h2>
            <p className="text-blue-100 text-sm mt-1 font-mono">ID: {primaryAppointment?.appointmentId}</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <InfoRow icon={<Mail size={18} />} label="Email" value={primaryAppointment?.patientEmail} truncate />
        <InfoRow icon={<Phone size={18} />} label="Phone" value={primaryAppointment?.patientPhone} />
        <InfoRow icon={<Calendar size={18} />} label="Registered" value={primaryAppointment?.createdAt ? new Date(primaryAppointment.createdAt).toLocaleDateString() : 'N/A'} />
        <InfoRow icon={<Stethoscope size={18} />} label="Primary Dentist" value={primaryAppointment?.doctor?.name} />
        <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-center">
           <div>
             <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Last Visit</p>
             <p className="text-sm font-bold text-gray-800 mt-1">{primaryAppointment?.date ? new Date(primaryAppointment.date).toLocaleDateString() : 'N/A'}</p>
           </div>
           <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium border border-green-100">Active Patient</span>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileCard;
