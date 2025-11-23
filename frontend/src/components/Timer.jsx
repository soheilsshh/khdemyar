"use client";

import React, { useState, useEffect } from "react";

export default function Timer({ seconds }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return <span>{timeLeft <= 0 ? "00:00" : formatTime(timeLeft)}</span>;
}