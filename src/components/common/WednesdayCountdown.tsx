import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getNextSessionTargetDate } from '../../utils/dateHelpers';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const WednesdayCountdown: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = getNextSessionTargetDate();
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/40 backdrop-blur-md text-white text-xs font-bold shadow-md">
      <div className="flex items-center gap-1.5 text-brand-orange">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span className="uppercase tracking-wider">NEXT SESSION IN:</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-white">
        <span className="bg-navy-950/80 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.days).padStart(2, '0')}d</span>
        <span>:</span>
        <span className="bg-navy-950/80 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span>:</span>
        <span className="bg-navy-950/80 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span>:</span>
        <span className="bg-brand-orange text-white px-1.5 py-0.5 rounded animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
};
