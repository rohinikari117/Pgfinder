import React, { useState } from 'react';
import { X, Calendar, Clock, Check, User, Phone, GraduationCap, MapPin } from 'lucide-react';
import { PGProperty, College } from '../types/pg';

interface VisitBookingModalProps {
  property: PGProperty | null;
  college: College;
  isOpen: boolean;
  onClose: () => void;
}

export const VisitBookingModal: React.FC<VisitBookingModalProps> = ({
  property,
  college,
  isOpen,
  onClose,
}) => {
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('5:00 PM - 6:30 PM (Evening)');
  const [roomPref, setRoomPref] = useState<string>(property?.roomOptions[0]?.type || '2-sharing');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !phone) return;

    // Send WhatsApp notification as well
    const text = encodeURIComponent(
      `Hello ${property.ownerContact.name}, I have scheduled a room inspection visit for "${property.name}" on ${date || 'Tomorrow'} (${timeSlot}) for a ${roomPref} room. My name is ${studentName} (${phone}). Looking forward to visiting!`
    );
    window.open(`https://wa.me/${property.ownerContact.whatsapp}?text=${text}`, '_blank');

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Schedule Free Room Visit</h3>
            <p className="text-xs text-slate-400">Inspect the room, taste the food, test the Wi-Fi</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Visit Scheduled with Owner!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                We have notified <strong>{property.ownerContact.name}</strong> on WhatsApp. They will keep the room unlocked for your visit.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-bold text-slate-800">{property.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-slate-700 truncate max-w-[220px]">{property.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Owner Contact:</span>
                  <span className="font-bold text-emerald-700">{property.ownerContact.phone}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                <img
                  src={property.photos[0]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">{property.name}</h4>
                  <p className="text-[11px] text-emerald-800">
                    🚶 {property.collegeProximities[0]?.distanceMeters}m from {college.shortName}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohith Varma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp / Phone Number *</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9848012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                  >
                    <option value="10:00 AM - 12:00 PM (Morning)">10:00 AM - 12:00 PM</option>
                    <option value="2:00 PM - 4:00 PM (Afternoon)">2:00 PM - 4:00 PM</option>
                    <option value="5:00 PM - 7:00 PM (Evening)">5:00 PM - 7:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interested Sharing Type</label>
                <select
                  value={roomPref}
                  onChange={(e) => setRoomPref(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {property.roomOptions.map((r) => (
                    <option key={r.type} value={r.type}>
                      {r.label} — ₹{r.pricePerMonth.toLocaleString('en-IN')}/mo
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirm Free Visit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
