'use client';

import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function TypingAnimation({
  text,
  speed = 50,
  deleteSpeed = 50,
  delay = 20000,
  className = '',
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => {
            setIsDeleting(true);
          }, delay);
        }
      } else {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setDisplayedText(text.slice(0, currentIndex - 1));
        } else {
          setIsDeleting(false);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, text, speed, deleteSpeed, delay]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
