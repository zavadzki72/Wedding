import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const weddingDate = new Date('April 20, 2026 16:00:00').getTime();
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        setCountdown("FELIZES PARA SEMPRE!");
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}D ${hours}H ${minutes}M ${seconds}S`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span id="countdown">{countdown || 'CONTANDO OS DIAS...'}</span>;
};

export default Countdown;