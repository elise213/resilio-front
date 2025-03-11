import React from "react";

const ScheduleInfo = ({ schedule, scheduleCategory }) => {
  if (scheduleCategory === "Closed Everyday") {
    return (
      <span className="info-address" style={{ border: "none" }}>
        <span className="modal-info-title">Schedule</span>
        Closed Everyday
      </span>
    );
  }

  if (scheduleCategory === "Open 24 Hours") {
    return (
      <>
        <span className="modal-info-title">Hours</span>
        <span className="info-address">Open 24/7</span>
      </>
    );
  }

  return (
    <>
      <div className="info-address" style={{ border: "none" }}>
        <span className="modal-info-title">Hours</span>
        <div className="schedule-info">
          <div className="schedule-table">
            <div className="schedule-column" style={{ paddingRight: "10px" }}>
              {Object.keys(schedule).map((day, index) => (
                <div key={index} className="schedule-day">
                  {day.charAt(0).toUpperCase() + day.slice(1)}:
                </div>
              ))}
            </div>
            <div className="schedule-column">
              {Object.values(schedule).map((time, index) => (
                <div key={index} className="schedule-time">
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleInfo;
