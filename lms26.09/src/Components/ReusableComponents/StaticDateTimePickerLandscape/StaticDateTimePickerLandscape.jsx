"use client"

import { useState } from "react"
import { X, Calendar } from "lucide-react"
import "./StaticDateTimePickerLandscape.css"

const CustomDateTimePicker = ({ selectedDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [selectedHour, setSelectedHour] = useState(selectedDate?.getHours() || new Date().getHours())
  const [selectedMinute, setSelectedMinute] = useState(selectedDate?.getMinutes() || new Date().getMinutes())
  const [isAM, setIsAM] = useState((selectedDate?.getHours() || new Date().getHours()) < 12)
  const [timeSelectionMode, setTimeSelectionMode] = useState("hour")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleClockClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = event.clientX - centerX
    const y = event.clientY - centerY

    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    const normalizedAngle = angle < 0 ? angle + 360 : angle

    if (timeSelectionMode === "hour") {
      // Select hour (0-11)
      const hour = Math.round(normalizedAngle / 30) % 12
      setSelectedHour(isAM ? hour : hour + 12)
      setTimeSelectionMode("minute") // Switch to minute selection
    } else {
      // Select minute in 5-minute increments
      const minute = (Math.round(normalizedAngle / 30) * 5) % 60
      setSelectedMinute(minute)
    }
  }

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate)
    newDate.setDate(day)
    setCurrentDate(newDate)
  }

  const handleMonthChange = (increment) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setCurrentDate(newDate)
  }

  const handleConfirm = () => {
    const newDate = new Date(currentDate)
    newDate.setHours(selectedHour, selectedMinute, 0)
    onDateChange(newDate)
    setIsOpen(false)
    setTimeSelectionMode("hour")
  }

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();

    const isToday = (day) => {
      return (
        currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth() &&
        day === today.getDate()
      );
    };

    const isSelected = (day) => {
      return currentDate.getDate() === day;
    };

    // ✅ Check if a date is in the past
    const isPastDate = (day) => {
      if (!day) return false;
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    return (
      <div className="date-calendar-container">
        {/* Calendar Header */}
        <div className="date-calendar-header">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="date-nav-button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 12l-4-4 4-4v8z" />
            </svg>
          </button>
          <h2 className="date-month-title">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="date-nav-button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 4l4 4-4 4V4z" />
            </svg>
          </button>
        </div>

        {/* Days of Week */}
        <div className="date-days-header">
          {daysOfWeek.map((day) => (
            <div key={day} className="date-day-label">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="date-calendar-grid">
          {days.map((day, index) => (
            <button
              key={index}
              type="button"
              onClick={() => day && !isPastDate(day) && handleDateSelect(day)}
              disabled={!day || isPastDate(day)} 
              className={`
              date-calendar-day
              ${!day ? "date-invisible" : ""}
              ${isToday(day) ? "date-today" : ""}
              ${isSelected(day) ? "date-selected" : ""}
              ${isPastDate(day) ? "date-disabled" : ""}
            `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderAnalogClock = () => {
    const hour12 = selectedHour % 12
    const hourAngle = hour12 * 30 - 90
    const minuteAngle = selectedMinute * 6 - 90

    return (
      <div className="date-clock-container">
        {/* Clock Header with prev/next */}
        <div className="date-clock-header">
          {/* Previous: switch to hour selection */}
          <button
            type="button"
            className="date-nav-button"
            onClick={() => setTimeSelectionMode("hour")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 12l-4-4 4-4v8z" />
            </svg>
          </button>

          {/* Next: switch to minute selection */}
          <button
            type="button"
            className="date-nav-button"
            onClick={() => setTimeSelectionMode("minute")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 4l4 4-4 4V4z" />
            </svg>
          </button>
        </div>


        <div className="date-clock-wrapper">
          <svg className="date-clock-svg" viewBox="0 0 200 200" onClick={handleClockClick}>
            {/* Clock Face */}
            <circle cx="100" cy="100" r="90" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" />

            {/* Numbers */}
            {timeSelectionMode === "hour"
              ? [...Array(12)].map((_, i) => {
                const hour = i === 0 ? 12 : i
                const angle = i * 30 - 90
                const x = 100 + 70 * Math.cos((angle * Math.PI) / 180)
                const y = 100 + 70 * Math.sin((angle * Math.PI) / 180)

                return (
                  <text key={i} x={x} y={y + 6} textAnchor="middle" className="date-clock-number">
                    {hour}
                  </text>
                )
              })
              : [...Array(12)].map((_, i) => {
                const minute = i * 5
                const displayMinute = minute === 0 ? "00" : minute.toString()
                const angle = i * 30 - 90
                const x = 100 + 70 * Math.cos((angle * Math.PI) / 180)
                const y = 100 + 70 * Math.sin((angle * Math.PI) / 180)

                return (
                  <text key={i} x={x} y={y + 6} textAnchor="middle" className="date-clock-number">
                    {displayMinute}
                  </text>
                )
              })}

            {/* Clock Hand */}
            <line
              x1="100"
              y1="100"
              x2={100 + 65 * Math.cos(((timeSelectionMode === "hour" ? hourAngle : minuteAngle) * Math.PI) / 180)}
              y2={100 + 65 * Math.sin(((timeSelectionMode === "hour" ? hourAngle : minuteAngle) * Math.PI) / 180)}
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Center Circle */}
            <circle cx="100" cy="100" r="6" fill="#3b82f6" />
          </svg>
        </div>

        {/* Time Display */}
        <div className="date-time-display">
          {String(selectedHour % 12 || 12).padStart(2, "0")}:{String(selectedMinute).padStart(2, "0")}
        </div>

        {/* AM/PM Toggle */}
        <div className="date-ampm-container">
          <button
            type="button"
            onClick={() => {
              setIsAM(true)
              if (selectedHour >= 12) setSelectedHour(selectedHour - 12)
            }}
            className={`date-ampm-button ${isAM ? "date-active" : ""}`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAM(false)
              if (selectedHour < 12) setSelectedHour(selectedHour + 12)
            }}
            className={`date-ampm-button ${!isAM ? "date-active" : ""}`}
          >
            PM
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="date-datetime-picker">
      {/* Input Field */}
      <div onClick={() => setIsOpen(true)} className="date-input-field mcq-form-control">
        <span className={selectedDate ? "date-input-text" : "date-input-placeholder"}>
          {selectedDate ? formatDate(selectedDate) : "Select date and time"}
        </span>
        <Calendar className="date-input-icon" />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="date-modal-overlay">
          <div className="date-modal-container">
            {/* Modal Header */}
            <div className="date-modal-header">
              <button onClick={() => setIsOpen(false)} className="date-close-button">
                <X className="date-close-icon" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="date-modal-body">
              <div className="date-calendar-section">{renderCalendar()}</div>
              <div className="date-clock-section">{renderAnalogClock()}</div>
            </div>

            {/* Modal Footer */}
            <div className="date-modal-footer">
              <button onClick={handleConfirm} className="date-ok-button">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDateTimePicker
