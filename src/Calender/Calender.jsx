import React, { useState, useEffect, useRef } from "react";

const hours = Array.from({ length: 24 }, (_, i) => `${i+1}:00`);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [modalDayIndex, setModalDayIndex] = useState(null);
  const [modalHourIndex, setModalHourIndex] = useState(null);
  const [events, setEvents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("weekly-events"));
    if (savedEvents) setEvents(savedEvents);
  }, []);

useEffect(() => {
  if (isInitialMount.current) {
    isInitialMount.current = false; // Skip first render
    return;
  }
  localStorage.setItem("weekly-events", JSON.stringify(events));
}, [events]);


  function handleCellClick(day, hour) {
    setModalOpen(true);
    setModalDayIndex(day);
    setModalHourIndex(hour);
    setStartTime(`${hour.toString().padStart(2, "0")}:00`);
    setEndTime(`${(hour + 1).toString().padStart(2, "0")}:00`);
    setTitle("");
    setEditIndex(null);
  }

  function handleAddOrEditEvent() {
    if (!title.trim()) return;
    const newEvent = {
      title,
      startTime,
      endTime,
      dayIndex: modalDayIndex,
      hourIndex: modalHourIndex,
    };

    if (editIndex !== null) {
      const updated = [...events];
      updated[editIndex] = newEvent;
      setEvents(updated);
    } else {
      setEvents(prev => [...prev, newEvent]);
    }

    setModalOpen(false);
    setTitle("");
  }

  function handleDelete(index) {
    const updated = events.filter((_, i) => i !== index);
    setEvents(updated);
  }

  function handleEdit(index, event) {
    setModalOpen(true);
    setEditIndex(index);
    setTitle(event.title);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setModalDayIndex(event.dayIndex);
    setModalHourIndex(event.hourIndex);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r  from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto border-2 border-zinc-400 rounded-md">
         {modalOpen && (
          <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
              <h2 className="text-lg font-bold mb-3">{editIndex !== null ? "Edit" : "Add"} Event</h2>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border border-gray-300 p-2 mb-2 rounded"
              />
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full border border-gray-300 p-2 mb-2 rounded"
              />
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full border border-gray-300 p-2 mb-4 rounded"
              />
              <div className="flex justify-end gap-2">
                <button onClick={handleAddOrEditEvent} className="bg-blue-500 text-white px-4 py-1 rounded">
                  {editIndex !== null ? "Update" : "Add"}
                </button>
                <button onClick={() => setModalOpen(false)} className="text-gray-600 px-4 py-1">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="grid grid-cols-8 bg-white rounded-t-md shadow-md overflow-hidden">
          <div className="p-2 font-semibold text-center bg-gray-200">Time</div>
          {days.map(day => (
            <div key={day} className="p-2 font-semibold text-center bg-gray-100">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8 border-l border-t border-gray-300">
          {/* Time labels */}
          <div className="flex flex-col">
            {hours.map(hr => (
              <div key={hr} className="h-[60px] border-b border-gray-300 text-sm text-gray-600 p-1">
                {hr}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {Array.from({ length: 7 }).map((_, dayIndex) => (
            <div key={dayIndex} className="flex flex-col">
              {hours.map((_, hourIndex) => (
                <div
                  key={hourIndex}
                  onClick={() => handleCellClick(dayIndex, hourIndex)}
                  className="h-[60px] border-b border-r border-gray-300 relative cursor-pointer hover:bg-blue-50"
                >
                  {events.map((event, index) => (
                    event.dayIndex === dayIndex && event.hourIndex === hourIndex ? (
                      <div
                        key={index}
                        className="absolute inset-1 bg-blue-600 text-white text-xs p-1 rounded shadow flex justify-between items-center"
                      >
                        <span>{event.title}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); handleEdit(index, event); }}
                            className="text-white text-sm hover:scale-110"
                          >✏️</button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(index); }}
                            className="text-white text-sm hover:scale-110"
                          >❌</button>
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
