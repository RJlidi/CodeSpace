import { useRef } from 'react';

export const useDebounce = () => {
  const timeoutRef = useRef<number | null>(null);

  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    };
  };

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return { debounce, cleanup };
};