import { useEffect, useState } from "react";

export function useCountdown(endTime: number | null) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    function tick() {
      setNow(Date.now());
    }

    const timeout = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [endTime]);

  const remaining = endTime && now ? Math.max(endTime - now, 0) : 0;
  const isRunning = remaining > 0;

  return { remaining, isRunning };
}
