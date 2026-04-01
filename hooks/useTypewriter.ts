import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed = 15) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i >= text.length) { clearInterval(timer); return; }
      setDisplayed(prev => prev + text[i]);
      i++;
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return displayed;
}
