import React, { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({ minutes = 5, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: minutes,
    seconds: 0
  });
  
  const endTimeRef = useRef(null);

  useEffect(() => {
    // Set end time 5 minutes from now (persists in sessionStorage)
    const storedEndTime = sessionStorage.getItem('countdownEndTime');
    
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime);
      if (endTime > Date.now()) {
        endTimeRef.current = endTime;
      } else {
        // Timer expired, reset it
        endTimeRef.current = Date.now() + (minutes * 60 * 1000);
        sessionStorage.setItem('countdownEndTime', endTimeRef.current.toString());
      }
    } else {
      endTimeRef.current = Date.now() + (minutes * 60 * 1000);
      sessionStorage.setItem('countdownEndTime', endTimeRef.current.toString());
    }
    
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTimeRef.current - now;
      
      if (difference <= 0) {
        if (onExpire) onExpire();
        // Reset timer
        endTimeRef.current = Date.now() + (minutes * 60 * 1000);
        sessionStorage.setItem('countdownEndTime', endTimeRef.current.toString());
        return;
      }

      const mins = Math.floor(difference / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ minutes: mins, seconds: secs });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [minutes, onExpire]);

  const TimeBox = ({ value, label }) => (
    <div className="bg-black rounded-xl px-4 py-2 text-center" data-testid={`countdown-${label.toLowerCase()}`}>
      <div className="text-3xl md:text-4xl font-extrabold text-yellow-400">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-white/80 font-bold mt-0.5">{label}</div>
    </div>
  );

  return (
    <div className="flex items-center gap-3" data-testid="countdown-timer">
      <TimeBox value={timeLeft.minutes} label="Min" />
      <span className="text-3xl font-black text-red-600 animate-bounce">:</span>
      <TimeBox value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;
