import React from "react";
import { User, Calendar, Phone, Mail, Stethoscope } from "lucide-react";
import InfoRow from "./InfoRow";

const PatientProfileCard = ({ primaryAppointment }) => {
  return (
    <div className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* --- Header Section --- */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="relative z-10 flex items-center space-x-5">
          {/* Avatar */}
          <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-white/30 shrink-0">
            <User size={32} className="text-white drop-shadow-md" />
          </div>

          {/* Text Info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight truncate tracking-tight">
              {primaryAppointment?.patientName}
            </h2>
            <div className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="text-blue-50 text-xs sm:text-sm font-mono tracking-wide">
                ID: {primaryAppointment?.appointmentId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Body Content --- */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-5">
          {/* We pass slightly styled icons to InfoRow */}
          <InfoRow
            icon={<Mail size={20} className="text-blue-500" />}
            label="Email Address"
            value={primaryAppointment?.patientEmail}
            truncate
          />
          <InfoRow
            icon={<Phone size={20} className="text-blue-500" />}
            label="Phone Number"
            value={primaryAppointment?.patientPhone}
          />
          <InfoRow
            icon={<Calendar size={20} className="text-blue-500" />}
            label="Registration Date"
            value={
              primaryAppointment?.createdAt
                ? new Date(primaryAppointment.createdAt).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoRow
            icon={<Stethoscope size={20} className="text-blue-500" />}
            label="Primary Doctor"
            value={primaryAppointment?.doctor?.name}
          />
        </div>

        {/* --- Footer / Status --- */}
        <div className="pt-5 border-t border-slate-100 flex justify-between items-end">
          <div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
              Last Visit
            </p>
            <p className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              {primaryAppointment?.date
                ? new Date(primaryAppointment.date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wide">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileCard;
