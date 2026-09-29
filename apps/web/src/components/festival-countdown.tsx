"use client";

import { useEffect, useState } from "react";
import {
  bsToAd,
  differenceInDays,
  todayInNepal,
  type BsDate,
} from "@merodin/date";

export function FestivalCountdown({ date }: { date: BsDate }) {
  const [countdown, setCountdown] = useState("Checking date");

  useEffect(() => {
    const days = differenceInDays(todayInNepal(), bsToAd(date));
    setCountdown(
      days < 0
        ? "This year's date has passed"
        : days === 0
          ? "Today"
          : days === 1
            ? "Tomorrow"
            : `${days} days to go`,
    );
  }, [date]);

  return (
    <p aria-live="polite" className="festival-countdown">
      {countdown}
    </p>
  );
}
