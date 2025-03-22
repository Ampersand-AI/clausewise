
import { useState, useCallback, useEffect } from "react";

export function useExpandedPreview() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Auto-expand on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsExpanded(true);
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isExpanded,
    toggleExpanded,
    setIsExpanded
  };
}
