'use client';

import { useEffect, useState } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

type AnimationPhase = 'typing-first' | 'deleting-refin' | 'typing-final' | 'waiting';

export function TypingAnimation({
  text,
  speed = 100,
  deleteSpeed = 100,
  delay = 10000,
  className = '',
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<AnimationPhase>('typing-first');
  const [currentIndex, setCurrentIndex] = useState(0);

  const firstText = 'Refin your english';
  const finalText = 'Refine your English';
  const textAfterDeletion = 'Refin';

  useEffect(() => {
    const timeout = setTimeout(() => {
      switch (phase) {
        case 'typing-first': {
          if (currentIndex < firstText.length) {
            setDisplayedText(firstText.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            setTimeout(() => {
              setPhase('deleting-refin');
            }, 300);
          }
          break;
        }
        case 'deleting-refin': {
          if (currentIndex > textAfterDeletion.length) {
            setCurrentIndex(currentIndex - 1);
            setDisplayedText(firstText.slice(0, currentIndex - 1));
          } else {
            setPhase('typing-final');
            setCurrentIndex(textAfterDeletion.length);
          }
          break;
        }
        case 'typing-final': {
          if (currentIndex < finalText.length) {
            setDisplayedText(finalText.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            setTimeout(() => {
              setPhase('waiting');
            }, delay);
          }
          break;
        }
        case 'waiting': {
          setPhase('typing-first');
          setCurrentIndex(0);
          setDisplayedText('');
          break;
        }
      }
    }, phase === 'deleting-refin' ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, phase, speed, deleteSpeed, delay]);

  return (
    <span className={className}>
      {displayedText}
      <span className={`animate-pulse ${phase === 'deleting-refin' || phase === 'waiting' ? 'opacity-10' : 'opacity-30'}`}>|</span>
    </span>
  );
}
