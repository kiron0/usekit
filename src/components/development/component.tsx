"use client"

import { useTimeOfDay } from "registry/hooks/use-time-of-day"

export function Component() {
  const timeOfDay = useTimeOfDay()

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 500,
        margin: "0 auto",
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>
        Current Time of Day: <code>{timeOfDay}</code>
      </h2>
      <p>
        The current time of day is dynamically determined and can be used to
        adjust UI elements accordingly.
      </p>
      <p>
        For example, you can change the background color based on the time of
        day:{" "}
        <code>
          backgroundColor:{" "}
          {timeOfDay === "morning"
            ? "#FFFAF0"
            : timeOfDay === "afternoon"
              ? "#FFFACD"
              : timeOfDay === "evening"
                ? "#F0E68C"
                : "#2F4F4F"}
        </code>
      </p>
      <div
        style={{
          padding: "16px",
          backgroundColor:
            timeOfDay === "morning"
              ? "#FFFAF0"
              : timeOfDay === "afternoon"
                ? "#FFFACD"
                : timeOfDay === "evening"
                  ? "#F0E68C"
                  : "#2F4F4F",
          color: "#333",
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s ease",
          textAlign: "center",
          margin: "16px 0",
        }}
      >
        This box changes color based on the time of day.
      </div>
    </div>
  )
}
